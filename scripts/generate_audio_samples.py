# Offline TTS using Windows SAPI via pyttsx3
# Creates WAV files in backend/audio/: story_english.wav, story_hindi.wav, story_gujarati.wav

import os
import pyttsx3

ROOT = os.path.dirname(os.path.dirname(__file__))
AUDIO_DIR = os.path.join(ROOT, "backend", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

lines = {
    "story_english.wav": "Once upon a time, an elder shared wisdom about living with love and peace.",
    "story_hindi.wav": "एक समय की बात है, एक बुज़ुर्ग ने प्रेम और शांति के साथ जीने की सीख दी।",
    "story_gujarati.wav": "એક વખતની વાત છે, એક વૃદ્ધે પ્રેમ અને શાંતિથી જીવવાની શીખ આપી."
}

# Optional: try to choose a voice by language name (may vary per system)
# If you don't have Hindi/Gujarati voices installed, Windows will use default English.
PREFERRED_VOICES = {
    "english": ["Microsoft Zira", "Microsoft Aria", "Zira", "Aria", "David"],
    "hindi":   ["Microsoft Heera", "Heera", "Microsoft Ravi", "Ravi"],
    "gujarati":["Gujarati"]  # Often not present; will fall back.
}

def pick_voice(engine, keywords):
    for v in engine.getProperty('voices'):
        name = (v.name or "").lower()
        if any(k.lower() in name for k in keywords):
            return v.id
    return None

engine = pyttsx3.init()

def synth_to_file(text, out_path, voice_keywords):
    voice_id = pick_voice(engine, voice_keywords)
    if voice_id:
        engine.setProperty('voice', voice_id)
    engine.save_to_file(text, out_path)
    engine.runAndWait()

synth_to_file(lines["story_english.wav"],  os.path.join(AUDIO_DIR, "story_english.wav"),  PREFERRED_VOICES["english"])
synth_to_file(lines["story_hindi.wav"],    os.path.join(AUDIO_DIR, "story_hindi.wav"),    PREFERRED_VOICES["hindi"])
synth_to_file(lines["story_gujarati.wav"], os.path.join(AUDIO_DIR, "story_gujarati.wav"), PREFERRED_VOICES["gujarati"])

print("✅ Generated WAV files in:", AUDIO_DIR)
