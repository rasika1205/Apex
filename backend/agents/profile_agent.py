from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.tools import load_memory, preload_memory
from google.genai import types
from services.memory_store import auto_save_to_memory

retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

profile_agent = LlmAgent(
    model=Gemini(
        model="gemini-2.5-flash-lite",
        retry_options=retry_config
    ),
    name="ProfileUnderstandingAgent",
    instruction=(
        "You analyze a user's resume text and generate a structured JSON report. "
        "Your output MUST be valid JSON with no explanations, no comments, and no additional text. "
        "Follow this exact schema:\n\n"
        
        "{\n"
        '  "summary": {\n'
        '    "experience": "string (e.g., 2–3 years, fresher, senior level)",\n'
        '    "level": "string (career level category)",\n'
        '    "strength": "string (1 strongest capability)"\n'
        "  },\n"
        '  "radarData": [\n'
        '    {"skill": "string", "value": number}\n'
        "  ],\n"
        '  "barData": [\n'
        '    {"category": "string", "score": number}\n'
        "  ],\n"
        '  "strengths": ["string"],\n'
        '  "weaknesses": ["string"],\n'
        '  "skills": {\n'
        '    "technical": ["string"],\n'
        '    "soft": ["string"]\n'
        "  },\n"
        '  "missingSkills": ["string"]\n'
        "}\n\n"

        "Rules:\n"
        "- ALWAYS output only and only valid JSON.\n"
        "- DO NOT add markdown, explanations or headings.\n"
        "- Ensure numerical fields are numbers, not strings.\n"
        "- If information is missing, infer from resume or leave fields empty but valid.\n"
        "- Provide at least 5 radarData skills and 5 barData categories.\n"
        "- strengths and weaknesses must be lists.\n"
        "- missingSkills should include relevant skills not found in the resume.\n"
    ),
    tools=[preload_memory],
    after_agent_callback=auto_save_to_memory,
)
