import React, { useEffect, useState } from "react";
import { agentRecommend } from "../services/api";

export default function AgentSuggest({ mood, onOpen }) {
  const [q, setQ] = useState("");
  const [nudge, setNudge] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const run = async (query) => {
    if (!query?.trim()) return;
    try {
      setLoading(true);
      setErr("");
      const data = await agentRecommend(query.trim());
      setNudge(data?.nudge || "");
      setResults(data?.stories || []);
    } catch (e) {
      console.error(e);
      setErr("Could not fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when mood prop changes
  useEffect(() => {
    if (mood && mood.trim()) {
      setQ(mood);
      run(mood);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  return (
    <div className="vm-card" style={{ marginTop: 12 }}>
      <h3 style={{ marginTop: 0, marginBottom: 8 }}>🤝 Agent Suggestions</h3>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Describe how you're feeling… (e.g., anxious, lonely, calm)"
          style={{ flex: 1, background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "8px 10px" }}
        />
        <button className="btn btn--primary" onClick={() => run(q)} disabled={loading}>
          {loading ? "Thinking…" : "Suggest"}
        </button>
      </div>

      {nudge && <div className="vm-tip" style={{ marginBottom: 8 }}>{nudge}</div>}
      {err && <div className="vm-tip" style={{ borderColor: "#ef4444" }}>⚠️ {err}</div>}

      {results?.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          {results.map((r) => (
            <div key={r.id} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontWeight: 700 }}>
                  {r.title} <span style={{ opacity: 0.7, fontWeight: 500 }}>({r.language})</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>score {Number(r.score).toFixed(2)}</div>
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
