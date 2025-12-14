from google.ai.generativelanguage_v1beta.types import content
from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.genai import types
from services.memory_store import auto_save_to_memory, run_session
from google.adk.tools import load_memory, preload_memory
import os

retry_config = types.HttpRetryOptions(
    attempts=2,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

import requests
from bs4 import BeautifulSoup
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import numpy as np
from typing import List, Dict, Any


embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")



def get_profile_report(user_id: str) -> str:
    path = f"profile_reports/demo_user.json"
    if not os.path.exists(path):
        return "No profile report found for this user."

    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def generate_queries(profile_report: str, user_query: str) -> List[str]:
    import re
    skills = re.findall(r"Skills[:\- ]+(.*)", profile_report)
    extracted_skills = skills[0].split(",") if skills else []

    base_queries = [user_query] + extracted_skills[:2]
    return list(set([q.strip().lower() for q in base_queries]))

def search_jobs(profile_report: str, query: str, location: str) -> List[Dict]:
    url = f"https://www.linkedin.com/jobs/search?keywords={query}&location={location}"
    headers = {"User-Agent": "Mozilla/5.0"}
    html = requests.get(url, headers=headers).text
    soup = BeautifulSoup(html, "html.parser")

    cards = soup.select(".base-card")[:10]
    jobs = []
    for card in cards:
        jobs.append({
            "title": card.select_one(".base-search-card__title").get_text(strip=True),
            "company": card.select_one(".base-search-card__subtitle").get_text(strip=True),
            "location": location,
            "salary": "Not provided",
            "description": f"""
Job Title: {card.select_one(".base-search-card__title").get_text(strip=True)}
Company: {card.select_one(".base-search-card__subtitle").get_text(strip=True)}
Location: {location}

Role Overview:
The candidate will be responsible for responsibilities typically associated
with the role of {card.select_one(".base-search-card__title").get_text(strip=True)}. The position requires relevant academic background,
practical experience, and domain knowledge suitable for this role.

Key Expectations:
• Subject matter expertise relevant to the position
• Strong analytical and communication skills
• Ability to work in an professional environment
{card.select_one("a.base-card__full-link")["href"]}
""",
            "type": "Full-time",
            "experience": "Not specified",
            "posted": "Recently",
            "link": card.select_one("a.base-card__full-link")["href"]
        })
    return jobs

def rank_jobs(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    faiss_store = FAISS.load_local("vector_index", embeddings, allow_dangerous_deserialization=True)

    ranked = []
    for job in jobs:
        text = f"{job['title']} {job['company']}"
        vec = embeddings.embed_query(text)
        docs = faiss_store.similarity_search_by_vector(vec, k=2)
        score = np.mean([d.metadata.get("score", 0.7) for d in docs])
        job["match_score"] = float(score)
        ranked.append(job)

    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked[:3]



    