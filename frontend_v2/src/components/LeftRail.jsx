// src/components/LeftRail.jsx
import React from "react";
import banner from "../assets/vm-banner.png";
import SpiritualQuote from "./SpiritualQuote.jsx";

export default function LeftRail() {
  // Static demo messages (easy to swap to API later)
  const family = [
    { id: "neha",  name: "Neha",  msg: "Miss you, Maa!",         emoji: "💛", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256" },
    { id: "solura", name: "Solura", msg: "Dinner this Sunday?",    emoji: "🍛", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" },
    { id: "aarav", name: "Aarav", msg: "Nani, story time soon!", emoji: "📚", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=256" },
  ];

  return (
    <aside className="vm-rail">
      {/* BRAND BANNER */}
      <div className="vm-rail__banner">
        <img
          src={banner}
          alt="VayoMitra — a gentle companion. AI co-created with Jayesh Thakkar."
          loading="eager"
        />
      </div>

      {/* Spiritual quote (now true quotes, not tips; rotates daily) */}
      <SpiritualQuote />

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
