from typing import List, Dict, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class StoryRAG:
    def __init__(self, stories: List[Dict]):
        self.stories = stories
        self.ids = [s["id"] for s in stories]
        corpus = [f'{s.get("title","")} {s.get("text","")} {" ".join(s.get("tags",[]))}' for s in stories]
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(corpus)

    def search(self, query: str, k: int = 5) -> List[Tuple[Dict, float]]:
        if not query.strip():
            return []
        qv = self.vectorizer.transform([query])
        sims = cosine_similarity(qv, self.matrix).ravel()
        idxs = sims.argsort()[::-1][:k]
        out = []
        for i in idxs:
            out.append((self.stories[i], float(sims[i])))
        return out
