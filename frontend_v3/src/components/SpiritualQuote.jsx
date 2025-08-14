import React, { useEffect, useMemo, useState } from "react";

/**
 * QUOTES can be either strings or objects:
 * - "Be here now."
 * - { text: "Be here now.", author: "Ram Dass", avatar: "/images/ramdass.jpg" }
 */
const QUOTES = [
  { text: "Peace comes from within.", author: "Buddha" },
  "This too shall pass.",
  "Be here now.",
  "Let your heart guide you.",
  "Inhale peace, exhale worry.",
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Wherever you are, be all there.", author: "Jim Elliot" },
  "Gratitude turns what we have into enough.",
];

function dayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function pickIndexForToday(len) {
  const key = dayKey();
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % len;
}

export default function SpiritualQuote() {
  const [idx, setIdx] = useState(0);

  // normalize to { text, author?, avatar? }
  const current = useMemo(() => {
    const raw = QUOTES[idx] || "";
    return typeof raw === "string" ? { text: raw } : raw;
  }, [idx]);

  // initialize from override (if any) or from daily pick
  useEffect(() => {
    const today = dayKey();
    let o = null;
    try {
      o = JSON.parse(localStorage.getItem("vm-quote-override") || "null");
    } catch {}
    if (o?.date === today && Number.isInteger(o.idx) && QUOTES[o.idx]) {
      setIdx(o.idx);
    } else {
      setIdx(pickIndexForToday(QUOTES.length));
    }
  }, []);

  // shuffle (persist for the rest of the day); Shift+click resets to daily
  const shuffle = (e) => {
    const today = dayKey();
    if (e?.shiftKey) {
      const daily = pickIndexForToday(QUOTES.length);
      setIdx(daily);
      localStorage.removeItem("vm-quote-override");
      return;
    }
    const next = (idx + 1) % QUOTES.length;
    setIdx(next);
    localStorage.setItem(
      "vm-quote-override",
      JSON.stringify({ date: today, idx: next })
    );
  };

  return (
    <figure className="vm-quote-card" aria-labelledby="vm-quote-title">
      <div className="vm-quote-header">
        <span className="vm-quote-icon" aria-hidden>
          🕯️
        </span>
        <figcaption id="vm-quote-title" className="vm-quote-title">
          Spiritual Quote
        </figcaption>

        <button
          className="vm-quote-refresh"
          aria-label="Shuffle quote (Shift+click to reset today's pick)"
          title="Shuffle (Shift+click to reset)"
          onClick={shuffle}
        >
          ↻
        </button>
      </div>

      <blockquote key={idx} className="vm-quote-text vm-quote-fade">
        <span className="vm-quote-mark">“</span>
        {current.text}
        <span className="vm-quote-mark">”</span>
      </blockquote>

      {/* Optional author / avatar line */}
      {(current.author || current.avatar) && (
        <div className="vm-quote-author">
          {current.avatar ? (
            <img
              src={current.avatar}
              alt={current.author ? current.author : "Author"}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : null}
          <span>{current.author}</span>
        </div>
      )}

      <div className="vm-quote-hint">
        Click ↻ for a new one • Shift+Click to reset
      </div>
    </figure>
  );
}
