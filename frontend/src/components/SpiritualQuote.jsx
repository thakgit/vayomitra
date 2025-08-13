import React from "react";

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

// Deterministic index for the day (no localStorage)
// e.g., 2025-08-12 -> same index all day, changes tomorrow
function pickIndexForToday(len) {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  // simple hash
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % len;
}

export default function SpiritualQuote() {
  const idx = pickIndexForToday(QUOTES.length);
  const quote = QUOTES[idx];

  return (
    <div className="vm-rail__quote">
      <div className="vm-rail__quote-label">🕯️ Spiritual Quote</div>
      <div className="vm-rail__quote-text">{quote}</div>
    </div>
  );
}
