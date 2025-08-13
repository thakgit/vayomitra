// src/components/MedicineReminder.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  remindersAdd,
  remindersList,
  remindersToggle,
  remindersDelete,
  remindersTest,
  remindersEvents,
} from "../services/api";

/** Simple time formatter (shows local time) */
function fmtTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "2-digit"
  });
}

export default function MedicineReminder() {
  // ---- Reminders CRUD ----
  const [medicine, setMedicine] = useState("");
  const [timeLocal, setTimeLocal] = useState("09:00");
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago");

  const [reminders, setReminders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // ---- Events (and polling) ----
  const [events, setEvents] = useState([]);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef(null);

  // Load reminders on mount
  useEffect(() => {
    (async () => {
      try {
        const list = await remindersList();
        setReminders(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        setErr("Could not load reminders.");
      }
    })();
  }, []);

  // Fetch events (manual refresh + used by polling)
  const loadEvents = async () => {
    try {
      const out = await remindersEvents({ limit: 50 });
      setEvents(Array.isArray(out) ? out : (out?.events || []));
    } catch (e) {
      console.error(e);
      setErr("Could not load events.");
    }
  };

  // Polling toggle
  useEffect(() => {
    if (!polling) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      return;
    }
    // Start polling
    loadEvents(); // burst once
    pollRef.current = setInterval(loadEvents, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling]);

  // ---- De-duplicate events in UI (message+minute) ----
  const { uniqueEvents, countsMap } = useMemo(() => {
    const seen = new Map();
    const counts = new Map();

    // newest first
    const sorted = [...events].sort((a, b) => {
      const at = new Date(a.time || a.created_at || a.ts || 0).getTime();
      const bt = new Date(b.time || b.created_at || b.ts || 0).getTime();
      return bt - at;
    });

    for (const e of sorted) {
      const msg = (e.message || e.msg || e.text || "").trim();
      const d = new Date(e.time || e.created_at || e.ts || 0);
      const minuteIso = isNaN(d.getTime())
        ? ""
        : new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();

      const key = `${msg}|${minuteIso}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      if (!seen.has(key)) seen.set(key, e); // keep newest for that minute+message
    }

    return { uniqueEvents: Array.from(seen.values()), countsMap: counts };
  }, [events]);

  // ---- Handlers ----
  const onAdd = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await remindersAdd({ medicine, time_local: timeLocal, tz });
      const list = await remindersList();
      setReminders(Array.isArray(list) ? list : []);
      setMedicine("");
    } catch (err) {
      console.error(err);
      setErr("Could not add reminder.");
    } finally {
      setBusy(false);
    }
  };

  const onToggle = async (id, active) => {
    setErr("");
    try {
      await remindersToggle(id, active);
      const list = await remindersList();
      setReminders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setErr("Could not toggle reminder.");
    }
  };

  const onDelete = async (id) => {
    setErr("");
    try {
      await remindersDelete(id);
      const list = await remindersList();
      setReminders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setErr("Could not delete reminder.");
    }
  };

  const onTest = async (id) => {
    setErr("");
    try {
      await remindersTest(id);
      await loadEvents();
    } catch (e) {
      console.error(e);
      setErr("Could not send test notification.");
    }
  };

  return (
    <div className="reminders">
      {/* Form */}
      <div className="vm-card" style={{ marginBottom: 14 }}>
        <h3 style={{ marginTop: 0 }}>Create a reminder</h3>
        <form onSubmit={onAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={medicine}
            onChange={e => setMedicine(e.target.value)}
            placeholder="Medicine name"
            required
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "var(--fg)" }}
          />
          <input
            type="time"
            value={timeLocal}
            onChange={e => setTimeLocal(e.target.value)}
            required
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "var(--fg)" }}
          />
          <input
            value={tz}
            onChange={e => setTz(e.target.value)}
            placeholder="Time zone (IANA)"
            style={{ minWidth: 240, padding: "8px 10px", borderRadius: 10, border: "1px solid #334155", background: "#0f172a", color: "var(--fg)" }}
          />
          <button className="btn btn--primary" disabled={busy} type="submit">
            {busy ? "Saving..." : "Add"}
          </button>
          {err && <span style={{ color: "#fca5a5", marginLeft: 10 }}>{err}</span>}
        </form>
      </div>

      {/* Reminders list */}
      <div className="vm-card" style={{ marginBottom: 14 }}>
        <h3 style={{ marginTop: 0 }}>Your reminders</h3>
        {reminders.length === 0 ? (
          <div className="muted">No reminders yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {reminders.map(r => (
              <li key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--card-border)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.medicine || r.medicineName || "Medicine"}</div>
                  <div className="muted" style={{ opacity: .85 }}>
                    Time: {r.time_local || r.timeLocal || r.time || "—"} &nbsp;|&nbsp; TZ: {r.tz || "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => onToggle(r.id, !r.active)}>{r.active ? "Disable" : "Enable"}</button>
                  <button className="btn" onClick={() => onTest(r.id)}>Test</button>
                  <button className="btn btn--ghost" onClick={() => onDelete(r.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Events with de-dup */}
      <div className="vm-card events">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ marginTop: 0 }}>📢 Events</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={loadEvents}>Refresh</button>
            <button className="btn" onClick={() => setPolling(p => !p)}>{polling ? "Stop Poll" : "Start Poll"}</button>
          </div>
        </div>
        <div className="muted" style={{ marginBottom: 10 }}>
          Newest first. Polling: <strong>{polling ? "ON" : "OFF"}</strong>
        </div>

        {uniqueEvents.length === 0 ? (
          <div className="muted">No events yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {uniqueEvents.map(ev => {
              const msg = (ev.message || ev.msg || ev.text || "").trim() || "—";
              const t = new Date(ev.time || ev.created_at || ev.ts || 0);
              const minuteIso = isNaN(t.getTime())
                ? ""
                : new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()).toISOString();
              const key = `${msg}|${minuteIso}`;
              const n = countsMap.get(key) || 1;

              return (
                <li key={ev.id ?? key}
                    className="vm-card"
                    style={{ marginBottom: 10, position: "relative", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ fontWeight: 600 }}>{msg}</div>
                  <div className="muted" style={{ opacity: .85 }}>{fmtTime(ev.time || ev.created_at || ev.ts)}</div>
                  {n > 1 && (
                    <span style={{
                      position: "absolute", top: 8, right: 10,
                      fontSize: 12, opacity: .75,
                      padding: "2px 6px", borderRadius: 10,
                      border: "1px solid rgba(255,255,255,.12)",
                      background: "rgba(255,255,255,.06)"
                    }}>
                      ×{n}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
