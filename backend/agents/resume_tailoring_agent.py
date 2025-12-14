from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.genai import types
from google.adk.runners import Runner
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings


retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

def load_user_resume_vectors():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local("vector_index", embeddings, allow_dangerous_deserialization=True)


TAILORING_INSTRUCTION = """
You are the Resume Tailoring Agent.

Your job:
1. Read the job description provided.
2. Read the user’s resume text from memory/tool.
3. Rewrite the resume so it matches the job description *accurately* without hallucination which will increase the chance for the user to get hired for that particular post.
4. Maintain factual accuracy.
give all the details strictly in this json format only. only and only this json format should be returned nothing else. Matchscore is the score that tells how much our previous resume matched with the job description. only json no words in any circumstance.
Return the response STRICTLY in this JSON format:

{{
  "summary": "",
  "keySkills": [],
  "experience": [
    {{
      "title": "",
      "company": "",
      "duration": "",
      "highlights": []
    }}
  ],
  "matchScore": 0
}}
"""

resume_tailoring_agent = LlmAgent(
    name="ResumeTailorAgent",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    instruction=TAILORING_INSTRUCTION,
    tools=[],
)
