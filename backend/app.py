import os
from flask import Flask, flash, request, redirect, url_for, render_template
import uuid
from flask_cors import CORS
from werkzeug.utils import secure_filename

import librosa as lr
import ffmpeg
import mass_ts as mts
from scipy.fft import fft, ifft
import numpy as np
import soundfile as sf
from pydub import AudioSegment

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"

ALLOWED_EXTENSIONS = set(['mp4', 'm4a', 'mp3'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_audio(vfile):
    stream = ffmpeg.input(vfile)
    out = ffmpeg.output(stream.audio, 'out.mp3')
    out.run(overwrite_output=True)

def clean_track(track, samp = 22050//4):
    ff_track = fft(track)
    freq_track = np.fft.fftfreq(len(track), d=1/samp)
    ff_track[(freq_track >= 4000) | (freq_track < 300)] = 0
    recon_track = np.real(ifft(ff_track))
    return recon_track

def sim(main, query, sr = 22050//4):
# main is good
#     batch_sz = sr * 10
    batch_sz = len(main) // 10
#     idxs, dists = mts.mass2_batch(main, query, batch_size=len(query), top_matches=len(main) // len(query) - 1, n_jobs=16)
    idxs, dists = mts.mass2_batch(main, query, batch_size=batch_sz, top_matches=len(main) // batch_sz - 1, n_jobs=6)
    return idxs[np.argsort(dists)]

def patch(filenames):
	vid = filenames[0]
	aud = filenames[1]
	extract_audio(os.path.join(app.config['UPLOAD_FOLDER'], vid))
	x, sr = lr.core.load('out.mp3', sr=22050//4)
	good_x, good_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=sr)
	recon_good = clean_track(good_x)
	recon_x = clean_track(x)
	idxs = sim(recon_good, recon_x[40*sr:45*sr])
	offset = idxs[0] - 40*sr
	x_dur = len(x) / sr
	clean_x, clean_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=48000)
	start_clean = int(np.round(offset / sr * clean_sr))
	end_clean = start_clean + int(np.round(x_dur * clean_sr))
	clean_trimmed = clean_x[start_clean:end_clean + 1]
	sf.write('fixed.wav', clean_trimmed, clean_sr, 'PCM_16')
	vfile = os.path.join(app.config['UPLOAD_FOLDER'], vid)
	stream = ffmpeg.input(vfile)
	stream2 = ffmpeg.input('fixed.wav')
	out = ffmpeg.output(stream.video, stream2.audio, 'fixed.mp4')
	out.run(overwrite_output=True)
	print("done patching")





@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the files part
        if 'videoFile' not in request.files or 'audioFile' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file1 = request.files['videoFile']
        file2 = request.files['audioFile']
        files = [file1, file2]
        filenames = []
        for file in files:
            if file and allowed_file(file.filename):
                filesplit = secure_filename(file.filename).split(".")
                filename = str(uuid.uuid4()) + '.' + filesplit[1]
                filenames.append(filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        patch(filenames)
        flash('File(s) successfully uploaded')
        return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)
