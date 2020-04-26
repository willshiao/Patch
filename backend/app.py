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

# Gets audio track from a video file
def extract_audio(vfile):
    stream = ffmpeg.input(vfile)
    audioname = str(uuid.uuid4()) + '.mp3'
    out = ffmpeg.output(stream.audio, 'output/' + audioname)
    out.run(overwrite_output=True)
    return audioname

# Removes high and low freq components
def clean_track(track, samp = 22050//4):
    ff_track = fft(track)
    freq_track = np.fft.fftfreq(len(track), d=1/samp)
    ff_track[(freq_track >= 4000) | (freq_track < 300)] = 0
    recon_track = np.real(ifft(ff_track))
    return recon_track

def sim(main, query, sr=22050//4):
    # main is good track
    batch_sz = len(main) // 10
    idxs, dists = mts.mass2_batch(main, query, batch_size=batch_sz, top_matches=len(main) // batch_sz - 1, n_jobs=6)
    return idxs[np.argsort(dists)]

def patch(filenames):
    vid = filenames[0]
    aud = filenames[1]
    extracted_name = extract_audio(os.path.join(app.config['UPLOAD_FOLDER'], vid))
    # Read at low sample rate
    x, sr = lr.core.load('output/' + extracted_name, sr=22050//4)
    good_x, good_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=sr)

    # Remove high and low freqs
    recon_good = clean_track(good_x)
    recon_x = clean_track(x)

    # Perform MASS
    # TODO: randomize start and end indices and do majority voting
    OFF_START = 40
    OFF_END = 45
    idxs = sim(recon_good, recon_x[OFF_START*sr:OFF_END*sr])
    offset = idxs[0] - OFF_START*sr
    offset_dur = offset / sr
    x_dur = len(x) / sr

    # Load in a high quality version
    clean_x, clean_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=48000)
    start_clean = int(np.round(offset / sr * clean_sr))
    end_clean = start_clean + int(np.round(x_dur * clean_sr))
    clean_trimmed = clean_x[start_clean:end_clean + 1]

    # Save cleaned file as a wav
    trimmed_name = str(uuid.uuid4()) + '.wav'
    sf.write('output/' + trimmed_name, clean_trimmed, clean_sr, 'PCM_16')

    # Patch video
    vfile = os.path.join(app.config['UPLOAD_FOLDER'], vid)
    stream = ffmpeg.input(vfile)
    stream2 = ffmpeg.input('output/' + trimmed_name)
    output_video_name = str(uuid.uuid4()) + '.mp4'
    out = ffmpeg.output(stream.video, stream2.audio, 'output/' + output_video_name)
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
