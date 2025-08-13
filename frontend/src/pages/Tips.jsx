import React from "react";
import SpiritualQuote from "../components/SpiritualQuote.jsx";
import TipsMock from "../components/TipsMock.js"; // if this is .jsx, switch extension

export default function Tips() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Tips</h1>

      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <SpiritualQuote />
      </div>

      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <TipsMock />
      </div>
    </section>
  );
}
