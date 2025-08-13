import React, { useEffect, useState } from "react";
import { searchStories } from "../services/api";

export default function RelatedStories({ story, onOpen }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const run = async () => {
      setItems([]);
      setErr("");
      if (!story?.id) return;
      // Build a simple query from title + tags
      const q = `${story.title || ""} ${(story.tags || []).join(" ")}`.trim() || "calm kindness friendship";
      try {
        const data = await searchStories(q, 6);
        // filter out the current story
        setItems((data || []).filter(d => d.id !== story.id));
      } catch (e) {
        console.error(e);
        setErr("Could not load related stories.");
      }
    };
    run();
  }, [story]);

  if (!story?.id) return null;

  return (
    <div className="vm-card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0 }}>🧩 Related Stories</h3>
      {err && <div className="vm-tip" style={{ borderColor: "#ef4444" }}>⚠️ {err}</div>}
      {items.length === 0 ? (
        <div style={{ color: "#94a3b8" }}>No related stories yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map(r => (
            <div key={r.id} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontWeight: 700 }}>
                  {r.title} <span style={{ opacity: .7, fontWeight: 500 }}>({r.language})</span>
                </div>
                <div style={{ fontSize: 12, opacity: .7 }}>score {Number(r.score).toFixed(2)}</div>
              </div>
              <div style={{ color: "#94a3b8", margin: "6px 0 10px" }}>{r.snippet}</div>
              <button className="btn" onClick={() => onOpen?.(r.id)}>Open</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
