from helper import *
from backend.antAPI import *

def main():
    # Initialize the conversation history
    conversation_history = []

    # Step 1: Convert PDF to text using OCR
    pdf_to_text_OCR('quotes.pdf', 'output_OCR.txt')
    print("Text extraction complete.")

    # Step 2: Analyze the extracted text with Claude
    conversation_history = analyze_with_claude('output_OCR.txt', 'output.txt', conversation_history)
    print("Initial analysis complete.")

    # Optional: You can add more analyses here, continuing the conversation
    # For example:
    # conversation_history = analyze_with_claude('additional_info.txt', 'output_claude_2.txt', conversation_history)
    # print("Second analysis complete.")

    # If you want to analyze the PDF directly (assuming analyze_with_claude can handle PDFs):
    # conversation_history = analyze_with_claude('quotes.pdf', 'output_claude_pdf.txt', conversation_history)
    # print("Direct PDF analysis complete.")

if __name__ == '__main__':
    main()
