import React, { useEffect, useState } from "react";
import { getDailyTip } from "../services/api";

export default function TipsMock() {
  const [tip, setTip] = useState("");
  const [period, setPeriod] = useState(""); // "", "morning", "evening"
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchTip = async (p = period) => {
    try {
      setLoading(true);
      setErr("");
      const data = await getDailyTip(p || undefined);
      setTip(data?.tip || "Have a peaceful day.");
    } catch (e) {
      console.error(e);
      setErr("Could not fetch tip.");
    } finally {
      setLoading(false);
    }
  };

  // Call once on load
  useEffect(() => {
    fetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vm-form">
      <div className="vm-form__row" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
        <label>
          Time of day&nbsp;
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "6px 8px" }}
          >
            <option value="">Any</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </label>

        <button className="btn btn--primary" onClick={() => fetchTip()} disabled={loading}>
          {loading ? "Loading…" : "Get Daily Tip"}
        </button>
      </div>

      {err && <div className="vm-tip" style={{ borderColor: "#ef4444" }}>⚠️ {err}</div>}

      <div className="vm-tip">
        <strong>🌞 Tip:</strong> {tip || "—"}
      </div>
    </div>
  );
}
