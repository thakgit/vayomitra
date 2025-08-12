import os
import pyttsx3

# Single shared engine instance
_engine = None

def _engine_instance():
    global _engine
    if _engine is None:
        _engine = pyttsx3.init()
    return _engine

_PREFERRED = {
    "english": ["Zira", "Aria", "David", "Microsoft"],
    "hindi":   ["Heera", "Ravi", "Hindi", "Microsoft"],
    "gujarati":["Gujarati"]  # Often not installed; will fall back.
}

def _pick_voice(engine, language: str):
    language = (language or "english").lower()
    prefs = _PREFERRED.get(language, [])
    for v in engine.getProperty("voices"):
        name = (v.name or "").lower()
        if any(p.lower() in name for p in prefs):
            return v.id
    return None  # fallback to default voice

def synth_to_file(text: str, out_path: str, language: str = "english"):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    eng = _engine_instance()
    vid = _pick_voice(eng, language)
    if vid:
        eng.setProperty("voice", vid)
    eng.save_to_file(text, out_path)
    eng.runAndWait()
    return out_path
