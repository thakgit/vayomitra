import React from "react";
import SentimentBox from "../components/SentimentBox.jsx";
import AgentSuggest from "../components/AgentSuggest.jsx";
export default function Home() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Home</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <SentimentBox />
      </div>
    </section>
  );
}
