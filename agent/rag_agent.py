import json
import random
import os

PROMPTS_PATH = os.path.join(os.path.dirname(__file__), '..', 'config', 'prompts.json')

def load_prompts():
    with open(PROMPTS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_greeting(language: str) -> str:
    prompts = load_prompts()
    intro = prompts.get("introduction", {}).get(language.lower(), "")
    return intro or "Hello and welcome!"

def get_random_quote(language: str) -> str:
    prompts = load_prompts()
    quote = prompts.get("daily_quote", {}).get(language.lower(), "")
    return quote or "Stay positive!"

def get_meditation_tip(language: str) -> str:
    prompts = load_prompts()
    tip = prompts.get("meditation_tip", {}).get(language.lower(), "")
    return tip or "Take a deep breath and relax."
