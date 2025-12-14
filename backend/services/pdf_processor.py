import os
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter

DATA_DIR = "data/resumes"
os.makedirs(DATA_DIR, exist_ok=True)


def extract_pdf_text(pdf_file):
    text = ""

    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted

    return text


def chunk_text(text):
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    return splitter.split_text(text)
