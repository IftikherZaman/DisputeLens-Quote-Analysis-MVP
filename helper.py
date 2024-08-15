import PyPDF2
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import os

# Explicitly specify the tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\sajee\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def printName():
    print("Hello, world!")

# Function to extract text from a PDF file using PyPDF2
def extract_text_from_pdf(pdf_path, txt_path):
    # Open the PDF file
    with open(pdf_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        
        # Loop through each page and extract text
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
        
    # Write the extracted text to a text file
    # Opening in write mode will overwrite the file
    with open(txt_path, 'w', encoding='utf-8') as txt_file:
        txt_file.write(text)

# Function to extract text from a PDF file using OCR
def pdf_to_text_OCR(pdf_path, output_txt_path):
    # Open the PDF file
    doc = fitz.open(pdf_path)
    
    full_text = ""

    # Iterate over each page
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # Convert PDF page to image
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

        # Perform OCR on the image
        text = pytesseract.image_to_string(img)
        
        # Append the extracted text to full_text
        full_text += text + "\n\n"

    # Write the extracted text to the output file
    with open(output_txt_path, "w") as f:
        f.write(full_text)


