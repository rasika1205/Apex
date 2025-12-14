from flask import Flask, request
from flask_cors import CORS
from routes.profile import bp_profile
from routes.job_finder import bp_jobfinder
from routes.interview_prep import bp_interview
from routes.resume_tailoring import bp_tailor
from routes.salary_estimator import bp_salary
from routes.application import bp_application
from routes.career_planner import bp_career
from routes.rejection_analyzer import bp_rejection
from routes.job_tracker import bp_tracker
from routes.news_route import news_bp
import os
from dotenv import load_dotenv
load_dotenv()

apikey = os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = apikey
USER_ID = "demo_user"

app = Flask(__name__)
CORS(app)
app.config["GNEWS_API_KEY"] = os.getenv("GNEWS_API_KEY")


app.register_blueprint(news_bp)
app.register_blueprint(bp_profile)
app.register_blueprint(bp_jobfinder)
app.register_blueprint(bp_interview)
app.register_blueprint(bp_tailor)
app.register_blueprint(bp_salary)
app.register_blueprint(bp_career)
app.register_blueprint(bp_rejection)
app.register_blueprint(bp_application)
app.register_blueprint(bp_tracker)



if __name__ == "__main__":
    app.run(debug=True, port=8000, use_reloader=False)
