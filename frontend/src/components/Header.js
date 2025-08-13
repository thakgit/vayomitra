// src/components/Header.js
import React from "react";

/** Tiny inline “hugging” mark for the brand */
function VayoMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flex: "0 0 auto" }}
    >
      <defs>
        <linearGradient id="vm_g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8ab6ff" />
          <stop offset="1" stopColor="#b099ff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#vm_g)" opacity="0.22" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#8ab6ff" strokeWidth="2" opacity="0.55" />
      {/* hug curve + eyes */}
      <path d="M24 36c2 3 6 5 8 5s6-2 8-5" fill="none" stroke="#e6f0ff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="28" r="2.3" fill="#e6f0ff"/><circle cx="38" cy="28" r="2.3" fill="#e6f0ff"/>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="vm-header">
      <div className="vm-hero">
        <div className="vm-hero__brand">
          <VayoMark />
          <h1 className="vm-hero__title">
            <span className="vm-brand">VayoMitra</span> — a gentle companion
          </h1>
        </div>
        <p className="vm-hero__sub">
          Stories, reminders, and warm conversations — in Gujarati, Hindi, and English.
        </p>
      </div>
    </header>
  );
}
