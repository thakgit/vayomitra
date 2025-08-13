import React from "react";

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
  return (
    <header className="vm-header">
      {/* Top brand strip (sticky) */}
      <div className="vm-nav">
        <div className="vm-nav__brand">Vayo<span>Mitra</span></div>
        <nav className="vm-nav__links">
          <a href="#home">Home</a>
          <a href="#stories">Stories</a>
          <a href="#settings">Reminders</a>
          <a href="#audio">Videos</a>
          <a href="#tips">Tips</a>
          <a href="#journal">Journal</a>
          <a href="#care">Family</a>
          <a href="#about">Settings</a>
        </nav>
      </div>

      {/* Hero title + subtitle (only change is the small icon before the title) */}
      <div className="vm-hero">
        <h1>
          <VayoMark />
          VayoMitra — <span className="muted">a gentle companion</span>
        </h1>
        <p className="vm-hero__sub">
          Stories, reminders, and warm conversations — in Gujarati, Hindi, and English.
        </p>
      </div>

      {/* Tab pills */}
      <div className="vm-tabs">
        <a className="pill pill--active" href="#home">🏠 Home</a>
        <a className="pill" href="#stories">📚 Stories</a>
        <a className="pill" href="#settings">⏰ Reminders</a>
        <a className="pill" href="#audio">🎬 Videos</a>
        <a className="pill" href="#tips">🌞 Tips</a>
        <a className="pill" href="#journal">📝 Journal</a>
        <a className="pill" href="#care">👨‍👩‍👧 Family</a>
        <a className="pill" href="#about">⚙️ Settings</a>
      </div>
    </header>
  );
}
