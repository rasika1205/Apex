from flask import Blueprint, request, jsonify
import uuid
from datetime import date

bp_tracker = Blueprint("tracker", __name__)

import mysql.connector
import os

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "job_tracker"),
        autocommit=False
    )

@bp_tracker.route("/tracker/jobs", methods=["POST"])
def add_job():
    data = request.json
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    job_id = str(uuid.uuid4())

    cur.execute("""
        INSERT INTO job_applications (
            id, user_id, company, position, location,
            job_url, status, applied_via, applied_date, notes
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        job_id,
        data["user_id"],
        data["company"],
        data["position"],
        data.get("location"),
        data.get("job_url"),
        data["status"],
        data.get("applied_via"),
        data.get("applied_date", date.today()),
        data.get("notes", "")
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": job_id}), 201

@bp_tracker.route("/tracker/jobs", methods=["GET"])
def get_jobs():
    user_id = request.args.get("user_id")
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT * FROM job_applications
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))

    jobs = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(jobs)

@bp_tracker.route("/tracker/jobs/<job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        UPDATE job_applications
        SET status = %s,
            notes = %s
        WHERE id = %s
    """, (
        data["status"],
        data.get("notes", ""),
        job_id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True})

@bp_tracker.route("/tracker/jobs/<job_id>", methods=["DELETE"])
def delete_job(job_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM job_applications WHERE id = %s",
        (job_id,)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"deleted": True})
