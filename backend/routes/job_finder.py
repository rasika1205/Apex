from flask import Blueprint, request, jsonify
from google.adk.runners import Runner
from google.genai import types
from agents.job_finder_agent import get_profile_report, generate_queries, search_jobs, rank_jobs
from google.adk.sessions import InMemorySessionService
from google.adk.memory import InMemoryMemoryService
import uuid

bp_jobfinder = Blueprint("job_finder", __name__)


@bp_jobfinder.route("/find_jobs", methods=["GET"])
def find_jobs():
    job_query = request.args.get("q")
    location = request.args.get("location", "India")

    if not job_query:
        return jsonify({"error": "Missing query parameter 'q'"}), 400

    try:
        profile_report = get_profile_report("demo_user")

        try:
            queries = generate_queries(profile_report, job_query)
        except Exception as e:
            print("Error generating queries:", e)
            queries = [job_query]

        all_jobs = []
        for q in queries:
            jobs = search_jobs(profile_report, q, location)
            all_jobs.extend(jobs)

        if not all_jobs:
            return jsonify({"jobs": [], "query": job_query, "location": location})


        top_jobs = rank_jobs(all_jobs)

        return jsonify({
            "jobs": top_jobs,
            "query": job_query,
            "location": location
        })

    except Exception as e:
        print("Error in /find_jobs:", e)
        return jsonify({"error": str(e)}), 500
