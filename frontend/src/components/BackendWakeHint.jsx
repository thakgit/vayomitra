// src/components/BackendWakeHint.jsx
import React, { useEffect, useState } from "react";
import { subscribeWake } from "../utils/backendWakeBus";

export default function BackendWakeHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    return subscribeWake(setShow); // subscribe/unsubscribe
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        background: "#fff8e1",
        color: "#8a6d3b",
        padding: "10px 14px",
        border: "1px solid #faebcc",
        borderRadius: 8,
        margin: "12px 0",
        fontSize: "0.95rem",
      }}
    >
      ⏳ <b>Please wait a moment…</b>
      <div style={{ marginTop: 4 }}>
        Our free backend may sleep when idle. Waking up can take 10–20 seconds.
        The page will refresh automatically once it’s ready.
      </div>
    </div>
  );
}
