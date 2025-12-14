from services.memory_store import auto_save_to_memory, run_session
from flask import Blueprint, request, jsonify
from agents.interview_prep_agent import interview_prep_agent, load_resume_vectors
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService

bp_interview = Blueprint("bp_interview", __name__)


@bp_interview.route("/interview_prep", methods=["POST"])
def interview_prep():
    data = request.json
    jd = data.get("jobDescription")

    if not jd:
        return jsonify({"error": "job_description is required"}), 400

    try:
        vectorstore = load_resume_vectors()
        docs = vectorstore.similarity_search(jd, k=5)
        resume_context = "\n".join([d.page_content for d in docs])
    except:
        return jsonify({"error": "Resume vector index missing"}), 500


    user_prompt = f"""
Job Description:
{jd}

Extracted Resume Context:
{resume_context}

Generate interview preparation outputs using the instructions.
"""
    session_service=InMemorySessionService()
    memory_service=InMemoryMemoryService()
    runner = Runner(
        agent=interview_prep_agent,
        app_name="CareerCoachAI",
        session_service=session_service,
        memory_service=memory_service
    )
    import asyncio
    response_text =  asyncio.run(run_session(
        runner,
        user_prompt,
        session_id="interview-session-01"
    ))
    import json
    clean = response_text.strip()
    clean = clean.replace("```json", "").replace("```", "").strip()

    if clean.startswith("json"):
        clean = clean[4:].strip()

    clean = json.loads(clean)
    return jsonify(clean), 200
