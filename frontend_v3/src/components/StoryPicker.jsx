import React, { useEffect, useMemo, useState } from "react";
import {
  fetchStories, fetchLanguages, fetchTags, fetchStoryText,
  getAudioUrlFor, ttsSynthesize
} from "../services/api";
import { useToast } from "./Toast.jsx";

const langMap = {
  english: "en",
  hindi: "hi",
  gujarati: "gu",
};

export default function StoryPicker({ externalSelectedId, onStoryChange }) {
  const [stories, setStories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);
  const [lang, setLang] = useState("");
  const [tag, setTag] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [storyText, setStoryText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [currentStory, setCurrentStory] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [s, l, t] = await Promise.all([fetchStories(), fetchLanguages(), fetchTags()]);
        setStories(s || []); setLanguages(l || []); setTags(t || []);
      } catch {}
    })();
  }, []);

  const filtered = useMemo(() => {
    return stories.filter(s => (!lang || s.language === lang) && (!tag || (s.tags || []).includes(tag)));
  }, [stories, lang, tag]);

  const handleSelect = async (id) => {
    setSelectedId(id);
    const story = stories.find(s => s.id === id) || null;
    setCurrentStory(story);
    onStoryChange?.(story || null);

    try {
      const data = await fetchStoryText(id);
      setStoryText(data?.text || "");
    } catch { setStoryText(""); }

    if (story) setAudioUrl(getAudioUrlFor(story.id, story.language));
    else setAudioUrl("");
  };

  // open externally selected id (from search/agent)
  useEffect(() => {
    if (externalSelectedId && externalSelectedId !== selectedId) {
      handleSelect(externalSelectedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSelectedId]);

  const handleTTS = async () => {
    if (!storyText?.trim() || !currentStory) return;
    // keep it reasonable for demo TTS engines
    const text = storyText.slice(0, 4000);
    const lang = langMap[currentStory.language] || "en";
    try {
      setTtsLoading(true);
      const { url, generated } = await ttsSynthesize(text, lang);
      setAudioUrl(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}${url}`);
      toast?.push(generated ? "Narration ready." : "Demo narration ready.");
    } catch (e) {
      console.error(e);
      toast?.push("Could not generate narration.", "error");
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="feature-section" id="stories">
      <h2>📖 Stories</h2>

      <div className="story-controls">
        <label>Language&nbsp;
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="">All</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label>Tag&nbsp;
          <select value={tag} onChange={e => setTag(e.target.value)}>
            <option value="">All</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>Story&nbsp;
          <select value={selectedId} onChange={e => handleSelect(e.target.value)}>
            <option value="">Select…</option>
            {filtered.map(s => (
              <option key={s.id} value={s.id}>{s.title} ({s.language})</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
        <div>
          <div className="reading-box">
            {storyText ? storyText : <i>Select a story to see text here…</i>}
          </div>
          {!!storyText && (
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="btn btn--primary" onClick={handleTTS} disabled={ttsLoading}>
                {ttsLoading ? "Generating…" : "🎙️ Generate narration (TTS)"}
              </button>
            </div>
          )}
        </div>

        <div>
          {audioUrl ? (
            <audio controls style={{ width: "100%" }} src={audioUrl} />
          ) : (
            <div className="audio-placeholder">Audio will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
