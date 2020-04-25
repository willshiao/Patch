import os
from flask import Flask, flash, request, redirect, url_for, render_template
import uuid
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = "secret key"


ALLOWED_EXTENSIONS = set(['mp4', 'm4a', 'mp3'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the files part
        if 'files[]' not in request.files:
            flash('No file part')
            return redirect(request.url)
        files = request.files.getlist('files[]')
        for file in files:
            if file and allowed_file(file.filename):
                filesplit = secure_filename(file.filename).split(".")
                filename = str(uuid.uuid4()) + '.' + filesplit[1]
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('File(s) successfully uploaded')
        return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)
