import React from "react";
// If you expose preferences via context/hooks, you can add controls here.

export default function Settings() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Settings</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <p>Adjust font size, contrast, language, etc.</p>
      </div>
    </section>
  );
}
