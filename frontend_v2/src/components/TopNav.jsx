import React from "react";
import { NavLink } from "react-router-dom";

export default function TopNav() {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-xl";
  const inactive = "text-slate-500 hover:text-slate-900";
  const active = "bg-slate-900 text-white";
  const link = ({ isActive }) => [base, isActive ? active : inactive].join(" ");

  return (
    <nav className="flex flex-wrap gap-2 my-3">
      <NavLink to="/" end className={link}>Home</NavLink>
      <NavLink to="/stories" className={link}>Stories</NavLink>
      <NavLink to="/reminders" className={link}>Reminders</NavLink>
      <NavLink to="/videos" className={link}>Videos</NavLink>
      <NavLink to="/tips" className={link}>Tips</NavLink>
      <NavLink to="/journal" className={link}>Journal</NavLink>
      <NavLink to="/family" className={link}>Family</NavLink>
      <NavLink to="/settings" className={link}>Settings</NavLink>
    </nav>
  );
}
