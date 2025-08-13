// src/App.jsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AccessibilityBar from "./components/AccessibilityBar";
import SectionShell from "./components/SectionShell";

import Dashboard from "./components/Dashboard";
import SentimentBox from "./components/SentimentBox.jsx";
import StoryPicker from "./components/StoryPicker.jsx";
import MedicineReminder from "./components/MedicineReminder.jsx";
import VideoGallery from "./components/VideoGallery.jsx";
import CareCircleMock from "./components/CareCircleMock.js";
import TipsMock from "./components/TipsMock.js";
import StoriesSearch from "./components/StoriesSearch.jsx";
import AgentSuggest from "./components/AgentSuggest.jsx";
import Journal from "./components/Journal.jsx";
import RelatedStories from "./components/RelatedStories.jsx";

import { ToastProvider, useToast } from "./components/Toast.jsx";
import { analyzeSentiment, getDailyTip, warmBackend } from "./services/api";
import LeftRail from "./components/LeftRail.jsx";
import HumanGate from "./components/HumanGate.jsx";

// NEW: two-tab page (Home + Stories)
import TabbedHome from "./pages/TabbedHome.jsx";

import "./App.css";

function TipOfDay() {
  const [tip, setTip] = useState("");
  useEffect(() => {
    getDailyTip()
      .then((d) => setTip(d?.tip || "Have a peaceful day."))
      .catch(() => setTip("Have a peaceful day."));
  }, []);
  return (
    <div className="vm-tip">
      <strong>🌞 Tip:</strong> {tip}
    </div>
  );
}

function AppInner() {
  const [pickedFromSearch, setPickedFromSearch] = useState("");
  const [lastMoodText, setLastMoodText] = useState("");
  const [currentStory, setCurrentStory] = useState(null);
  const toast = useToast();

  // warm backend once
  useEffect(() => {
    warmBackend();
  }, []);

  const [verified, setVerified] = useState(
    localStorage.getItem("vm-verified") === "1"
  );

  const handleAnalyze = async (text) => {
    setLastMoodText(text);
    try {
      const data = await analyzeSentiment(text);
      toast.push(`Mood: ${data.label} (${Number(data.compound).toFixed(2)})`);
    } catch {
      toast.push("Could not analyze mood right now.", "error");
    }
  };

  return (
    <div className="vm-app">
      {!verified && <HumanGate onVerified={() => setVerified(true)} />}
      <Header />
      <AccessibilityBar />

      <main className="vm-main">
        {/* two-column layout with LeftRail on the left */}
        <div className="vm-grid">
          <aside>
            <LeftRail />
          </aside>

          <div>
            {/* ⬇️ REPLACED: Home + Stories combined into a single tabbed section */}
            <SectionShell
              id="home-stories"
              title="Home & Stories"
              subtitle="Quick access to overview and stories"
            >
              <TabbedHome
                TipSlot={<TipOfDay />}
                mood={lastMoodText}
                onOpen={(id) => setPickedFromSearch(id)}
                pickedFromSearch={pickedFromSearch}
                onStoryChange={(s) => setCurrentStory(s)}
                currentStory={currentStory}
              />
            </SectionShell>

            {/* Sentiment stays the same */}
            <SectionShell
              id="sentiment"
              title="Mood Check-in"
              subtitle="Write a few words and analyze your mood"
            >
              <SentimentBox onAnalyze={handleAnalyze} />
            </SectionShell>

            {/* Tips */}
            <SectionShell
              id="tips"
              title="Daily Tips"
              subtitle="Sample tips UI (now calls backend)"
            >
              <TipsMock />
            </SectionShell>

            {/* Audio */}
            <SectionShell
              id="audio"
              title="Audio Gallery"
              subtitle="Featured videos & guided sessions"
            >
              <VideoGallery />
            </SectionShell>

            {/* Journal */}
            <SectionShell
              id="journal"
              title="Journal"
              subtitle="Write privately and get a brief summary"
            >
              <Journal />
            </SectionShell>

            {/* Care Circle */}
            <SectionShell
              id="care"
              title="Care Circle"
              subtitle="Invite family to contribute"
            >
              <CareCircleMock />
            </SectionShell>

            {/* Medicine Reminders */}
            <SectionShell
              id="settings"
              title="Medicine Reminders"
              subtitle="Create quick reminders"
            >
              <MedicineReminder />
            </SectionShell>

            {/* About */}
            <SectionShell
              id="about"
              title="About VayoMitra"
              subtitle="Compassion + Calm + Connection"
            >
              <p>
                VayoMitra is a privacy-first companion. Nothing here is medical
                advice—just supportive guidance and peaceful content.
              </p>
            </SectionShell>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
