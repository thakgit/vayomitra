// src/setupBackendWakeHint.js
import { setWakeVisible } from "./utils/backendWakeBus";

// Only patch once.
if (!window.__wakePatchedFetch) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    // Only show hint for network requests that likely hit your API.
    // Adjust this test if needed.
    const url = String(args[0] || "");
    const isApiCall =
      url.startsWith("/api/") ||            // Netlify proxy style
      url.startsWith("http://") ||          // absolute (dev)
      url.startsWith("https://");           // absolute (prod)

    let timer;
    if (isApiCall) {
      timer = setTimeout(() => setWakeVisible(true), 3000); // show after 3s
    }

    try {
      return await originalFetch(...args);
    } finally {
      if (timer) clearTimeout(timer);
      setWakeVisible(false); // hide once the request finishes (ok or error)
    }
  };

  window.__wakePatchedFetch = true;
}
