import os
import hashlib
import uuid
import json
import io
from flask import Flask, flash, request, redirect, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from google.cloud import storage, speech_v1
from google.cloud.speech_v1 import enums

from matrixprofile import matrixProfile
import librosa as lr
import ffmpeg
import mass_ts as mts
from scipy.fft import fft, ifft
import numpy as np
import soundfile as sf
import redis

USE_REDIS = True
UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"

ALLOWED_EXTENSIONS = set(['mp4', 'm4a', 'mp3'])

if USE_REDIS:
    # Yes, I know this is bad practice
    # But, even if you have the IP, access is limited
    # And it's 4:20 AM so I'm tired
    red = redis.Redis(host='10.163.88.147', port=6379)

def to_timestamp(sec):
    hours = str(sec // 3600).rjust(2, '0')
    left = sec % 3600
    mins = str(left // 60).rjust(2, '0')
    secs = str(left % 60).rjust(2, '0')
    return f'{hours}:{mins}:{secs}'

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

# Finds bad parts of audio
def find_bad(seg, sr):
    prof = matrixProfile.scrimp_plus_plus(seg, sr * 3, runtime=30)
    mat_prof = prof[0]
    prof_mean = np.mean(mat_prof[~np.isnan(mat_prof)])
    is_under = (mat_prof < prof_mean)
    out = []
    pers = []
    wind_sz = sr
    for i in range(len(is_under) - wind_sz):
        sec = is_under[i:i+wind_sz]
        cnt = sec.sum()
        percent_bad = cnt / wind_sz
        pers.append(percent_bad)
        out.append((cnt, i))

    per_mean = np.mean(pers)
    per_dev = np.std(pers)
    out_filt = [out[i] for i, per in enumerate(pers) if per < per_mean + 0.5 * per_dev]

    out_filt.sort(reverse=True)
    secs = []
    seen = set()
    for cnt, time in out_filt:
        rounded = int(np.round(time / sr))
        if rounded in seen:
            continue
        else:
            seen.add(rounded)
            secs.append(rounded)
    return secs

# Converts bad parts of audio into intervals
def into_intervals(bad_secs):
    secs_sorted = sorted(bad_secs)
    int_start = secs_sorted[0]
    last_int = secs_sorted[0]
    ints = []
    for i in range(1, len(secs_sorted)):
        curr = secs_sorted[i]
        if curr - last_int > 1:
            ints.append((int_start, last_int))
            int_start = curr
        last_int = curr
    ints.append((int_start, last_int))
    return ints

# Patches selected portions of the audio
def patch_audio(original, good, offset_dur, ints, new_sr):
    offset = int(np.round(offset_dur * new_sr))
    for st, end in ints:
        print('Patching:', (st, end))
        # patch_len = (end - st) * new_sr
        print('idxs:', (offset + st * new_sr, offset + end * new_sr))
        original[st * new_sr:end * new_sr] = good[offset + st * new_sr:offset + end * new_sr]
    return original

def hash_file(file_path):
    cur_hash = hashlib.sha256()
    with open(file_path, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            cur_hash.update(buf)
            buf = f.read(65536)
    return cur_hash.hexdigest()


def patch(filenames):
    vid = filenames[0]
    aud = filenames[1]
    vid_path = os.path.join(app.config['UPLOAD_FOLDER'], vid)
    aud_path = os.path.join(app.config['UPLOAD_FOLDER'], aud)

    if USE_REDIS:
        aud_hash = hash_file(aud_path)
        vid_hash = hash_file(vid_path)
        all_hash = aud_hash + vid_hash
        if red.exists(all_hash):
            print('Redis cache hit!')
            bad_ints = json.loads(red.hget(all_hash, 'bad_ints'))
            output_video_name = str(red.hget(all_hash, 'vid_name'), 'utf8')
            text = json.loads(red.hget(all_hash, 'text'))
            return bad_ints, output_video_name, text
        print('Redis cache miss :(')

    extracted_name = extract_audio(vid_path)
    # Read at low sample rate
    x, sr = lr.core.load('output/' + extracted_name, sr=22050//4)
    good_x, good_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=sr)

    # Remove high and low freqs
    recon_good = clean_track(good_x)
    recon_x = clean_track(x)

    # Perform MASS
    # TODO: randomize start and end indices and do majority voting
    print('Performing MASS')
    off_start = 40
    off_end = 45
    offset_dur = -1
    while offset_dur < 0:
        idxs = sim(recon_good, recon_x[off_start*sr:off_end*sr])
        offset = idxs[0] - off_start*sr
        offset_dur = offset / sr
        # x_dur = len(x) / sr
        off_start += 3
        off_end += 3
    print('Offset: ', offset)
    print('Offset Duration: ', offset_dur)

    # Find bad portions
    print('Finding bad portions')
    bad_pieces = find_bad(x, sr)
    bad_ints = into_intervals(bad_pieces)

    # Load in high quality versions
    clean_x, clean_sr = lr.core.load(os.path.join(app.config['UPLOAD_FOLDER'], aud), sr=48000)
    clean_orig_x, _ = lr.core.load(os.path.join('output', extracted_name), sr=48000)

    # start_clean = int(np.round(offset / sr * clean_sr))
    # end_clean = start_clean + int(np.round(x_dur * clean_sr))
    # clean_trimmed = clean_x[start_clean:end_clean + 1]

    # Patch original audio
    patch_audio(clean_orig_x, clean_x, offset_dur, bad_ints, clean_sr)

    # Save cleaned file as a wav
    # trimmed_name = str(uuid.uuid4()) + '.wav'
    # sf.write('output/' + trimmed_name, clean_trimmed, clean_sr, 'PCM_16')

    # Save patched file
    patched_name = str(uuid.uuid4()) + '.wav'
    sf.write(os.path.join('output', patched_name), clean_orig_x, clean_sr, 'PCM_16')

    # Patch video
    stream = ffmpeg.input(vid_path)
    # stream2 = ffmpeg.input('output/' + trimmed_name)
    stream2 = ffmpeg.input(os.path.join('output/', patched_name))
    output_video_name = str(uuid.uuid4()) + '.mp4'
    out = ffmpeg.output(stream.video, stream2.audio, 'output/' + output_video_name)
    out.run(overwrite_output=True)
    print(f"Done patching {output_video_name}")

    text = []
    # Get text transcription of intervals
    for st, end in bad_ints:
        piece = clean_x[offset + st * clean_sr:offset + end * clean_sr]
        out_fn = os.path.join('output', str(uuid.uuid4()) + '.wav')
        sf.write(out_fn, piece, clean_sr, 'PCM_16')
        # TODO: Do transcription here
        transcription = speech_to_text(out_fn)
        text.append(transcription)
        os.remove(out_fn)

    if USE_REDIS:
        red.hset(all_hash, 'bad_ints', json.dumps(bad_ints))
        red.hset(all_hash, 'vid_name', output_video_name)
        red.hset(all_hash, 'text', json.dumps(text))

    return bad_ints, output_video_name, text

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    # bucket_name = "your-bucket-name"
    # source_file_name = "local/path/to/file"
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)
    blob.make_public()

    return blob.public_url

def speech_to_text(local_file_path):
    client = speech_v1.SpeechClient()
    language_code = "en-US"
    sample_rate_hertz = 48000

    config = {
        "language_code": language_code,
        "sample_rate_hertz": sample_rate_hertz,
        # "encoding": encoding,
    }
    with io.open(local_file_path, "rb") as f:
        content = f.read()
    audio = {"content": content}
    f = sf.SoundFile(local_file_path)
    aud_len = len(f) / f.samplerate
    if aud_len < 60:
        response = client.recognize(config, audio)
    else:
        dest_name = str(uuid.uuid4()) + '.wav'
        upload_blob(bucket_name="patched_video_output", source_file_name=local_file_path, destination_blob_name=dest_name)
        cloud_uri = 'gs://' + 'patched_video_output/' + dest_name
        print(cloud_uri)
        audio = {"uri": cloud_uri}
        operation = client.long_running_recognize(config, audio)
        response = operation.result()
    transcripted_text = []
    for result in response.results:
        alternative = result.alternatives[0]
        transcripted_text.append(alternative.transcript)
    # print(u"Transcript: {}".format(alternative.transcript))
    return transcripted_text

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
        bad_ints, output_video_name, corr_text = patch(filenames)
        flash('File(s) successfully uploaded')

        affectedRegions = []
        for i, (st, end) in enumerate(bad_ints):
            affectedRegions.append({
                'beginTimestamp': to_timestamp(st),
                'endTimestamp': to_timestamp(end),
                'corruptedPhrase': corr_text[i]
            })

        dest_name = str(uuid.uuid4()) + '.mp4'
        public_url = upload_blob(bucket_name="patched_video_output", source_file_name=os.path.join('output', output_video_name), destination_blob_name=dest_name)
        return {
            'videoUrl': public_url,
            'affectedRegions': affectedRegions
        }


if __name__ == "__main__":
    app.run(debug=True)
