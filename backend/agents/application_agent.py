from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from google.adk.models.google_llm import Gemini
import time
import os

def apply_linkedin_job(job_url: str, user_id: str):
    chrome_options = Options()
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("user-data-dir=C:/Users/rasik/AppData/Local/Google/Chrome/User Data")
    chrome_options.add_argument("profile-directory=Profile 2")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get(job_url)
    time.sleep(5)

    try:

        apply_btn = driver.find_element(By.CSS_SELECTOR, "button.jobs-apply-button")
        apply_btn.click()
        time.sleep(3)


        resume_path = f"data/resumes.pdf"
        if os.path.exists(resume_path):
            upload = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
            upload.send_keys(os.path.abspath(resume_path))
            time.sleep(3)


        next_buttons = driver.find_elements(By.CSS_SELECTOR, "button[aria-label='Continue to next step']")
        for btn in next_buttons:
            btn.click()
            time.sleep(2)


        submit = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Submit application']")
        submit.click()

        time.sleep(2)
        driver.quit()
        return "Applied Successfully"

    except Exception as e:
        driver.quit()
        return f"Failed: {str(e)}"



def apply_to_job_tool(job_url: str, user_id: str) -> str:
    try:
        result = apply_linkedin_job(job_url, user_id)
        return f"Application result: {result}"
    except Exception as e:
        return f"Automation failed: {str(e)}"

from google.adk.agents import LlmAgent

application_agent = LlmAgent(
    model=Gemini(model="gemini-2.5-flash-lite", temperature=0.2),
    name="ApplicationAutomationAgent",
    instruction="""
You are an Application Automation Agent. 
Your job is to automatically fill job applications on supported platforms.
You MUST use the tool 'apply_to_job_tool' when the user requests automation.
The user request will ALWAYS contain:
- job URL
- user ID

You MUST:
1. NEVER ask follow-up questions
2. NEVER ask for user ID
3. IMMEDIATELY call the tool `apply_to_job_tool`
4. Respond ONLY with the tool result
""",
    tools=[apply_to_job_tool]
)
