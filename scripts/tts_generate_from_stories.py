"""
Reads stories/index.json, loads each story text file, and generates WAV audio
into backend/audio as <story_id>_<language>.wav using offline pyttsx3.
"""

import json
from pathlib import Path
from backend.tts import synth_to_file
from backend.utils import load_index, get_story_text_by_id, lang_from_id

ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIR = ROOT / "backend" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

def main():
    idx = load_index()
    if not idx:
        print("No index.json found or it's empty. Aborting.")
        return

    for item in idx:
        story_id = item.get("id")
        language = (item.get("language") or lang_from_id(story_id)).lower()
        text = get_story_text_by_id(story_id)
        if text.lower().startswith("story not"):
            print(f"Skipping {story_id}: {text}")
            continue

        out = AUDIO_DIR / f"{story_id}_{language}.wav"
        print(f"-> Generating {out.name} ({language})...")
        synth_to_file(text, str(out), language)

    print(f"✅ Done. Files in: {AUDIO_DIR}")

if __name__ == "__main__":
    main()
