import React from "react";
import LeftRail from "../components/LeftRail.jsx";
import SentimentBox from "../components/SentimentBox.jsx";
import AgentSuggest from "../components/AgentSuggest.jsx";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <aside className="hidden lg:block">
        <LeftRail />
      </aside>
      <section className="grid gap-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <SentimentBox />
        <AgentSuggest />
      </section>
    </div>
  );
}
