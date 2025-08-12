from fastapi import APIRouter
from pydantic import BaseModel
from utils import get_sentiment, get_story
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from agent.rag_agent import get_greeting, get_random_quote, get_meditation_tip
from utils import get_sentiment, get_story, get_story_text_by_id, lang_from_id
from typing import Optional

api_router = APIRouter()

class ReminderRequest(BaseModel):
    name: str
    time: str
    medication: str

class StoryRequest(BaseModel):
    language: str

class SentimentRequest(BaseModel):
    text: str

@api_router.post("/reminder")
def create_reminder(req: ReminderRequest):
    # For now, just echo the reminder
    return {"status": "Reminder set", "details": req}

@api_router.post("/story")
def get_katha(req: StoryRequest):
    story = get_story(req.language)
    return {"story": story}

@api_router.post("/sentiment")
def analyze_sentiment(req: SentimentRequest):
    score = get_sentiment(req.text)
    return {"sentiment_score": score}

class TipRequest(BaseModel):
    language: str

@api_router.post("/daily")
def get_daily_tip(req: TipRequest):
    lang = req.language.lower()
    return {
        "greeting": get_greeting(lang),
        "quote": get_random_quote(lang),
        "meditation": get_meditation_tip(lang)
    }
class StoryByIdRequest(BaseModel):
    story_id: str
    language: Optional[str] = None  # optional override

@api_router.post("/story_text_by_id")
def story_text_by_id(req: StoryByIdRequest):
    return {
        "story_id": req.story_id,
        "language": (req.language or lang_from_id(req.story_id)),
        "text": get_story_text_by_id(req.story_id)
    }

@api_router.get("/story_audio_url_by_id")
def story_audio_url_by_id(story_id: str, language: Optional[str] = None):
    lang = (language or lang_from_id(story_id)).lower()
    filename = f"{story_id}_{lang}.wav"
    return {"url": f"/audio/{filename}"}