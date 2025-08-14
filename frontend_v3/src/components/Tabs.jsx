import { useState } from "react";

/**
 * items: [{ id, label, content }]
 * Controlled mode: pass activeId + onChange
 * Uncontrolled mode: omit activeId, use initialId once
 */
export default function Tabs({ items = [], initialId, activeId, onChange }) {
  const fallback = initialId || (items[0] && items[0].id);
  const [internal, setInternal] = useState(fallback);
  const current = activeId ?? internal;

  const setActive = (id) => {
    if (onChange) onChange(id);
    else setInternal(id);
  };

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
              background: current === it.id ? "#f2f4f7" : "white",
              fontWeight: current === it.id ? 700 : 500,
              cursor: "pointer",
            }}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
        {items.find((i) => i.id === current)?.content || null}
      </div>
    </div>
  );
}
