import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AccessibilityBar from "./components/AccessibilityBar";
import Footer from "./components/Footer";
import TopNav from "./components/TopNav";

import Home from "./pages/Home";
import Stories from "./pages/Stories";
import Reminders from "./pages/Reminders";
import Videos from "./pages/Videos";
import Tips from "./pages/Tips";
import JournalPage from "./pages/Journal";
import Family from "./pages/Family";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div>
      <Header />
      <AccessibilityBar />
      <div className="container">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/family" element={<Family />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
