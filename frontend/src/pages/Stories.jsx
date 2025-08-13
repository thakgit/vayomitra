import React, { useState } from "react";
import StoriesSearch from "../components/StoriesSearch.jsx";
import StoryPicker from "../components/StoryPicker.jsx";
import RelatedStories from "../components/RelatedStories.jsx"; // if you have it

export default function Stories() {
  const [pickedFromSearch, setPickedFromSearch] = useState("");

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Stories</h1>

      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        {/* When user opens a search result, we set StoryPicker to that ID */}
        <StoriesSearch onOpen={(id) => setPickedFromSearch(id)} />
      </div>

      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <StoryPicker initialId={pickedFromSearch} />
      </div>

      {/* Optional related section */}
      <div style={{ background: "#111a2b", border: "1px solid #22304b", borderRadius: 14, padding: 16 }}>
        <RelatedStories currentId={pickedFromSearch} />
      </div>
    </section>
  );
}
