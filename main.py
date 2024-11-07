from flask import Flask, request, render_template, redirect, url_for, jsonify
import os
import LLM_CROP.crop_conv as llm_crop

app = Flask(__name__, template_folder='template/')

# Configure the upload folder
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/detect', methods=["POST"])
def detect():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']

    if file.filename == '':
        return "No selected file", 400

    if file and allowed_file(file.filename):
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        file.save(filepath)
        return jsonify(f"{filename}")

    return "File type not allowed", 400


@app.route('/llm', methods=['POST'])
def llm():
    data = request.get_json()
    name = data.get('text', '')
    resp = llm_crop.elab_dis(name)
    return jsonify(resp.replace("*", "<br>"))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
