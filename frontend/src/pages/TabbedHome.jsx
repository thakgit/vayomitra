import React from "react";
import Tabs from "../components/Tabs.jsx";

import Dashboard from "../components/Dashboard.jsx";
import AgentSuggest from "../components/AgentSuggest.jsx";
import StoriesSearch from "../components/StoriesSearch.jsx";
import StoryPicker from "../components/StoryPicker.jsx";
import RelatedStories from "../components/RelatedStories.jsx";

/**
 * Props expected from AppInner:
 * - TipSlot: React element to render TipOfDay (so we don't relocate that component)
 * - mood: string (from lastMoodText)
 * - onOpen: fn(id) to open a story from search (sets pickedFromSearch)
 * - pickedFromSearch: string | null
 * - onStoryChange: fn(story) to update currentStory
 * - currentStory: object | null
 */
export default function TabbedHome({
  TipSlot = null,
  mood = "",
  onOpen,
  pickedFromSearch,
  onStoryChange,
  currentStory
}) {
  const HomeTab = (
    <div style={{ display: "grid", gap: 12 }}>
      <Dashboard />
      {TipSlot}
      <AgentSuggest mood={mood} onOpen={onOpen} />
    </div>
  );

  const StoriesTab = (
    <div style={{ display: "grid", gap: 16 }}>
      <StoriesSearch onOpen={onOpen} />
      <StoryPicker
        externalSelectedId={pickedFromSearch}
        onStoryChange={onStoryChange}
      />
      <RelatedStories story={currentStory} onOpen={onOpen} />
    </div>
  );

  const items = [
    { id: "home",    label: "Home",    content: HomeTab },
    { id: "stories", label: "Stories", content: StoriesTab },
  ];

  return <Tabs items={items} initialId="home" />;
}
