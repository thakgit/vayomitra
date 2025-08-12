import React, { useState } from "react";
import { searchStories } from "../services/api";

export default function StoriesSearch({ onOpen }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [results, setResults] = useState([]);

  const run = async () => {
    if (!q.trim()) return;
    try {
      setLoading(true);
      setErr("");
      const data = await searchStories(q.trim(), 8);
      setResults(data || []);
    } catch (e) {
      console.error(e);
      setErr("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") run();
  };

  return (
    <div className="vm-card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search stories (e.g., kindness, friendship, breathing)…"
          style={{ flex: 1, background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "8px 10px" }}
        />
        <button className="btn btn--primary" onClick={run} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {err && <div className="vm-tip" style={{ borderColor: "#ef4444" }}>⚠️ {err}</div>}

      {results.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {results.map((r) => (
            <div key={r.id} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontWeight: 700 }}>
                  {r.title} <span style={{ opacity: 0.7, fontWeight: 500 }}>({r.language})</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>score {r.score.toFixed(2)}</div>
              </div>
              <div style={{ color: "#94a3b8", margin: "6px 0 10px" }}>{r.snippet}</div>
              <div>
                <button className="btn" onClick={() => onOpen?.(r.id)}>Open</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
