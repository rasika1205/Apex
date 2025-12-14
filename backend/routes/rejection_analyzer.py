from flask import Blueprint, request, jsonify
from services.memory_store import auto_save_to_memory, run_session
from agents.rejection_analyzer_agent import rejection_analyzer_agent, load_user_resume_vectors
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.tools import load_memory, preload_memory
import json
import asyncio
bp_rejection = Blueprint("rejection", __name__)


session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

@bp_rejection.route("/rejection_analyze", methods=["POST"])
def rejection_analyze():
    data = request.json
    rejection_text = data.get("rejectionText")

    if not rejection_text:
        return jsonify({"error": "rejectionText is required"}), 400

    try:
        vectorstore = load_user_resume_vectors()
        docs = vectorstore.similarity_search(rejection_text, k=5)
        resume_context = "\n".join([d.page_content for d in docs])
    except Exception as e:
        return jsonify({"error": "Resume vector index missing"}), 500

    user_prompt = f"""
Rejection Email:
{rejection_text}
User Resume Context:
{resume_context}

Analyze the rejection strictly following the JSON format instructions.
"""

    runner = Runner(
        agent=rejection_analyzer_agent,
        app_name="RejectionAnalyzerAI",
        session_service=session_service,
        memory_service=memory_service
    )

    response_text =asyncio.run(run_session(
        runner,
        user_prompt,
        session_id="rejection-session-01"
    ))

    clean = response_text.strip()
    clean = clean.replace("```json", "").replace("```", "").strip()

    if clean.startswith("json"):
        clean = clean[4:].strip()

    try:
        parsed = json.loads(clean)
    except:
        return jsonify({"error": "Model returned invalid JSON"}), 500

    return jsonify(parsed), 200
