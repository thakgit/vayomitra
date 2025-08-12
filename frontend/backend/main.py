from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os, json
from typing import List, Dict, Optional

from services.sentiment import analyze as analyze_sentiment
from services.tips import suggest as suggest_tip
from services.journal import init_db, add_entry, list_entries, get_entry, summarize
from services.agent import recommend
from rag import StoryRAG
from middleware import LogMiddleware, RateLimitMiddleware
from services.reminders import (
    init_db as init_rem_db, start_scheduler, add_reminder, list_reminders,
    delete_reminder, toggle_reminder, test_fire, recent_events
)
from services.tts import synthesize as tts_synthesize

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(HERE, "data")
AUDIO_DIR = os.path.join(DATA_DIR, "audio")
STORIES_PATH = os.path.join(DATA_DIR, "stories.json")

with open(STORIES_PATH, "r", encoding="utf-8") as f:
    STORIES: List[Dict] = json.load(f)

RAG = StoryRAG(STORIES)
init_db()

init_rem_db()
start_scheduler()

app = FastAPI(title="VayoMitra API", version="0.2.0")

# Middleware
app.add_middleware(LogMiddleware)
app.add_middleware(RateLimitMiddleware, max_per_min=120)

NETLIFY_URL = os.getenv("NETLIFY_URL", "https://689bc55d0f0c987e207af78f--vayomitrafrontend.netlify.app/")  # e.g., https://vayomitra.netlify.app
NGROK_URL = os.getenv("NGROK_URL", "https://7980a95c33ee.ngrok-free.app")      # e.g., https://abcd-1234.ngrok-free.app

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if NETLIFY_URL:
    origins.append(NETLIFY_URL)
if NGROK_URL:
    origins.append(NGROK_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReminderIn(BaseModel):
    medicine: str
    time_local: str  # "HH:MM"
    tz: str | None = "America/Chicago"

class ToggleIn(BaseModel):
    active: bool

class AnalyzeIn(BaseModel):
    text: str

# ----- Health -----
@app.get("/health")
def health(): return {"ok": True}

# ----- Sentiment -----
@app.post("/analyze")
def analyze(body: AnalyzeIn):
    return analyze_sentiment(body.text)

# ----- Stories -----
@app.get("/stories")
def list_stories():
    return [{"id": s["id"], "title": s["title"], "language": s["language"], "tags": s.get("tags", [])} for s in STORIES]

@app.get("/stories/languages")
def languages(): return sorted({s["language"] for s in STORIES})

@app.get("/stories/tags")
def tags():
    all_tags = set()
    for s in STORIES:
        for t in s.get("tags", []): all_tags.add(t)
    return sorted(all_tags)

@app.get("/stories/{story_id}/text")
def story_text(story_id: str):
    for s in STORIES:
        if s["id"] == story_id:
            return {"id": s["id"], "title": s["title"], "language": s["language"], "text": s.get("text", "")}
    raise HTTPException(404, "Story not found")

@app.get("/audio/{filename}")
def audio(filename: str):
    path = os.path.join(AUDIO_DIR, filename)
    if not os.path.isfile(path): raise HTTPException(404, "Audio not found")
    return FileResponse(path, media_type="audio/mpeg")

# ----- RAG search -----
@app.get("/search")
def search(q: str, k: int = 5):
    results = RAG.search(q, k=k)
    return [{"id": s["id"], "title": s["title"], "language": s["language"], "score": float(score), "snippet": s.get("text", "")[:200]} for s, score in results]

# ----- Agent -----
@app.get("/agent/tip")
def agent_tip(period: Optional[str] = None):
    return {"tip": suggest_tip(period)}

@app.get("/agent/recommend")
def agent_recommend(mood: Optional[str] = None):
    return recommend(RAG, mood)

# ----- Journal -----
class JournalIn(BaseModel):
    text: str

@app.post("/journal")
def journal_add(body: JournalIn):
    entry = add_entry(body.text)
    return {"id": entry.id, "created_at": entry.created_at, "sentiment": entry.sentiment_label, "compound": entry.sentiment_compound}

@app.get("/journal")
def journal_list(limit: int = 50):
    entries = list_entries(limit)
    return [{"id": e.id, "created_at": e.created_at, "sentiment": e.sentiment_label, "compound": e.sentiment_compound, "text": e.text[:300]} for e in entries]

@app.get("/journal/{entry_id}")
def journal_get(entry_id: int):
    e = get_entry(entry_id)
    if not e: raise HTTPException(404, "Not found")
    return {"id": e.id, "created_at": e.created_at, "sentiment": e.sentiment_label, "compound": e.sentiment_compound, "text": e.text}

@app.post("/journal/{entry_id}/summarize")
def journal_summarize(entry_id: int, max_sents: int = 3):
    e = get_entry(entry_id)
    if not e: raise HTTPException(404, "Not found")
    return {"summary": summarize(e.text, max_sents=max_sents)}
# ----- Reminders -----
@app.post("/reminders")
def reminders_add(body: ReminderIn):
    r = add_reminder(body.medicine, body.time_local, body.tz or "America/Chicago")
    return {"id": r.id, "medicine": r.medicine, "time_local": r.time_local, "tz": r.tz, "is_active": r.is_active}

@app.get("/reminders")
def reminders_list():
    rows = list_reminders()
    return [{"id": r.id, "medicine": r.medicine, "time_local": r.time_local, "tz": r.tz, "is_active": r.is_active, "last_triggered": r.last_triggered} for r in rows]

@app.delete("/reminders/{rem_id}")
def reminders_delete(rem_id: int):
    ok = delete_reminder(rem_id)
    if not ok:
        raise HTTPException(404, "Not found")
    return {"ok": True}

@app.post("/reminders/{rem_id}/toggle")
def reminders_toggle(rem_id: int, body: ToggleIn):
    r = toggle_reminder(rem_id, body.active)
    if not r:
        raise HTTPException(404, "Not found")
    return {"id": r.id, "is_active": r.is_active}

@app.post("/reminders/{rem_id}/test")
def reminders_test(rem_id: int):
    test_fire(rem_id)
    return {"ok": True}

@app.get("/reminders/events")
def reminders_events(since: str | None = None, limit: int = 50):
    dt = None
    if since:
        try:
            dt = datetime.fromisoformat(since)
        except Exception:
            pass
    rows = recent_events(dt, limit)
    return [{"id": e.id, "reminder_id": e.reminder_id, "fired_at": e.fired_at, "message": e.message} for e in rows]

class TTSIn(BaseModel):
    text: str
    lang: str | None = "en"

@app.post("/tts")
def tts(body: TTSIn):
    fname, ok = tts_synthesize(body.text, body.lang or "en")
    return {"url": f"/audio/{fname}", "generated": ok}
