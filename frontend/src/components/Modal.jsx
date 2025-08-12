import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
      display: "grid", placeItems: "center", zIndex: 1000
    }}>
      <div style={{
        width: "min(760px, 92vw)",
        background: "#0b1220",
        color: "#e5e7eb",
        border: "1px solid #1f2937",
        borderRadius: 14,
        boxShadow: "0 10px 40px rgba(0,0,0,.45)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 14px", borderBottom: "1px solid #1f2937" }}>
          <strong>{title}</strong>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div style={{ padding: 14 }}>{children}</div>
      </div>
    </div>
  );
}
