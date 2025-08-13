import React, { useEffect, useState } from "react";

// Keep your favorite first so it appears regularly
const QUOTES = [
  "Peace comes from within.",
  "This too shall pass.",
  "Be here now.",
  "Let your heart guide you.",
  "Inhale peace, exhale worry.",
  "The quieter you become, the more you can hear.",
  "Wherever you are, be all there.",
  "Gratitude turns what we have into enough.",
];

function dayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// Deterministic daily index (no network, no hard cache)
function pickIndexForToday(len) {
  const key = dayKey();
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % len;
}

export default function SpiritualQuote() {
  const [idx, setIdx] = useState(0);

  // initialize from override (if any) or from daily pick
  useEffect(() => {
    const today = dayKey();
    let o = null;
    try { o = JSON.parse(localStorage.getItem("vm-quote-override") || "null"); } catch {}
    if (o?.date === today && Number.isInteger(o.idx) && QUOTES[o.idx]) {
      setIdx(o.idx);
    } else {
      setIdx(pickIndexForToday(QUOTES.length));
    }
  }, []);

  // Shuffle to next quote (persists for the rest of the day)
  const shuffle = (e) => {
    const today = dayKey();
    if (e?.shiftKey) {
      // reset to daily pick
      const daily = pickIndexForToday(QUOTES.length);
      setIdx(daily);
      localStorage.removeItem("vm-quote-override");
      return;
    }
    const next = (idx + 1) % QUOTES.length;
    setIdx(next);
    localStorage.setItem("vm-quote-override", JSON.stringify({ date: today, idx: next }));
  };

  return (
    <div className="vm-rail__quote" style={{ position: "relative" }}>
      <div className="vm-rail__quote-label">🕯️ Spiritual Quote</div>
      <div className="vm-rail__quote-text">{QUOTES[idx]}</div>

      {/* tiny shuffle button (click to cycle, Shift+click to reset to daily) */}
      <button
        className="vm-quote-shuffle"
        aria-label="Shuffle quote (Shift+click to reset)"
        title="Shuffle (Shift+click to reset to daily)"
        onClick={shuffle}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: 12,
          padding: "2px 8px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,.15)",
          background: "rgba(255,255,255,.06)",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        ↻
      </button>
    </div>
  );
}
