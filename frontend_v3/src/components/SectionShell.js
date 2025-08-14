import React from "react";

export default function SectionShell({ id, title, subtitle, children }) {
  return (
    <section id={id} className="vm-section">
      <h2 className="vm-section__title">{title}</h2>
      {subtitle && <p className="vm-section__subtitle">{subtitle}</p>}
      <div className="vm-card">{children}</div>
    </section>
  );
}
