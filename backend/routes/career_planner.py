from flask import Blueprint, request, jsonify
from agents.carrer_planner_agent import career_planner_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
from services.memory_store import run_session

bp_career = Blueprint("bp_career", __name__)
session_service = InMemorySessionService()
memory_service = InMemoryMemoryService()

@bp_career.route("/career_chat", methods=["POST"])
def career_chat():
    data = request.json
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "User message is required"}), 400

    runner = Runner(
        agent=career_planner_agent,
        app_name="CareerPlannerAI",
        session_service=session_service,
        memory_service=memory_service,
    )
    import asyncio
    response = asyncio.run(run_session(
        runner,
        user_message,
        session_id="career-session-01"
    ))

    return jsonify({
        "response": response
    })
