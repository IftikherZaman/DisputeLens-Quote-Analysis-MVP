from helper import *

if __name__ == '__main__':
    printName()
    extract_text_from_pdf('quotes.pdf', 'output.txt')
    print("Text extraction 1 complete.")
    pdf_to_text_OCR('quotes.pdf', 'output_OCR.txt')
    print("Text extraction 2 complete.")