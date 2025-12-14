from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.tools import load_memory, preload_memory
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from services.memory_store import auto_save_to_memory
from google.genai import types

retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)



def load_resume_vectors():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return FAISS.load_local("vector_index",
                            embeddings,
                            allow_dangerous_deserialization=True)


INTERVIEW_PROMPT = """
You are an Interview Preparation Agent.

INPUT:
1. Job Description
2. Resume context (retrieved from vector search)

TASK:
Generate interview preparation strictly in the following JSON format ONLY.
Do NOT add explanations or markdown.

OUTPUT FORMAT (STRICT JSON):

{
  "questions": [
    {
      "type": "Technical | Behavioral",
      "question": "Question text",
      "answer": "Strong concise answer using resume context"
    }
  ],
  "weakAreas": ["area1", "area2"],
  "topicsToStudy": ["topic1", "topic2"]
}

RULES:
- 8–10 total questions
- Answers MUST come from resume context
- If resume lacks something, mention it in weakAreas
- NO markdown
- NO text outside JSON
"""


interview_prep_agent = LlmAgent(
    name="InterviewPrepAgent",
    model=Gemini(
        model="gemini-2.5-flash-lite",
        retry_options=retry_config
    ),
    instruction=INTERVIEW_PROMPT,
    tools=[preload_memory],
    after_agent_callback=auto_save_to_memory,
)
