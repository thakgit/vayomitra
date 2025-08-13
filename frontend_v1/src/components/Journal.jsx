import React, { useEffect, useState } from "react";
import { addJournal, listJournal, getJournal, summarizeJournal } from "../services/api";
import Modal from "./Modal.jsx";
import { useToast } from "./Toast.jsx";

export default function Journal() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [err, setErr] = useState("");
  const [summaries, setSummaries] = useState({}); // id -> summary
  const [openId, setOpenId] = useState(null);
  const [openText, setOpenText] = useState("");
  const toast = useToast();

  const load = async () => {
    try {
      const data = await listJournal(50);
      setEntries(data || []);
    } catch (e) {
      console.error(e);
      setErr("Could not load journal.");
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!text.trim()) return;
    try {
      await addJournal(text.trim());
      setText("");
      await load();
      toast.push("Saved your entry.");
    } catch (e) {
      console.error(e);
      setErr("Could not save.");
      toast.push("Could not save.", "error");
    }
  };

  const summarize = async (id) => {
    try {
      const data = await summarizeJournal(id, 3);
      setSummaries(prev => ({ ...prev, [id]: data?.summary || "" }));
      toast.push("Summary ready.");
    } catch (e) {
      console.error(e);
      setErr("Could not summarize.");
      toast.push("Could not summarize.", "error");
    }
  };

  const viewFull = async (id) => {
    try {
      const data = await getJournal(id);
      setOpenText(data?.text || "");
      setOpenId(id);
    } catch (e) {
      console.error(e);
      setErr("Could not load entry.");
      toast.push("Could not load entry.", "error");
    }
  };

  return (
    <div>
      <div className="vm-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>📝 New Journal Entry</h3>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a few lines about your day…"
          style={{ width: "100%", background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 10, padding: 10 }}
        />
        <div style={{ marginTop: 8 }}>
          <button className="btn btn--primary" onClick={add}>Save Entry</button>
        </div>
      </div>

      {err && <div className="vm-tip" style={{ borderColor: "#ef4444", marginBottom: 8 }}>⚠️ {err}</div>}

      <div className="vm-card">
        <h3 style={{ marginTop: 0 }}>📚 Recent Entries</h3>
        {entries.length === 0 ? (
          <div style={{ color: "#94a3b8" }}>No entries yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {entries.map((e) => (
              <div key={e.id} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                  <div>
                    <strong>{new Date(e.created_at).toLocaleString()}</strong>
                    <span style={{ marginLeft: 10, opacity:.8 }}>
                      {e.sentiment} ({Number(e.compound).toFixed(2)})
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn" onClick={() => viewFull(e.id)}>View</button>
                    <button className="btn" onClick={() => summarize(e.id)}>Summarize</button>
                  </div>
                </div>
                <div style={{ color:"#94a3b8", marginTop:6 }}>{e.text}</div>
                {summaries[e.id] && (
                  <div className="vm-tip" style={{ marginTop:8 }}>
                    <strong>TL;DR:</strong> {summaries[e.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!openId} title="Journal Entry" onClose={() => setOpenId(null)}>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{openText}</div>
      </Modal>
    </div>
  );
}
