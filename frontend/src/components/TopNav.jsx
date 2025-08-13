import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", end: true },
  { to: "/stories", label: "Stories" },
  { to: "/reminders", label: "Reminders" },
  { to: "/videos", label: "Videos" },
  { to: "/tips", label: "Tips" },
  { to: "/journal", label: "Journal" },
  { to: "/family", label: "Family" },
  { to: "/settings", label: "Settings" },
];

export default function TopNav() {
  return (
    <nav style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          style={({ isActive }) => ({
            padding: "8px 14px",
            borderRadius: 10,
            textDecoration: "none",
            color: isActive ? "#e6ebf5" : "#93a0b4",
            background: isActive ? "#0f1a2d" : "transparent",
            border: "1px solid",
            borderColor: isActive ? "#22304b" : "transparent",
          })}
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
