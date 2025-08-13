// src/components/LeftRail.jsx
import { useEffect, useState } from "react";
import { getDailyTip } from "../services/api";
import banner from "../assets/vm-banner.png"; // << your uploaded image

export default function LeftRail() {
  const [quote, setQuote] = useState("Peace comes from within.");

  useEffect(() => {
    (async () => {
      try {
        const data = await getDailyTip("quote");
        setQuote(data?.quote || data?.tip || "Peace comes from within.");
      } catch {/* keep default */}
    })();
  }, []);

  // Static demo messages (easy to swap to API later)
  const family = [
    { id: "neha",  name: "Neha",  msg: "Miss you, Maa!",        emoji: "💛", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256" },
    { id: "rahul", name: "Rahul", msg: "Dinner this Sunday?",   emoji: "🍛", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" },
    { id: "aarav", name: "Aarav", msg: "Nani, story time soon!",emoji: "📚", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=256" },
  ];

  return (
    <aside className="vm-rail">
      {/* BRAND BANNER (replaces text “VayoMitra — a gentle companion …”) */}
      <div className="vm-rail__banner">
        <img
          src={banner}
          alt="VayoMitra — a gentle companion. AI co-created with Jayesh Thakkar."
          loading="eager"
        />
      </div>

      {/* Spiritual quote */}
      <div className="vm-rail__quote">
        <div className="vm-rail__quote-label">🕯️ Spiritual Quote</div>
        <div className="vm-rail__quote-text">{quote}</div>
      </div>

      {/* Family messages */}
      <div className="vm-rail__family">
        {family.map(f => (
          <div key={f.id} className="vm-rail__fam-item">
            <img className="vm-rail__avatar" src={f.img} alt={f.name} />
            <div className="vm-rail__fam-copy">
              <div className="vm-rail__fam-name">{f.name}</div>
              <div className="vm-rail__fam-msg">
                {f.msg} <span className="vm-rail__emoji">{f.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
