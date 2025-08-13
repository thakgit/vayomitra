
// src/services/api.js
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const ttsSynthesize = getAudioUrlFor;

// ----- Mood / Tips -----
export async function analyzeSentiment(text) {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(`Analyze failed (${res.status})`);
  return res.json(); // { compound,pos,neu,neg,label }
}

export async function getDailyTip(period) {
  const url = new URL(`${BASE}/agent/tip`);
  if (period) url.searchParams.set("period", period);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tip fetch failed (${res.status})`);
  return res.json(); // { tip }
}

// ----- Stories / RAG -----
export async function fetchStories() {
  const res = await fetch(`${BASE}/stories`);
  if (!res.ok) throw new Error(`Stories fetch failed (${res.status})`);
  return res.json();
}

export async function fetchLanguages() {
  const res = await fetch(`${BASE}/stories/languages`);
  if (!res.ok) throw new Error(`Languages fetch failed (${res.status})`);
  return res.json();
}

export async function fetchTags() {
  const res = await fetch(`${BASE}/stories/tags`);
  if (!res.ok) throw new Error(`Tags fetch failed (${res.status})`);
  return res.json();
}

export async function fetchStoryText(id) {
  const res = await fetch(`${BASE}/stories/${id}/text`);
  if (!res.ok) throw new Error(`Story text fetch failed (${res.status})`);
  return res.json(); // { id,title,language,text }
}

export function getAudioUrlFor(storyId, language) {
  return `${BASE}/audio/${storyId}_${language}.wav`;
}

export async function searchStories(query, k = 5) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("k", String(k));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return res.json(); // [{id,title,language,score,snippet}]
}

// ----- Agent -----
export async function agentRecommend(mood) {
  const url = new URL(`${BASE}/agent/recommend`);
  if (mood) url.searchParams.set("mood", mood);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Recommend failed (${res.status})`);
  return res.json(); // { query,nudge,stories:[...] }
}

// ----- Journal -----
export async function addJournal(text) {
  const res = await fetch(`${BASE}/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error(`Journal add failed (${res.status})`);
  return res.json(); // { id, created_at, sentiment, compound }
}

export async function listJournal(limit = 50) {
  const url = new URL(`${BASE}/journal`);
  url.searchParams.set("limit", String(limit));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Journal list failed (${res.status})`);
  return res.json(); // [{ id, created_at, sentiment, compound, text }]
}

export async function getJournal(id) {
  const res = await fetch(`${BASE}/journal/${id}`);
  if (!res.ok) throw new Error(`Journal get failed (${res.status})`);
  return res.json(); // { id, created_at, sentiment, compound, text }
}

export async function summarizeJournal(id, max_sents = 3) {
  const url = new URL(`${BASE}/journal/${id}/summarize`);
  url.searchParams.set("max_sents", String(max_sents));
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Summarize failed (${res.status})`);
  return res.json(); // { summary }
}

// Reminders API
export async function remindersAdd({ medicine, time_local, tz = "America/Chicago" }) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicine, time_local, tz })
  });
  if (!res.ok) throw new Error(`Add reminder failed (${res.status})`);
  return res.json();
}

export async function remindersList() {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/reminders`);
  if (!res.ok) throw new Error(`List reminders failed (${res.status})`);
  return res.json();
}

export async function remindersToggle(id, active) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/reminders/${id}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active })
  });
  if (!res.ok) throw new Error(`Toggle reminder failed (${res.status})`);
  return res.json();
}

export async function remindersDelete(id) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/reminders/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete reminder failed (${res.status})`);
  return res.json();
}

export async function remindersTest(id) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const res = await fetch(`${base}/reminders/${id}/test`, { method: "POST" });
  if (!res.ok) throw new Error(`Test reminder failed (${res.status})`);
  return res.json();
}

export async function remindersEvents({ since, limit = 50 } = {}) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const u = new URL(`${base}/reminders/events`);
  if (since) u.searchParams.set("since", since);
  if (limit) u.searchParams.set("limit", String(limit));
  const res = await fetch(u);
  if (!res.ok) throw new Error(`Events fetch failed (${res.status})`);
  return res.json();
}
