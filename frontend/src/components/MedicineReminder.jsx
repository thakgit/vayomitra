import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  remindersAdd, remindersList, remindersToggle,
  remindersDelete, remindersTest, remindersEvents
} from "../services/api";
import { useToast } from "./Toast.jsx";

function toLocalTimeString() {
  // Returns current time+2 minutes as "HH:MM"
  const d = new Date(Date.now() + 2 * 60 * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function MedicineReminder() {
  const [medicine, setMedicine] = useState("");
  const [timeLocal, setTimeLocal] = useState(toLocalTimeString());
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [polling, setPolling] = useState(true);
  const sinceRef = useRef(null);
  const toast = useToast();

  const load = async () => {
    try {
      const list = await remindersList();
      setItems(list || []);
    } catch (e) {
      console.error(e);
      toast?.push("Could not load reminders.", "error");
    }
  };

  const loadEvents = async () => {
    try {
      const data = await remindersEvents({ since: sinceRef.current });
      if (Array.isArray(data) && data.length > 0) {
        // update "since" to newest event time (ISO)
        const newest = data[0]?.fired_at;
        if (newest) sinceRef.current = newest;
        setEvents(prev => [...data, ...prev].slice(0, 100));
        // toast the newest event
        data.forEach(evt => toast?.push(evt.message));
      }
    } catch (e) {
      console.error("Suggest error:", e);
      setError(e?.message ?? "Could not fetch suggestions.");
    }
  };

  useEffect(() => {
    load();
    loadEvents();
    if (!polling) return;
    const id = setInterval(loadEvents, 20000); // 20s
    return () => clearInterval(id);
  }, [polling]);

  const add = async () => {
    if (!medicine.trim() || !timeLocal) return;
    try {
      await remindersAdd({ medicine: medicine.trim(), time_local: timeLocal });
      setMedicine("");
      toast?.push("Reminder added.");
      await load();
    } catch (e) {
      console.error(e);
      toast?.push("Could not add reminder.", "error");
    }
  };

  const toggle = async (id, active) => {
    try {
      await remindersToggle(id, active);
      await load();
      toast?.push(active ? "Reminder enabled." : "Reminder paused.");
    } catch (e) {
      console.error(e);
      toast?.push("Toggle failed.", "error");
    }
  };

  const remove = async (id) => {
    try {
      await remindersDelete(id);
      await load();
      toast?.push("Reminder deleted.");
    } catch (e) {
      console.error(e);
      toast?.push("Delete failed.", "error");
    }
  };

  const test = async (id) => {
    try {
      await remindersTest(id);
      await loadEvents();
      toast?.push("Test event fired.");
    } catch (e) {
      console.error(e);
      toast?.push("Test failed.", "error");
    }
  };

  const nextDoseHint = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return "";
    const active = items.filter(r => r.is_active);
    if (active.length === 0) return "";
    const times = active.map(r => r.time_local).sort();
    return `Next scheduled time(s): ${times.join(", ")}`;
  }, [items]);

  return (
    <div className="vm-form">
      {/* Add form */}
      <div className="vm-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>⏰ Add Medicine Reminder</h3>
        <div className="vm-form__row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Medicine name (e.g., Vitamin D)"
            style={{ flex: 1, minWidth: 220, background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "8px 10px" }}
          />
          <input
            type="time"
            value={timeLocal}
            onChange={(e) => setTimeLocal(e.target.value)}
            style={{ background: "#0f172a", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "8px 10px" }}
          />
          <button className="btn btn--primary" onClick={add}>Add</button>
        </div>
        {nextDoseHint && <div className="vm-tip" style={{ marginTop: 8 }}>{nextDoseHint}</div>}
      </div>

      {/* List */}
      <div className="vm-card" style={{ marginBottom: 12 }}>
        <h3 style={{ marginTop: 0 }}>💊 Reminders</h3>
        {items.length === 0 ? (
          <div style={{ color: "#94a3b8" }}>No reminders yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {items.map(r => (
              <div key={r.id} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div>
                    <strong>{r.medicine}</strong>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                      at <code>{r.time_local}</code> ({r.tz}) {r.is_active ? "• active" : "• paused"}
                      {r.last_triggered && <> • last: {new Date(r.last_triggered).toLocaleString()}</>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => test(r.id)}>Test</button>
                    <button className="btn" onClick={() => toggle(r.id, !r.is_active)}>{r.is_active ? "Pause" : "Enable"}</button>
                    <button className="btn" onClick={() => remove(r.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Events */}
      <div className="vm-card">
        <h3 style={{ marginTop: 0 }}>📣 Events</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ color: "#94a3b8" }}>
            Newest first. Polling: {polling ? "ON" : "OFF"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={loadEvents}>Refresh</button>
            <button className="btn" onClick={() => setPolling(p => !p)}>{polling ? "Stop" : "Start"} Poll</button>
          </div>
        </div>
        {events.length === 0 ? (
          <div style={{ color: "#94a3b8" }}>No events yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            {events.map(e => (
              <div key={`${e.id}-${e.fired_at}`} style={{ border: "1px solid #1f2937", borderRadius: 10, padding: 10, background: "#0b1220" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{e.message}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(e.fired_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
