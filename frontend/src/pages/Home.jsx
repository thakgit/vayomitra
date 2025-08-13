import React from "react";
import LeftRail from "../components/LeftRail.jsx";
import SentimentBox from "../components/SentimentBox.jsx";
import AgentSuggest from "../components/AgentSuggest.jsx";
// If you have a small Dashboard/Now card, import it; else keep the two cards below.

export default function Home() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
      <aside>
        <LeftRail />
      </aside>

      <section style={{ display: "grid", gap: 14 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Welcome</h1>

        <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
          <SentimentBox />
        </div>

        <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
          <AgentSuggest />
        </div>
      </section>
    </div>
  );
}
