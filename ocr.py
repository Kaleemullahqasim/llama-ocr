import sys
import base64
import ollama
import os

# Function to check if the file path is a remote URL
def is_remote_file(file_path):
    return file_path.startswith("http://") or file_path.startswith("https://")

# OCR function using ollama
def ocr_with_ollama(file_path, model="llama3.2-vision"):
    # Define the system prompt
    system_prompt = """Convert the provided image into Markdown format. Ensure that all content from the page is included, such as headers, footers, subtexts, images (with alt text if possible), tables, and any other elements.

Requirements:
- Output Only Markdown: Return solely the Markdown content without any additional explanations or comments.
- No Delimiters: Do not use code fences or delimiters like ```markdown.
- Complete Content: Do not omit any part of the page, including headers, footers, and subtext.
"""

    # Use ollama to send the chat request with the image
    try:
        response = ollama.chat(
            model=model,
            messages=[{
                'role': 'user',
                'content': system_prompt,
                'images': [file_path]
            }]
        )
        return response.get("content", "No content returned.")
    except Exception as e:
        raise Exception(f"Error from Ollama: {str(e)}")

# Main execution logic
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ocr.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]

    if not is_remote_file(file_path) and not os.path.exists(file_path):
        print(f"Error: File not found - {file_path}")
        sys.exit(1)

    try:
        result = ocr_with_ollama(file_path)
        print("OCR Result:")
        print(result)
    except Exception as e:
        print(f"Error during OCR: {str(e)}")