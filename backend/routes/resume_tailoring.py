from flask import Blueprint, request, jsonify
from google.adk.runners import Runner
from agents.resume_tailoring_agent import resume_tailoring_agent, load_user_resume_vectors
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from services.memory_store import run_session
import json

bp_tailor = Blueprint("bp_tailor", __name__)
session_service=InMemorySessionService()
memory_service=InMemoryMemoryService()

@bp_tailor.route("/tailor_resume", methods=["POST"])
def tailor_resume():
    data = request.get_json(force=True, silent=True) or {}
    job_description = (
            data.get("jobDescription") or
            data.get("job_description")
    )

    if not job_description or job_description.strip().lower() in ["n/a", "na"]:
        return jsonify({
            "error": "Valid job description not available for this job"
        }), 400

    if not job_description:
        return jsonify({"error": "job_description is required"}), 400

    try:
        vectorstore = load_user_resume_vectors()
        docs = vectorstore.similarity_search(job_description, k=5)
        resume_text = "\n\n".join([d.page_content for d in docs])
    except:
        return jsonify({"error": "Resume vector store not found"}), 500

    prompt = f"""
Job Description:
{job_description}

Resume Context Extracted:
{resume_text}

Now tailor the resume using the required agent instructions.
"""

    runner = Runner(
        agent=resume_tailoring_agent,
        app_name="ProfileUnderstandingApp",
        session_service=session_service,
        memory_service=memory_service
    )

    import asyncio
    session_result = asyncio.run(
        run_session(
            runner,
            prompt,
            session_id="resume-session-01"
        )
    )
    clean = session_result.strip()
    clean = clean.replace("```json", "").replace("```", "").strip()

    if clean.startswith("json"):
        clean = clean[4:].strip()

    clean = json.loads(clean)
    return jsonify(clean), 200
