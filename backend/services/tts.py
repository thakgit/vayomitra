import hashlib, os
from typing import Tuple
import contextlib

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(HERE), "data")
AUDIO_DIR = os.path.join(DATA_DIR, "audio")

def _hash(text: str, lang: str) -> str:
    return hashlib.sha1(f"{lang}:{text}".encode("utf-8")).hexdigest()[:16]

def synthesize(text: str, lang: str = "en") -> Tuple[str, bool]:
    """
    Returns (filename, generated_bool). On failure, returns demo file.
    """
    os.makedirs(AUDIO_DIR, exist_ok=True)
    key = _hash(text, lang)
    fname = f"tts_{lang}_{key}.wav"
    fpath = os.path.join(AUDIO_DIR, fname)

    # If already exists, return it
    if os.path.isfile(fpath):
        return fname, True

    # Try pyttsx3 (offline)
    try:
        import pyttsx3
        engine = pyttsx3.init()
        # Optional: pick voice by lang if available
        try:
            for v in engine.getProperty("voices"):
                if lang.lower() in (v.languages[0].decode("utf-8", "ignore").lower() if isinstance(v.languages[0], bytes) else str(v.languages[0]).lower()):
                    engine.setProperty("voice", v.id)
                    break
        except Exception:
            pass
        engine.save_to_file(text, fpath)
        engine.runAndWait()
        return fname, True
    except Exception:
        # Fallback to static demo
        demo = "demo_en.wav"
        demo_path = os.path.join(AUDIO_DIR, demo)
        if not os.path.isfile(demo_path):
            # create a tiny placeholder wav (1 second silence) if demo missing
            import wave, struct
            with contextlib.closing(wave.open(demo_path, 'w')) as wf:
                wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(16000)
                frames = [0] * 16000
                wf.writeframes(b''.join(struct.pack('<h', f) for f in frames))
        return demo, False
