from typing import Dict
# FIX: import from top level, not relative
from rag import StoryRAG

def recommend(rag: StoryRAG, mood: str | None = None) -> Dict:
    """
    Given a mood or free-text, return a suggested tip-like nudge and top stories.
    """
    q = (mood or "").strip()
    if not q:
        q = "calm kindness friendship breathing"
    # Search stories via RAG
    results = rag.search(q, k=5)
    stories = [{
        "id": s["id"],
        "title": s["title"],
        "language": s["language"],
        "score": float(score),
        "snippet": (s.get("text","")[:160] + "…") if s.get("text") else ""
    } for s, score in results]

    # Heuristic nudge
    lower = q.lower()
    if any(w in lower for w in ["anxious","stress","stressed","worry"]):
        nudge = "Try a 3-minute breathing story to settle your mind."
    elif any(w in lower for w in ["sad","down","lonely"]):
        nudge = "A warm friendship or family story might lift your mood."
    else:
        nudge = "Choose a calm, short story to begin. Slow inhales, gentle exhales."

    return {"query": q, "nudge": nudge, "stories": stories}
