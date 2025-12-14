from flask import Blueprint, request, jsonify
from agents.salary_agent import salary_estimator_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from services.memory_store import run_session

bp_salary = Blueprint("bp_salary", __name__)
session_service= InMemorySessionService()
memory_service= InMemoryMemoryService()

@bp_salary.route("/estimate_salary", methods=["POST"])
def estimate_salary():
    data = request.json
    print(data)
    job_description = data.get("jobDescription")

    structured_data = f"""
Job Description: {job_description}
"""

    runner = Runner(
        agent=salary_estimator_agent,
        app_name="SalaryEstimator",
        session_service=session_service,
        memory_service=memory_service
    )

    import asyncio
    session_result = asyncio.run(
        run_session(
            runner,
            f"Analyze the job details and estimate what could be the salary for this job :\n\n{structured_data}\n\n",
            session_id="resume-session-02"
        )
    )
    import json
    clean = session_result.strip()
    clean = clean.replace("```json", "").replace("```", "").strip()

    if clean.startswith("json"):
        clean = clean[4:].strip()

    clean = json.loads(clean)

    return jsonify(clean), 200
