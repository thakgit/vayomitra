// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { UiProvider } from "./context/UiContext";
import "./index.css";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </React.StrictMode>
);
