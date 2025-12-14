import os
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

VECTOR_DIR = "vector_index"
os.makedirs(VECTOR_DIR, exist_ok=True)


def build_vector_store(chunks):
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings,
    )

    vector_store.save_local(VECTOR_DIR)

    return vector_store
