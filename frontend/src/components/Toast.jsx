import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "info", ms = 2600) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div style={{
        position: "fixed", right: 12, bottom: 12, display: "grid", gap: 8, zIndex: 1000
      }}>
        {toasts.map(t => (
          <div key={t.id}
               style={{
                 background: t.type === "error" ? "#7f1d1d" : "#0f172a",
                 color: "#e5e7eb",
                 border: `1px solid ${t.type === "error" ? "#dc2626" : "#334155"}`,
                 borderRadius: 10, padding: "10px 12px", minWidth: 220, boxShadow: "0 8px 30px rgba(0,0,0,.35)"
               }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  return useContext(ToastCtx);
}
