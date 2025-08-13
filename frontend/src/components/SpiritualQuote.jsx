// src/components/SpiritualQuote.jsx
import React, { useEffect, useState } from "react";

const QUOTES = [
  "Peace comes from within.",
  "This too shall pass.",
  "Be here now.",
  "Let your heart guide you.",
  "Inhale peace, exhale worry.",
  "The quieter you become, the more you can hear.",
  "Wherever you are, be all there.",
  "Gratitude turns what we have into enough."
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

export default function SpiritualQuote() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const key = todayKey();
    const saved = localStorage.getItem("vm-quote");
    let obj;
    try { obj = saved ? JSON.parse(saved) : null; } catch { obj = null; }

    if (obj?.date === key && QUOTES[obj.idx]) {
      setQuote(QUOTES[obj.idx]);
      return;
    }

    // pick a new one for today
    const idx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[idx]);
    localStorage.setItem("vm-quote", JSON.stringify({ date: key, idx }));
  }, []);

  return (
    <div className="vm-rail__quote">
      <div className="vm-rail__quote-label">🕯️ Spiritual Quote</div>
      <div className="vm-rail__quote-text">{quote}</div>
    </div>
  );
}
