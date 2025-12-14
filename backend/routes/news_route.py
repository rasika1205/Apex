import requests
from flask import Blueprint, jsonify, current_app

news_bp = Blueprint("news_bp", __name__)

def classify_category(title: str) -> str:
    title = title.lower()

    if "remote" in title:
        return "Remote"
    if "tech" in title or "ai" in title or "software" in title:
        return "Technology"
    if "career" in title or "hiring" in title or "job" in title:
        return "Career"
    if "business" in title or "corporate" in title:
        return "Business"

    return "Industry"

@news_bp.route("/news")
def get_news():
    api_key = current_app.config.get("GNEWS_API_KEY")


    if not api_key:
        return jsonify({"error": "GNEWS_API_KEY not configured"}), 500

    url = "https://gnews.io/api/v4/search"

    params = {
        "q": "jobs OR hiring OR corporate OR business OR company",
        "lang": "en",
        "country": "in",
        "max": 6,
        "apikey": api_key
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "articles" not in data:
        return jsonify({"error": "Failed to fetch news", "details": data}), 500

    articles = []
    for idx, article in enumerate(data["articles"]):
        published_at = article.get("publishedAt")

        articles.append({
            "id": str(idx + 1),
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "image": article.get("image") or "",
            "category": classify_category(article.get("title", "")),
            "date": published_at[:10] if published_at else "",
            "source": article.get("source", {}).get("name", "Unknown")
        })

    return jsonify({
        "articles": articles
    }), 200
