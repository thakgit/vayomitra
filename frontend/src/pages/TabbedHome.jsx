import React, { useEffect, useState, useMemo } from "react";

import Dashboard from "../components/Dashboard.jsx";
import AgentSuggest from "../components/AgentSuggest.jsx";
import StoriesSearch from "../components/StoriesSearch.jsx";
import StoryPicker from "../components/StoryPicker.jsx";
import RelatedStories from "../components/RelatedStories.jsx";

/**
 * Renders only content. Active panel is controlled by Header via "vm:switchTab".
 * Props: TipSlot, mood, onOpen, pickedFromSearch, onStoryChange, currentStory
 */
export default function TabbedHome({
  TipSlot = null,
  mood = "",
  onOpen,
  pickedFromSearch,
  onStoryChange,
  currentStory,
}) {
  const [tab, setTab] = useState("home");

  // Listen for header pill clicks
  useEffect(() => {
    const handler = (e) => setTab(String(e.detail) === "stories" ? "stories" : "home");
    window.addEventListener("vm:switchTab", handler);
    return () => window.removeEventListener("vm:switchTab", handler);
  }, []);

  const HomePanel = useMemo(() => (
    <div style={{ display: "grid", gap: 12 }}>
      <Dashboard />
      {TipSlot}
      <AgentSuggest mood={mood} onOpen={onOpen} />
    </div>
  ), [TipSlot, mood, onOpen]);

  const StoriesPanel = useMemo(() => (
    <div style={{ display: "grid", gap: 16 }}>
      <StoriesSearch onOpen={onOpen} />
      <StoryPicker
        externalSelectedId={pickedFromSearch}
        onStoryChange={onStoryChange}
      />
      <RelatedStories story={currentStory} onOpen={onOpen} />
    </div>
  ), [onOpen, pickedFromSearch, onStoryChange, currentStory]);

  return tab === "stories" ? StoriesPanel : HomePanel;
}
