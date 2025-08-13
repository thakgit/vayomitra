import React from "react";
import MedicineReminder from "../components/MedicineReminder.jsx";

export default function Reminders() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Reminders</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <MedicineReminder />
      </div>
    </section>
  );
}
