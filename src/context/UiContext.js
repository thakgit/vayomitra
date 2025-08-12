import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const UiContext = createContext();

const LS_KEY = "vm_ui_prefs_v1";

export function UiProvider({ children }) {
  const [fontScale, setFontScale] = useState(1.15);
  const [highContrast, setHighContrast] = useState(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const { fontScale: fs, highContrast: hc } = JSON.parse(raw);
        if (typeof fs === "number") setFontScale(fs);
        if (typeof hc === "boolean") setHighContrast(hc);
      }
    } catch {}
  }, []);

  // Apply to document + persist on change
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    document.body.classList.toggle("hc", !!highContrast);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ fontScale, highContrast }));
    } catch {}
  }, [fontScale, highContrast]);

  const value = useMemo(() => ({
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
    increaseFont: () => setFontScale(s => Math.min(2, +(s + 0.1).toFixed(2))),
    decreaseFont: () => setFontScale(s => Math.max(0.9, +(s - 0.1).toFixed(2))),
    resetFont:    () => setFontScale(1.15),
  }), [fontScale, highContrast]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() { return useContext(UiContext); }
