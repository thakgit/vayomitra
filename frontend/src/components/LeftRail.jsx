import { useEffect, useState } from "react";
import { getDailyTip } from "../services/api";

/** Tiny “hugging” logo (inline SVG, no asset file needed) */
function VayoMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vm_g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8ab6ff"/><stop offset="1" stopColor="#b099ff"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#vm_g)" opacity="0.25"/>
      <circle cx="32" cy="32" r="22" fill="none" stroke="#8ab6ff" strokeWidth="2" opacity="0.55"/>
      {/* hug curve + eyes */}
      <path d="M24 36c2 3 6 5 8 5s6-2 8-5" fill="none" stroke="#e6f0ff" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="26" cy="28" r="2.5" fill="#e6f0ff"/><circle cx="38" cy="28" r="2.5" fill="#e6f0ff"/>
    </svg>
  );
}

export default function LeftRail() {
  const [quote, setQuote] = useState("Peace comes from within.");

  useEffect(() => {
    (async () => {
      try {
        const data = await getDailyTip("quote"); // your API already supports tip/quote
        setQuote(data?.quote || data?.tip || "Peace comes from within.");
      } catch {
        /* leave default on failure */
      }
    })();
  }, []);

  // Static demo messages for now; easy to wire to an endpoint later.
  const family = [
    { id: "neha",  name: "Neha",  msg: "Miss you, Maa!",        emoji: "💛", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256" },
    { id: "rahul", name: "Rahul", msg: "Dinner this Sunday?",   emoji: "🍛", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" },
    { id: "aarav", name: "Aarav", msg: "Nani, story time soon!",emoji: "📚", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=256" },
  ];

  return (
    <aside className="vm-rail">
      {/* 1) Logo + co-creation credit */}
      <div className="vm-rail__brand">
        <VayoMark />
        <div className="vm-rail__brand-copy">
          <div className="vm-rail__name">VayoMitra</div>
          <div className="vm-rail__caption">a gentle companion</div>
          <div className="vm-rail__credit">Co-created by <strong>Jayesh Thakkar</strong> × <strong>GPT-5&nbsp;Thinking</strong></div>
        </div>
      </div>

      {/* 3) Spiritual quote */}
      <div className="vm-rail__quote">
        <div className="vm-rail__quote-label">🕯️ Spiritual Quote</div>
        <div className="vm-rail__quote-text">{quote}</div>
      </div>

      {/* 2) Family messages */}
      <div className="vm-rail__family">
        {family.map(f => (
          <div key={f.id} className="vm-rail__fam-item">
            <img className="vm-rail__avatar" src={f.img} alt={f.name} />
            <div className="vm-rail__fam-copy">
              <div className="vm-rail__fam-name">{f.name}</div>
              <div className="vm-rail__fam-msg">{f.msg} <span className="vm-rail__emoji">{f.emoji}</span></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
