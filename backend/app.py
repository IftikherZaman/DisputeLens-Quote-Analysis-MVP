from flask import Flask, request, jsonify
from flask_cors import CORS # pip install flask_cors
from helper import *
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Use os.path.join to create platform-independent paths
PDF_INPUT_PATH = os.path.join(BASE_DIR, 'quotes.pdf')
OCR_OUTPUT_PATH = os.path.join(BASE_DIR, 'output_OCR.txt')
GPT_OUTPUT_PATH = os.path.join(BASE_DIR, 'output_gpt.txt')


@app.route('/pdf_to_text', methods=['POST'])
def pdf_to_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 500
    if file:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(PDF_INPUT_PATH), exist_ok=True)
        file.save(PDF_INPUT_PATH)
        pdf_to_text_OCR(PDF_INPUT_PATH, OCR_OUTPUT_PATH)
        with open(OCR_OUTPUT_PATH, 'r') as f:
            text = f.read()
        return jsonify({"text": text})      


@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    data = request.json
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    # Save the received text to output_OCR.txt
    with open(OCR_OUTPUT_PATH, 'w') as f:
        f.write(data['text'])
    
    analyze_text_with_gpt(OCR_OUTPUT_PATH, GPT_OUTPUT_PATH)

    with open(GPT_OUTPUT_PATH, 'r') as f:
        analysis = f.read()

    return jsonify({"analysis": analysis})

if __name__ == '__main__':
    app.run(debug=True)