// src/components/HumanGate.jsx
/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";

// CRA-safe env var name (Netlify injects at build time)
const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY;

function loadTurnstile(onload) {
  if (typeof document === "undefined") return;
  const id = "cf-turnstile";
  if (document.getElementById(id)) { onload?.(); return; }
  const s = document.createElement("script");
  s.id = id;
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  s.async = true;
  s.defer = true;
  s.onload = () => onload?.();
  document.head.appendChild(s);
}

export default function HumanGate({ onVerified }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const mountRef = useRef(null);
  const tokenRef = useRef(null);
  const renderedRef = useRef(false);

  // Show the modal once if not verified previously
  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("vm-verified") === "1";
    if (!seen) setOpen(true);
  }, []);

  // Render Turnstile widget
  useEffect(() => {
    if (!open || !SITE_KEY) return;
    loadTurnstile(() => {
      const timer = setInterval(() => {
        if (window.turnstile && mountRef.current && !renderedRef.current) {
          renderedRef.current = true;
          window.turnstile.render(mountRef.current, {
            sitekey: SITE_KEY,
            theme: "auto",
            callback: (t) => { tokenRef.current = t; },
            "expired-callback": () => { tokenRef.current = null; },
            "error-callback": () => { tokenRef.current = null; },
          });
          clearInterval(timer);
        }
      }, 150);
      setTimeout(() => clearInterval(timer), 10000);
    });
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return alert("Please enter your email.");
    if (!tokenRef.current) return alert("Please complete the verification.");
    try {
      setBusy(true);
      // NOTE: you mapped this path in netlify.toml to your function
      const res = await fetch("/api/auth/turnstile-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // so the Set-Cookie is stored
        body: JSON.stringify({
          email: email.trim(),
          cf_token: tokenRef.current,
        }),
      });
      if (!res.ok) throw new Error(`Verify failed (${res.status})`);
      localStorage.setItem("vm-verified", "1");
      setOpen(false);
      onVerified?.();
    } catch (err) {
      console.error(err);
      alert("Could not verify right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open || !SITE_KEY) return null;

  return (
    <div className="vm-modal__backdrop">
      <div className="vm-modal" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
        <div className="vm-modal__header">
          <h3>Welcome</h3>
        </div>
        <form className="vm-modal__body" onSubmit={submit}>
          <p style={{marginTop:0}}>Please verify you’re human to continue.</p>
          <label className="vm-field">
            <span>Email (one-time verification)</span>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
          </label>
          {/* Turnstile widget mounts here */}
          <div ref={mountRef} style={{ marginTop: 8 }} />
          <div className="vm-modal__actions">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? "Verifying…" : "Verify & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
