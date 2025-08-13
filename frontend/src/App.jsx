import React from "react";
import { Routes, Route } from "react-router-dom";
import TopNav from "./components/TopNav";

import Home from "./pages/Home";
import Stories from "./pages/Stories";
import Reminders from "./pages/Reminders";
import Videos from "./pages/Videos";
import Tips from "./pages/Tips";
import Journal from "./pages/Journal";
import Family from "./pages/Family";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 10px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>VayoMitra — a gentle companion</div>
        <TopNav />
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 16px 32px", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/family" element={<Family />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
