from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_analyzer = SentimentIntensityAnalyzer()

def analyze(text: str) -> dict:
    """
    Returns {compound, pos, neu, neg, label}
    label in {"Positive","Neutral","Negative"} based on compound thresholds.
    """
    s = _analyzer.polarity_scores(text or "")
    comp = s.get("compound", 0.0)
    if comp >= 0.05:
        label = "Positive"
    elif comp <= -0.05:
        label = "Negative"
    else:
        label = "Neutral"
    return {
        "compound": comp,
        "pos": s.get("pos", 0.0),
        "neu": s.get("neu", 0.0),
        "neg": s.get("neg", 0.0),
        "label": label
    }
