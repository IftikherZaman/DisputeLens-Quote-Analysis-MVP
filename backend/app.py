from flask import Flask, request, jsonify
from flask_cors import CORS 
from helper import *
from antAPI import *
import os
import tempfile
import json


app = Flask(__name__)
CORS(app)

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Use os.path.join to create platform-independent paths
PDF_INPUT_PATH = os.path.join(BASE_DIR, 'quotes.pdf')
OCR_OUTPUT_PATH = os.path.join(BASE_DIR, 'output_OCR.txt')
GPT_OUTPUT_PATH = os.path.join(BASE_DIR, 'output_gpt.txt')



@app.route('/')
def home(): 
    return "Server is running"



@app.route('/pdf_to_text', methods=['POST'])
def pdf_to_text():
    # Ensure the directory exists
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 500
    if file:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(PDF_INPUT_PATH), exist_ok=True)
        file.save(PDF_INPUT_PATH)

        # Extract text from the PDF
        pdf_to_text_OCR(PDF_INPUT_PATH, OCR_OUTPUT_PATH)

        # Read the extracted text from output_OCR.txt
        with open(OCR_OUTPUT_PATH, 'r') as f:
            text = f.read()

        # Return the extracted text
        return jsonify({"text": text})      


@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    # Ensure the directory exists
    data = request.json
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    # Save the received text to output_OCR.txt
    with open(OCR_OUTPUT_PATH, 'w') as f:
        f.write(data['text'])
    
    # Analyze the text using GPT
    analyze_text_with_gpt(OCR_OUTPUT_PATH, GPT_OUTPUT_PATH)

    # Read the analysis from output_gpt.txt
    with open(GPT_OUTPUT_PATH, 'r') as f:
        analysis = f.read()

    # Return the analysis
    return jsonify({"analysis": analysis})


@app.route('/analyze_with_claude', methods=['POST'])
def analyze_with_claude_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Get conversation history from the request, if provided
    conversation_history = request.form.get('conversation_history', '[]')
    try:
        conversation_history = json.loads(conversation_history)
    except json.JSONDecodeError:
        conversation_history = []

    if file:
        # Create temporary files for input and output
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_input:
            file.save(temp_input.name)
            temp_input_path = temp_input.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as temp_output:
            temp_output_path = temp_output.name

        try:
            # Call the analyze_with_claude function
            analyze_with_claude(temp_input_path, temp_output_path, conversation_history)
            
            # Read the analysis result
            with open(temp_output_path, 'r') as f:
                analysis = f.read()
            
            return jsonify({"analysis": analysis})
        finally:
            # Clean up temporary files
            os.unlink(temp_input_path)
            os.unlink(temp_output_path)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)