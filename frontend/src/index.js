// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UiProvider } from "./context/UiContext";
import "./index.css";
import "./setupBackendWakeHint";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);
// Ensure all /api requests include the ngrok bypass header.
// Same-origin => no CORS preflight.
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const origFetch = window.fetch;
  window.fetch = (input, init = {}) => {
    // Resolve URL string
    const url = typeof input === "string" ? input : input?.url;

    // Only touch our API calls
    const isApi =
      typeof url === "string" &&
      (url.startsWith("/api") ||
       url.startsWith(window.location.origin + "/api"));

    if (!isApi) return origFetch(input, init);

    // Merge headers
    const headers = new Headers(init.headers || {});
    headers.set("ngrok-skip-browser-warning", "true");

    // If input is a Request, clone with new headers
    if (input instanceof Request) {
      const req = new Request(input, { headers });
      return origFetch(req);
    }

    return origFetch(url, { ...init, headers });
  };
}

root.render(
  <React.StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </React.StrictMode>
);
