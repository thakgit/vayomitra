import React from "react";

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

      {/* Hero title + subtitle */}
      <div className="vm-hero">
        <h1>VayoMitra — <span className="muted">a gentle companion</span></h1>
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
