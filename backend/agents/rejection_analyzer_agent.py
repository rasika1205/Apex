from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.genai import types
from services.memory_store import auto_save_to_memory
from google.adk.runners import Runner
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

import os

retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

def load_user_resume_vectors():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local(
        "vector_index",
        embeddings,
        allow_dangerous_deserialization=True
    )

REJECTION_ANALYZER_PROMPT = """
You are a Rejection Analysis Agent.

Inputs:
1. The rejection email text.
2. The user's resume context retrieved from vector memory.

Your task:
- Analyze WHY the candidate was likely rejected.
- Compare resume strengths vs implied expectations from rejection email.
- Identify missing skills, weak areas, and improvement steps.
- DO NOT hallucinate company-specific feedback.
- Base insights only on resume + rejection email language patterns.

Return STRICTLY in the following JSON format.
DO NOT add explanations, markdown, or extra text.

{
  "missingSkills": [
    {
      "skill": "",
      "importance": "High | Medium | Low",
      "gap": ""
    }
  ],
  "mistakes": [
    ""
  ],
  "suggestions": [
    ""
  ],
  "nextSteps": [
    {
      "action": "",
      "timeline": "",
      "resources": []
    }
  ],
  "skillGap": [
    {
      "skill": "",
      "current": 0,
      "required": 0
    }
  ]
}
"""
rejection_analyzer_agent = LlmAgent(
    name="RejectionAnalyzerAgent",
    model=Gemini(
        model="gemini-2.5-flash-lite",
        retry_options=retry_config
    ),
    instruction=REJECTION_ANALYZER_PROMPT,
    tools=[],
    after_agent_callback=auto_save_to_memory,
)
