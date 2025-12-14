from flask import Blueprint, request, jsonify
from services.pdf_processor import extract_pdf_text, chunk_text
from services.vector_store import build_vector_store
from services.memory_store import auto_save_to_memory, run_session
from agents.profile_agent import profile_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.tools import load_memory, preload_memory
import os

bp_profile = Blueprint("profile", __name__, url_prefix="/profile")
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

@bp_profile.route("/analyze_resume", methods=["POST"])
def analyze_resume():
    user_id = "demo_user"


    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename

    TEMP_DIR = "data/resumes"
    os.makedirs(TEMP_DIR, exist_ok=True)

    temp_path = os.path.join(TEMP_DIR, filename)
    file.save(temp_path)
    
    text = extract_pdf_text(open(temp_path, "rb"))
    
    chunks = chunk_text(text)
    
    build_vector_store(chunks)

    runner = Runner(
        agent=profile_agent,
        app_name="ProfileUnderstandingApp",
        session_service=session_service,
        memory_service=memory_service
    )

    import asyncio
    session_result = asyncio.run(
        run_session(
            runner,
            f"Analyze the following resume text:\n\n{text}\n\nGenerate a structured profile report.",
            session_id="resume-session-01"
        )
    )
    import json

    clean = session_result.strip()
    clean = clean.replace("```json", "").replace("```", "").strip()

    if clean.startswith("json"):
        clean = clean[4:].strip()

    final_message = json.loads(clean)
    os.makedirs("project_reports", exist_ok=True)

    with open(f"project_reports/{user_id}.json", "w", encoding="utf-8") as f:
        json.dump(final_message, f, indent=2)   
    return jsonify(final_message), 200

