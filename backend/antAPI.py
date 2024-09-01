

# import PyPDF2
# import fitz  # PyMuPDF
# import pytesseract
# from PIL import Image
# import os
# import anthropic

# # Explicitly specify the tesseract executable path
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# # def analyze_text_with_claude(input_file, output_file):
# #     # Set up your Anthropic API key
# #     client = anthropic.Anthropic(api_key='api-key')

# #     # Read the input text file
# #     with open(input_file, 'r') as file:
# #         input_text = file.read()
# #         prompt = f"{input_text}\n\nThis is my renovation quote. Score this quote on scope issues, material selection and clarity of language out of a 100?"

# #     # Make a request to the Anthropic API using the Messages API
# #     message = client.messages.create(
# #         model="claude-3-sonnet-20240229",
# #         max_tokens=1000,
# #         messages=[
# #             {"role": "user", "content": prompt}
# #         ]
# #     )

# #     # Get the response text
# #     output_text = message.content[0].text

# #     # Write the output text to the output file
# #     with open(output_file, 'w') as file:
# #         file.write(output_text)

# #     print(f"Analysis complete! The result has been written to {output_file}.") 



# def analyze_with_claude(input_file, output_file, conversation_history=[]):
#     client = anthropic.Anthropic(api_key='your-api-key')

#     # Detect file type
#     file_type, encoding = mimetypes.guess_type(input_file)
    
#     if file_type is None:
#         # If mimetypes couldn't guess, use the file extension
#         _, extension = os.path.splitext(input_file)
#         if extension.lower() in ['.txt', '.md']:
#             file_type = 'text/plain'
#         elif extension.lower() == '.pdf':
#             file_type = 'application/pdf'
#         else:
#             file_type = 'application/octet-stream'  # Default binary file type

#     # Read file content
#     if file_type.startswith('text/'):
#         with open(input_file, 'r', encoding='utf-8') as file:
#             input_content = file.read()
#         new_message = {
#             "role": "user",
#             "content": f"{input_content}\n\nPlease analyze this document. Score it on scope issues, material selection and clarity of language out of 100."
#         }
#     else:
#         with open(input_file, 'rb') as file:
#             input_content = base64.b64encode(file.read()).decode('utf-8')
        
#         new_message = {
#             "role": "user",
#             "content": [
#                 {
#                     "type": "image",
#                     "source": {
#                         "type": "base64",
#                         "media_type": file_type,
#                         "data": input_content
#                     }
#                 },
#                 {
#                     "type": "text",
#                     "text": "Please analyze this document. Score it on scope issues, material selection and clarity of language out of 100."
#                 }
#             ]
#         }

#     # Add the new message to the conversation history
#     conversation_history.append(new_message)

#     # Make a request to the Anthropic API using the Messages API
#     message = client.messages.create(
#         model="claude-3-sonnet-20240229",
#         max_tokens=1000,
#         messages=conversation_history
#     )

#     # Get the response text
#     output_text = message.content[0].text

#     # Add Claude's response to the conversation history
#     conversation_history.append({"role": "assistant", "content": output_text})

#     with open(output_file, 'w', encoding='utf-8') as file:
#         file.write(output_text)

#     print(f"Analysis complete! The result has been written to {output_file}.")

#     # Return the updated conversation history
#     return conversation_history

# # Example usage


# #     # Extract text from PDF (choose one method)
# #     extract_text_from_pdf(pdf_path, txt_path)
# #     # or
# #     # pdf_to_text_OCR(pdf_path, txt_path)

# #    # Analyze the extracted text
# #     analyze_text_with_claude(txt_path, output_analysis_path)

import PyPDF2
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import os
import anthropic
import base64
import mimetypes
import io

# Explicitly specify the tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def pdf_to_images(pdf_path):
    """Convert a PDF to a list of images."""
    images = []
    pdf_document = fitz.open(pdf_path)
    
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        
        # Convert image to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        images.append(base64.b64encode(img_byte_arr).decode('utf-8'))
    
    return images

def analyze_with_claude(input_file, output_file, conversation_history=[]):
   
    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

    # Detect file type
    file_type, encoding = mimetypes.guess_type(input_file)
    
    if file_type is None:
        _, extension = os.path.splitext(input_file)
        if extension.lower() in ['.txt', '.md']:
            file_type = 'text/plain'
        elif extension.lower() == '.pdf':
            file_type = 'application/pdf'
        else:
            file_type = 'application/octet-stream'

    # Read file content
    if file_type.startswith('text/'):
        try:
            with open(input_file, 'r', encoding='utf-8') as file:
                input_content = file.read()
        except UnicodeDecodeError:
            try:
                with open(input_file, 'r', encoding='ISO-8859-1') as file:
                    input_content = file.read()
            except UnicodeDecodeError:
                # If both UTF-8 and ISO-8859-1 fail, try to read as binary and decode
                with open(input_file, 'rb') as file:
                    input_content = file.read().decode('utf-8', errors='ignore')
        
        new_message = {
            "role": "user",
            "content": f"{input_content}\n\n Imagine you are a renovation consultation service that specializes in quote analysis. Could you review this quote to identify issues in these 3 categories: 1. Scope detail 2. Contractor materials selection 3. Unclear language. For each section, score the quote out of 100 where 100 is the best and 0 is the worst.For each identified issue, quote the exact line where the issue lies and explain the reason for the issue."
        }
   
    elif file_type == 'application/pdf':
        images = pdf_to_images(input_file)
        new_message = {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image
                    }
                } for image in images
            ] + [
                {
                    "type": "text",
                    "text": "Imagine you are a renovation consultation service that specializes in quote analysis. Could you review this quote to identify issues in these 3 categories: 1. Scope detail 2. Contractor materials selection 3. Unclear language. For each section, score the quote out of 100 where 100 is the best and 0 is the worst. For each identified issue, quote the exact line where the issue lies and explain the reason for the issue."
                }
            ]
        }
    elif file_type.startswith('image/'):
        with open(input_file, 'rb') as file:
            input_content = base64.b64encode(file.read()).decode('utf-8')
        
        new_message = {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": file_type,
                        "data": input_content
                    }
                },
                {
                    "type": "text",
                    "text": "Imagine you are a renovation consultation service that specializes in quote analysis. Could you review this quote to identify issues in these 3 categories: 1. Scope detail 2. Contractor materials selection 3. Unclear language. For each section, score the quote out of 100 where 100 is the best and 0 is the worst. For each identified issue, quote the exact line where the issue lies and explain the reason for the issue."
                }
                
            ]
        }
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

    # Add the new message to the conversation history
    conversation_history.append(new_message)

    # Make a request to the Anthropic API using the Messages API
    message = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=8192,
        temperature=0.2,
        messages=conversation_history ,
        extra_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"}
    )
    



    # Get the response text
    output_text = message.content[0].text

    # Add Claude's response to the conversation history
    conversation_history.append({"role": "assistant", "content": output_text})

    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(output_text)

    print(f"Analysis complete! The result has been written to {output_file}.")

    # Return the updated conversation history
    return conversation_history

 
