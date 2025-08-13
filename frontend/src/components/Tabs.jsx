import { useState } from "react";

/** Generic Tabs component: items = [{ id, label, content }] */
export default function Tabs({ items = [], initialId }) {
  const safeInitial = initialId || (items[0] && items[0].id);
  const [active, setActive] = useState(safeInitial);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: active === it.id ? "#f2f4f7" : "white",
              fontWeight: active === it.id ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
        {items.find((i) => i.id === active)?.content || null}
      </div>
    </div>
  );
}
