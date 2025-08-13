import React, { useEffect } from "react";
import "./App.css";
import { UiProvider, useUi } from "./context/UiContext";
import Header from "./components/Header";
import AccessibilityBar from "./components/AccessibilityBar";
import SectionShell from "./components/SectionShell";
import StoriesMock from "./components/StoriesMock";
import SentimentMock from "./components/SentimentMock";
import TipsMock from "./components/TipsMock";
import AudioMock from "./components/AudioMock";
import CareCircleMock from "./components/CareCircleMock";
import Footer from "./components/Footer";
import Dashboard from './components/Dashboard';
import MedicineReminder from './components/MedicineReminder';
import StoryPicker from './components/StoryPicker';
import VideoGallery from './components/VideoGallery';

function useSmoothScroll() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

function AppShell() {
  useSmoothScroll();
  const { fontScale, highContrast } = useUi();

  return (
    
    <div className={`vm-app ${highContrast ? "hc" : ""}`} style={{ "--font-scale": fontScale }}>
      <Header />
      <AccessibilityBar />

      <SectionShell id="stories" title="Katha Sathi — Stories" subtitle="Pick a language and story; read or listen.">
        <StoriesMock />
      </SectionShell>

      <SectionShell id="sentiment" title="Mood & Reflection" subtitle="Write a thought and see a simple mood score.">
        <SentimentMock />
      </SectionShell>

      <SectionShell id="tips" title="Daily Tips" subtitle="A small dose of comfort, mindfulness, and optimism.">
        <TipsMock />
      </SectionShell>

      <SectionShell id="audio" title="Audio Library" subtitle="Auto-generated audio for your stories.">
        <AudioMock />
      </SectionShell>

      <SectionShell id="care" title="Care Circle" subtitle="Invite family to contribute love and presence.">
        <CareCircleMock />
      </SectionShell>
      
      <SectionShell id="dashboard" title="Dashboard" subtitle="Dashboard!.">

        </SectionShell>

      <SectionShell id="medicine" title="MedicineReminder" subtitle="Medicine Reminder">
      </SectionShell>

      <SectionShell id="VideoGallery" title="VideoGallery" subtitle="VideoGallery Reminder">
      </SectionShell>

       <SectionShell id="StoryPicker" title="StoryPicker" subtitle="StoryPicker Reminder">
      </SectionShell>

   
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <UiProvider>
      <AppShell />
    </UiProvider>
  );
}
