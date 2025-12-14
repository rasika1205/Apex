
---

# Apex 🚀

**An Intelligent Career Assistance Platform**

Apex is a full-stack, AI-powered career assistance platform designed to streamline and enhance the entire job-search lifecycle. Built with a modular **Flask-based backend**, Apex integrates intelligent agents and automation tools to support users in resume optimization, job discovery, application tracking, interview preparation, and long-term career planning.

The platform is designed with **scalability, extensibility, and real-world hiring workflows** in mind, making it suitable for both individual users and future enterprise-grade extensions.

---

## ✨ Key Features

### 🔐 Profile & Resume Intelligence

* Centralized profile management
* Resume analysis and skill extraction
* Resume tailoring based on job descriptions

### 🔍 Job Discovery & Automation

* Smart job search using role, skills, and preferences
* Auto-apply workflows (agent-driven)
* Job relevance scoring

### 📊 Application Tracking

* End-to-end job application tracker
* Status lifecycle: saved → applied → interview → offer → rejected/ghosted
* Notes, rejection reasons, and resume version tracking

### 🎯 Interview Preparation

* Role-specific interview questions
* Behavioral + technical prep
* Context-aware preparation using resume & job data

### 💰 Salary Intelligence

* Salary estimation by role, location, and experience
* Market benchmarking support

### 🧠 Rejection Analysis

* Analyze rejection emails or feedback
* Identify skill gaps and improvement areas
* Actionable recommendations for future applications

### 🧭 Career Planning

* Short-term and long-term career goal planning
* Skill roadmap suggestions
* AI-assisted decision support

### 📰 Industry News

* Curated job-market and industry news
* Company and business updates relevant to user interests

---

### 🤖 AI Agents & Memory (Google ADK)

Apex leverages Google ADK (Agent Development Kit) to build modular, task-specific AI agents that power the platform’s intelligent features. Each major capability—such as resume tailoring, job matching, interview preparation, rejection analysis, and application automation—is implemented as a dedicated AI agent.

Key highlights:

- Agent-based architecture for clear separation of responsibilities
- Persistent conversational memory to retain user context across interactions
- Tool calling & reasoning loops for complex workflows (e.g., analyze → plan → act)
- Session-based memory management enabling personalized, stateful user experiences

This design allows Apex to behave less like a static application and more like an intelligent career assistant that improves recommendations over time.

---
### Demo
<img width="1782" height="805" alt="Screenshot 2025-12-14 192258" src="https://github.com/user-attachments/assets/45f94a07-eff9-4d8a-83da-f6b87b445ba4" />
<img width="1856" height="903" alt="Screenshot 2025-12-14 192146" src="https://github.com/user-attachments/assets/f7469f9e-c98c-4608-9278-5dd6573ab7f8" />
<img width="1864" height="907" alt="Screenshot 2025-12-11 212015" src="https://github.com/user-attachments/assets/49b7ba36-2106-48e6-b46d-9df6030f550a" />
<img width="616" height="733" alt="Screenshot 2025-12-13 192844" src="https://github.com/user-attachments/assets/6709abb2-7acc-445b-b7c5-7362c43b4bc4" />
<img width="1883" height="918" alt="Screenshot 2025-12-13 192932" src="https://github.com/user-attachments/assets/d02295a8-d592-4f1d-8297-089d8241aeb1" />
<img width="634" height="810" alt="Screenshot 2025-12-13 204120" src="https://github.com/user-attachments/assets/60371342-f93a-4cf8-baa6-c7226726bd95" />
<img width="623" height="734" alt="Screenshot 2025-12-13 211140" src="https://github.com/user-attachments/assets/b5f50c0d-6f07-4bfc-93de-7281bd6e0050" />
<img width="1862" height="913" alt="Screenshot 2025-12-13 213400" src="https://github.com/user-attachments/assets/a6fd1789-3b18-40c6-988b-2ba84123018b" />
<img width="1864" height="897" alt="Screenshot 2025-12-13 220356" src="https://github.com/user-attachments/assets/57f7117a-0f2d-419c-8415-7c13d1838b1b" />
<img width="1864" height="832" alt="Screenshot 2025-12-14 115731" src="https://github.com/user-attachments/assets/65144b02-22ca-4d65-845e-c335df2f44f9" />
<img width="1866" height="893" alt="Screenshot 2025-12-14 133304" src="https://github.com/user-attachments/assets/2e389824-ea56-48c6-b066-cb477bed2577" />
<img width="1865" height="844" alt="Screenshot 2025-12-14 014617" src="https://github.com/user-attachments/assets/7c0235c1-016e-4304-b234-fdb4ab606d6e" />

---

## 🏗️ System Architecture

Apex follows a **modular, blueprint-driven Flask architecture**, enabling independent development and scaling of features.

### High-Level Overview

* **Backend:** Flask (Python)
* **Architecture:** Blueprint-based modular services
* **Database:** MySQL (job tracking & persistence)
* **AI/LLM Integration:** Agent-driven workflows
* **Config Management:** Environment-based (`.env`)
* **CORS Enabled:** Frontend-ready APIs
* **Authentication:** Supabase

### Backend Directory Structure

```text
backend/
├── app.py                 # Flask app initialization & blueprint registration
├── routes/                # Feature-specific Flask blueprints
│   ├── profile/
│   ├── job_finder/
│   ├── application/
│   ├── tracker/
│   ├── interview_prep/
│   ├── rejection_analyzer/
│   └── news/
├── db/                    # Database utilities and connections
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables (ignored in git)
```

---

## 🚀 Getting Started

### Prerequisites

* Python **3.8+**
* `pip`
* MySQL Server (for job tracking)
* Virtual environment support

---

### Installation & Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rasika1205/Apex.git
cd Apex/backend
```

#### 2️⃣ Create & Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate       # macOS / Linux
venv\Scripts\activate          # Windows
```

#### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4️⃣ Environment Configuration

Create a `.env` file inside the `backend` directory:

```env
FLASK_ENV=development
FLASK_DEBUG=1

GOOGLE_API_KEY=your_google_api_key
GNEWS_API_KEY=your_gnews_api_key

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=job_tracker
```

---

#### 5️⃣ Run the Development Server

```bash
python app.py
```

Backend will be available at:

```
http://127.0.0.1:8000
```

---

## 🔌 API Overview

Each feature is exposed via a dedicated Flask blueprint.

| Feature                | Endpoint Prefix      |
| ---------------------- | -------------------- |
| Profile Analysis       | `/profile/*`         |
| Job Finder             | `/find_jobs`         |
| Resume Tailoring       | `/tailor_resume`     |
| Interview Prep         | `/interview_prep`    |
| Salary Estimation      | `/estimate_salary`   |
| Application Automation | `/apply`             |
| Job Tracker            | `/tracker/jobs`      |
| Rejection Analyzer     | `/rejection_analyze` |
| Career Planner         | `/career_chat`       |
| Industry News          | `/news`              |


---

## 🧪 Development Notes

* All APIs are **CORS-enabled**
* Database transactions use controlled commits
* Blueprint isolation allows feature-level testing
* Designed to support future:

  * Agent orchestration (Google ADK)
  * Resume embeddings & vector search
  * Scalable async task queues

---

## License

This project is **proprietary** and protected by copyright © 2025 Rasika Gautam.

You are welcome to view the code for educational or evaluation purposes (e.g., portfolio review by recruiters).  
However, you may **not copy, modify, redistribute, or claim this project as your own** under any circumstances — including in interviews or job applications — without written permission.

---

## 🧑‍💻 Author

**Rasika Gautam**
*Data Science & AI Enthusiast* | B.Tech MAC, NSUT
[GitHub](https://github.com/rasika1205)


## 🙏 Acknowledgements

* [Flask](https://flask.palletsprojects.com/)
* [Flask-CORS](https://flask-cors.readthedocs.io/)
* [python-dotenv](https://pypi.org/project/python-dotenv/)
* [GNews API](https://gnews.io/)
* Open-source AI & developer communities

---

