import PyPDF2

def printName():
    print("Hello, world!")

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
    with open(txt_path, 'w', encoding='utf-8') as txt_file:
        txt_file.write(text)