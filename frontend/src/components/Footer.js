import React from "react";

export default function Footer() {
  return (
    <footer className="vm-footer">
      <div>© {new Date().getFullYear()} VayoMitra</div>
      <div className="vm-footer__links">
        <a href="#about">About</a>
        <a href="#settings">Settings</a>
        <a href="#care">Care Circle</a>
      </div>
    </footer>
  );
}
