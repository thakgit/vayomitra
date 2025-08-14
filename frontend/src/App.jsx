// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
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
import BackendWakeHint from "./components/BackendWakeHint";

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
  const toast = useToast();

  // app state used across panels
  const [verified, setVerified] = useState(localStorage.getItem("vm-verified") === "1");
  const [pickedFromSearch, setPickedFromSearch] = useState("");
  const [lastMoodText, setLastMoodText] = useState("");
  const [currentStory, setCurrentStory] = useState(null);

  const family = [
    { id: "neha",  name: "Neha",  msg: "Miss you, Maa!",         emoji: "💛", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256" },
    { id: "solura", name: "Solura", msg: "Dinner this Sunday?",    emoji: "🍛", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" },
    { id: "aarav", name: "Aarav", msg: "Nani, story time soon!", emoji: "📚", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=256" },
  ];

  // ACTIVE TOP TAB (controlled by Header.js via window event)
  const [activeTopTab, setActiveTopTab] = useState("home");

  useEffect(() => { warmBackend(); }, []);

  // listen to header tab switches (no scroll)
  useEffect(() => {
    const handler = (e) => {
      const key = String(e.detail || "");
      setActiveTopTab(
        ["home","stories","reminders","videos","tips","journal","family","settings"]
          .includes(key) ? key : "home"
      );
    };
    window.addEventListener("vm:switchTab", handler);
    return () => window.removeEventListener("vm:switchTab", handler);
  }, []);

  const handleAnalyze = async (text) => {
    setLastMoodText(text);
    try {
      const data = await analyzeSentiment(text);
      toast.push(`Mood: ${data.label} (${Number(data.compound).toFixed(2)})`);
    } catch {
      toast.push("Could not analyze mood right now.", "error");
    }
  };

  // -------- PANELS (each wrapped in SectionShell for consistent look) --------
  const HomePanel = useMemo(() => (
    <SectionShell title="Home" subtitle="Your calm daily companion">
      <Dashboard />
      <TipOfDay />
      <AgentSuggest mood={lastMoodText} onOpen={(id) => setPickedFromSearch(id)} />
      {/* Keep Mood Check on Home if you like; or remove from here */}
      <div style={{ marginTop: 12 }}>
        <SentimentBox onAnalyze={handleAnalyze} />
      </div>
    </SectionShell>
  ), [lastMoodText]);

  const StoriesPanel = useMemo(() => (
    <SectionShell title="Stories" subtitle="Search, pick, and listen">
      <StoriesSearch onOpen={(id) => setPickedFromSearch(id)} />
      <StoryPicker
        externalSelectedId={pickedFromSearch}
        onStoryChange={(s) => setCurrentStory(s)}
      />
      <RelatedStories story={currentStory} onOpen={(id) => setPickedFromSearch(id)} />
    </SectionShell>
  ), [pickedFromSearch, currentStory]);

  const RemindersPanel = useMemo(() => (
    <SectionShell title="Medicine Reminders" subtitle="Create quick reminders">
      <MedicineReminder />
    </SectionShell>
  ), []);

  const VideosPanel = useMemo(() => (
    <SectionShell title="Videos" subtitle="Featured videos & guided sessions">
      <VideoGallery />
    </SectionShell>
  ), []);

  const TipsPanel = useMemo(() => (
    <SectionShell title="Daily Tips" subtitle="Here’s something small but helpful for your day.">
      <TipsMock />
    </SectionShell>
  ), []);

  const JournalPanel = useMemo(() => (
    <SectionShell title="Journal" subtitle="Write privately and get a brief summary">
      <Journal />
    </SectionShell>
  ), []);

  const FamilyPanel = useMemo(() => (
    <SectionShell title="Family" subtitle="Invite family to contribute">
      <CareCircleMock />
    </SectionShell>
  ), []);

  const SettingsPanel = useMemo(() => (
    <SectionShell title="Settings" subtitle="Compassion + Calm + Connection">
      <p>
        VayoMitra is a privacy-first companion. Nothing here is medical advice—just
        supportive guidance and peaceful content.
      </p>
    </SectionShell>
  ), []);

  // choose which panel to show
  const activePanel = (
    activeTopTab === "home"      ? HomePanel      :
    activeTopTab === "stories"   ? StoriesPanel   :
    activeTopTab === "reminders" ? RemindersPanel :
    activeTopTab === "videos"    ? VideosPanel    :
    activeTopTab === "tips"      ? TipsPanel      :
    activeTopTab === "journal"   ? JournalPanel   :
    activeTopTab === "family"    ? FamilyPanel    :
    SettingsPanel
  );

  return (
    <div className="vm-app">
      {!verified && <HumanGate onVerified={() => setVerified(true)} />}
      <Header />
      <AccessibilityBar />

      <main className="vm-main">
        <div className="vm-grid">
          <aside><LeftRail /></aside>
          <div>{activePanel}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BackendWakeHint />
      <AppInner />
    </ToastProvider>
  );
}
