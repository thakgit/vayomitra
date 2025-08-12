from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Session, create_engine, select
from .sentiment import analyze as analyze_sentiment

class JournalEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sentiment_compound: float = 0.0
    sentiment_label: str = "Neutral"

# Very light, file DB
_engine = create_engine("sqlite:///./journal.db")

def init_db():
    SQLModel.metadata.create_all(_engine)

def add_entry(text: str) -> JournalEntry:
    s = analyze_sentiment(text)
    entry = JournalEntry(
        text=text,
        sentiment_compound=s["compound"],
        sentiment_label=s["label"]
    )
    with Session(_engine) as sess:
        sess.add(entry); sess.commit(); sess.refresh(entry)
        return entry

def list_entries(limit: int = 50) -> List[JournalEntry]:
    with Session(_engine) as sess:
        res = sess.exec(select(JournalEntry).order_by(JournalEntry.created_at.desc()).limit(limit))
        return list(res)

def get_entry(entry_id: int) -> Optional[JournalEntry]:
    with Session(_engine) as sess:
        return sess.get(JournalEntry, entry_id)

# Tiny frequency-based summarizer (no external models)
def summarize(text: str, max_sents: int = 3) -> str:
    import re, math
    # split into sentences
    sents = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    if len(sents) <= max_sents: return text
    # tokenize words, score by term frequency (stopwords minimal)
    stop = set("a an the and or but if to of in on for with this that is are was were be been being as at by from it its it's i you he she they we us our your".split())
    def words(s): return [w.lower() for w in re.findall(r"[A-Za-zÀ-ž']+", s)]
    tf = {}
    sent_tokens = []
    for s in sents:
        toks = [w for w in words(s) if w not in stop]
        sent_tokens.append(toks)
        for w in toks: tf[w] = tf.get(w, 0) + 1
    # sentence score = avg tf
    scores = []
    for i, toks in enumerate(sent_tokens):
        if not toks: scores.append((i,0)); continue
        sc = sum(tf[w] for w in toks)/len(toks)
        # small bonus for first/last sentence
        if i==0 or i==len(sents)-1: sc *= 1.1
        scores.append((i, sc))
    keep = {i for i,_ in sorted(scores, key=lambda x:x[1], reverse=True)[:max_sents]}
    # preserve original order
    out = [s for i,s in enumerate(sents) if i in keep]
    return " ".join(out)
