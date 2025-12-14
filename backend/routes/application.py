from flask import Blueprint, request, jsonify
from agents.application_agent import application_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from services.memory_store import run_session

bp_application = Blueprint("application", __name__)
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

@bp_application.route("/apply", methods=["POST"])
def auto_apply():
    data = request.json
    user_id = data.get("user_id")
    job_url = data.get("job_url")

    if not job_url:
        return jsonify({"error": "Job URL is required"}), 400

    runner = Runner(
        agent=application_agent,
        app_name="JobAutomationApp",
        session_service=session_service,
        memory_service=memory_service,
    )
    import asyncio
    try:
        agent_msg = asyncio.run(
            run_session(
                runner,
                f"Apply to this job: {job_url}",
                session_id=f"apply-{user_id}"
            )
        )



        return jsonify({
            "status": "completed",
            "message": "Application submitted",
            "agent_response": agent_msg
        })


    except Exception as e:

        print("APPLY ERROR:", repr(e))

        import traceback

        traceback.print_exc()

        return jsonify({

            "status": "error",

            "error": str(e)

        }), 500
