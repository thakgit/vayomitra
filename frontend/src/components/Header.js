import React, { useEffect, useState } from "react";

/* tiny hugging mark (inline SVG, behaves like an emoji) */
function VayoMark({ size = 28 }) {
  return (
    <span className="vm-logo" aria-hidden>
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vm_g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8ab6ff"/><stop offset="1" stopColor="#b099ff"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#vm_g)" opacity="0.22"/>
        <circle cx="32" cy="32" r="22" fill="none" stroke="#8ab6ff" strokeWidth="2" opacity="0.55"/>
        <path d="M24 36c2 3 6 5 8 5s6-2 8-5" fill="none" stroke="#e6f0ff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="26" cy="28" r="2.2" fill="#e6f0ff"/><circle cx="38" cy="28" r="2.2" fill="#e6f0ff"/>
      </svg>
    </span>
  );
}

export default function Header() {
  const [active, setActive] = useState("home");

  // stay in sync if some other code switches the tab
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
      {/* Top brand strip */}
      <div className="vm-nav">
        <div className="vm-nav__brand">Vayo<span>Mitra</span></div>
        <nav className="vm-nav__links">
          {/* top text links mirror the pills, no scroll */}
          {pills.map((p) => (
            <a
              key={p.key}
              href="#"
              onClick={(e) => { e.preventDefault(); switchTab(p.key); }}
            >
              {p.label.replace(/^[^\s]+\s/, "") /* label without emoji */}
            </a>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <div className="vm-hero">
        <h1>
          <VayoMark /> VayoMitra — <span className="muted">a gentle companion</span>
        </h1>
        <p className="vm-hero__sub">
          Stories, reminders, and warm conversations — in Gujarati, Hindi, and English.
        </p>
      </div>

      {/* Pill bar (real tabs for the whole page) */}
      <div className="vm-tabs">
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
      </div>
    </header>
  );
}
