import React from "react";
import StoriesSearch from "../components/StoriesSearch.jsx";
import StoryPicker from "../components/StoryPicker.jsx";
export default function Stories() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Stories</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <StoriesSearch />
      </div>
    </section>
  );
}
