import random

TIP_BUCKETS = {
    "morning": [
        "Drink warm water and stretch for 2 minutes.",
        "Breathe deeply 5 times before you start your day.",
        "Send a kind message to someone you love."
    ],
    "evening": [
        "Write one good thing that happened today.",
        "Take a short walk after dinner.",
        "Listen to soft music for 5 minutes."
    ],
    "any": [
        "Smile at someone today.",
        "Read a page from Gita / a favorite book.",
        "Declutter a small shelf or drawer."
    ],
}

def suggest(period: str | None = None) -> str:
    period = (period or "any").lower()
    pool = TIP_BUCKETS.get(period, TIP_BUCKETS["any"]) + TIP_BUCKETS["any"]
    return random.choice(pool)
