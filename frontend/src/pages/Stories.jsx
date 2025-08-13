import React, { useState } from "react";
import StoriesSearch from "../components/StoriesSearch.jsx";
import StoryPicker from "../components/StoryPicker.jsx";
import RelatedStories from "../components/RelatedStories.jsx";

export default function Stories() {
  const [pickedFromSearch, setPickedFromSearch] = useState("");

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Stories</h1>
      <StoriesSearch onOpen={(id) => setPickedFromSearch(id)} />
      <StoryPicker initialId={pickedFromSearch} />
      <RelatedStories currentId={pickedFromSearch} />
    </section>
  );
}
