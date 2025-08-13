import React from "react";
import VideoGallery from "../components/VideoGallery.jsx";
export default function Videos() {
  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Videos</h1>
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <VideoGallery />
      </div>
    </section>
  );
}
