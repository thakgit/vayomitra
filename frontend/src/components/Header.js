import React, { useEffect, useState } from "react";
import vmElder from "../assets/vm-elder.png"; // <-- put the image here

export default function Header() {
  const [active, setActive] = useState("home");

  // keep pills in sync if switched elsewhere
  useEffect(() => {
    const handler = (e) => setActive(e.detail);
    window.addEventListener("vm:switchTab", handler);
    return () => window.removeEventListener("vm:switchTab", handler);
  }, []);

  const switchTab = (tab) => {
    setActive(tab);
    window.dispatchEvent(new CustomEvent("vm:switchTab", { detail: tab }));
  };

  const pills = [
    { key: "home",      label: "🏠 Home" },
    { key: "stories",   label: "📚 Stories" },
    { key: "reminders", label: "⏰ Reminders" },
    { key: "videos",    label: "🎬 Videos" },
    { key: "tips",      label: "🌞 Tips" },
    { key: "journal",   label: "📝 Journal" },
    { key: "family",    label: "👨‍👩‍👧 Family" },
    { key: "settings",  label: "⚙️ Settings" },
  ];

  return (
    <header className="vm-header">
      {/* Brand row */}
      <div className="vm-hero">
        <h1 className="vm-brand">
          {/* Logo image */}
          <span className="vm-logo">
            <img
              src={vmElder}
              alt="VayoMitra"
              className="vm-logo-img"
              width={56}
              height={56}
            />
          </span>

          {/* One word: VayoMitra (no space between spans) */}
          <span className="vm-vayo">Vayo</span><span className="vm-mitra">Mitra</span>
          <span className="vm-dash"> — </span>
          <span className="muted">a gentle companion</span>
        </h1>

        <p className="vm-hero__sub">
          Stories, reminders, and warm conversations — in Gujarati, Hindi, and English.
        </p>
      </div>

      {/* Pill bar (primary nav) */}
      <nav className="vm-tabs" aria-label="Primary">
        {pills.map((p) => (
          <a
            key={p.key}
            className={`pill ${active === p.key ? "pill--active" : ""}`}
            href="#"
            onClick={(e) => { e.preventDefault(); switchTab(p.key); }}
          >
            {p.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
