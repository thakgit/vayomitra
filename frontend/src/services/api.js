// src/services/api.js

// Use ONE of these per environment:
//   REACT_APP_API_URL=https://vayomitra.onrender.com   (recommended)
//   REACT_APP_API_URL=/api                             (if using Netlify proxy)
// Dev example: REACT_APP_API_URL=http://localhost:8000
const RAW_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8000").trim();
const CLEAN_BASE = RAW_BASE.replace(/^=+/, "");   // strip accidental leading '='
const BASE = CLEAN_BASE.replace(/\/+$/, "");      // strip trailing '/'


// helper to build URL + query string
function url(path, params) {
  const p = path.startsWith("/") ? path : `/${path}`;

  // add bypass flag only when using a relative proxy like /api
  const addBypass = BASE.startsWith("/api")
    ? { "ngrok-skip-browser-warning": "true" }
    : {};

  const all = { ...(params || {}), ...addBypass };
  const qs = Object.entries(all)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  // IMPORTANT: don't produce CRA's "/=/" pattern — we return either:
  // - absolute: "https://.../path?qs"
  // - relative: "/api/path?qs"
  return `${BASE}${p}${qs ? `?${qs}` : ""}`;
}

// Optional: warm up Render (no behavior change to app)
export async function warmBackend() {
  try {
    await fetch(url("/agent/tip", { period: "warmup", _t: Date.now() }), {
      cache: "no-store",
    });
  } catch {}
}

// ---- Mood / Tips ----
export async function analyzeSentiment(text) {
  const res = await fetch(url("/analyze"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Analyze failed (${res.status})`);
  return res.json();
}

export async function getDailyTip(period) {
  const res = await fetch(url("/agent/tip", { period }));
  if (!res.ok) throw new Error(`Tip fetch failed (${res.status})`);
  return res.json();
}

// ---- Stories / RAG ----
export async function fetchStories() {
  const res = await fetch(url("/stories"));
  if (!res.ok) throw new Error(`Stories fetch failed (${res.status})`);
  return res.json();
}

export async function fetchLanguages() {
  const res = await fetch(url("/stories/languages"));
  if (!res.ok) throw new Error(`Languages fetch failed (${res.status})`);
  return res.json();
}

export async function fetchTags() {
  const res = await fetch(url("/stories/tags"));
  if (!res.ok) throw new Error(`Tags fetch failed (${res.status})`);
  return res.json();
}

export async function fetchStoryText(id) {
  const res = await fetch(url(`/stories/${id}/text`));
  if (!res.ok) throw new Error(`Story text fetch failed (${res.status})`);
  return res.json();
}

export function getAudioUrlFor(storyId, language) {
  return url(`/audio/${storyId}_${language}.wav`);
}
export const ttsSynthesize = getAudioUrlFor;

export async function searchStories(query, k = 5) {
  const res = await fetch(url("/search", { q: query, k }));
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return res.json();
}

// ---- Agent ----
export async function agentRecommend(mood) {
  const res = await fetch(url("/agent/recommend", { mood }));
  if (!res.ok) throw new Error(`Recommend failed (${res.status})`);
  return res.json();
}

// ---- Journal ----
export async function addJournal(text) {
  const res = await fetch(url("/journal"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Journal add failed (${res.status})`);
  return res.json();
}

export async function listJournal(limit = 50) {
  const res = await fetch(url("/journal", { limit }));
  if (!res.ok) throw new Error(`Journal list failed (${res.status})`);
  return res.json();
}

export async function getJournal(id) {
  const res = await fetch(url(`/journal/${id}`));
  if (!res.ok) throw new Error(`Journal get failed (${res.status})`);
  return res.json();
}

export async function summarizeJournal(id, max_sents = 3) {
  const res = await fetch(url(`/journal/${id}/summarize`, { max_sents }), {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Summarize failed (${res.status})`);
  return res.json();
}

// ---- Reminders ----
export async function remindersAdd({ medicine, time_local, tz = "America/Chicago" }) {
  const res = await fetch(url("/reminders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ medicine, time_local, tz }),
  });
  if (!res.ok) throw new Error(`Add reminder failed (${res.status})`);
  return res.json();
}

export async function remindersList() {
  const res = await fetch(url("/reminders"));
  if (!res.ok) throw new Error(`List reminders failed (${res.status})`);
  return res.json();
}

export async function remindersToggle(id, active) {
  const res = await fetch(url(`/reminders/${id}/toggle`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) throw new Error(`Toggle reminder failed (${res.status})`);
  return res.json();
}

export async function remindersDelete(id) {
  const res = await fetch(url(`/reminders/${id}`), { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete reminder failed (${res.status})`);
  return res.json();
}

export async function remindersTest(id) {
  const res = await fetch(url(`/reminders/${id}/test`), { method: "POST" });
  if (!res.ok) throw new Error(`Test reminder failed (${res.status})`);
  return res.json();
}

export async function remindersEvents({ since, limit = 50 } = {}) {
  const res = await fetch(url("/reminders/events", { since, limit }));
  if (!res.ok) throw new Error(`Events fetch failed (${res.status})`);
  return res.json();
}
