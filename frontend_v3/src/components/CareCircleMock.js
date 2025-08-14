import React from "react";

export default function CareCircleMock() {
    // Static demo messages (easy to swap to API later)
  const family = [
    { id: "neha",  name: "Neha",  msg: "Miss you, Maa!",         emoji: "💛", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256" },
    { id: "solura", name: "Solura", msg: "Dinner this Sunday?",    emoji: "🍛", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256" },
    { id: "aarav", name: "Aarav", msg: "Nani, story time soon!", emoji: "📚", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=256" },
  ];
  return (
  
    <div className="vm-form">
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
      <p>Invite family to contribute stories and voice notes.</p>
      <div className="vm-form__row">
        <label>Invite by email</label>
        <input type="email" placeholder="name@example.com" />
      </div>
      <div className="vm-actions">
        <button className="btn btn--primary">Send Invite</button>
        <button className="btn btn--ghost">Copy Invite Link</button>
      </div>
    </div>
  );
}
