import json
import os
from pathlib import Path

# --- Existing simple features ---
def get_sentiment(text: str) -> float:
    positive_words = ["happy", "peace", "joy", "love"]
    negative_words = ["sad", "angry", "hate", "lonely"]
    score = 0
    for w in text.lower().split():
        if w in positive_words: score += 1
        elif w in negative_words: score -= 1
    return round(score / max(1, len(text.split())), 2)

def get_story(language: str) -> str:
    stories = {
        "english": "Once upon a time, a wise elder shared his wisdom...",
        "hindi": "एक समय की बात है, एक बुज़ुर्ग ने ज्ञान की बातें साझा कीं...",
        "gujarati": "એક વખતની વાત છે, એક વૃદ્ધે પોતાનું જ્ઞાન વહેંચ્યું..."
    }
    return stories.get(language.lower(), "Story not available in this language.")

# --- New: Story index + text by ID ---
ROOT = Path(__file__).resolve().parents[1]   # project root
INDEX_PATH = ROOT / "stories" / "index.json"

def load_index():
    if not INDEX_PATH.exists():
        return []
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def lang_from_id(story_id: str) -> str:
    sid = (story_id or "").lower()
    if sid.startswith("guj_"): return "gujarati"
    if sid.startswith("hin_"): return "hindi"
    if sid.startswith("eng_"): return "english"
    return "english"

def get_story_text_by_id(story_id: str) -> str:
    index = load_index()
    for item in index:
        if item.get("id") == story_id:
            path = ROOT / item["path"]
            if path.exists():
                return path.read_text(encoding="utf-8").strip()
            return "Story file not found on disk."
    return "Story not found in index."
