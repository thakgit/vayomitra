import React from "react";
import CareCircleMock from "../components/CareCircleMock.js";
export default function Family() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Family</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <CareCircleMock />
      </div>
    </section>
  );
}
