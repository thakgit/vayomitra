import React from "react";
import { useUi } from "../context/UiContext";

export default function AccessibilityBar() {
  const { fontScale, increaseFont, decreaseFont, resetFont, highContrast, setHighContrast } = useUi();

  return (
    <div className="vm-access">
      <div className="vm-access__row">
        <div className="vm-access__group">
          <button className="btn btn--ghost" onClick={decreaseFont} aria-label="Decrease text size">A−</button>
          <button className="btn btn--ghost" onClick={resetFont} aria-label="Reset text size">A</button>
          <button className="btn btn--ghost" onClick={increaseFont} aria-label="Increase text size">A+</button>
          <span className="vm-access__label">Text size: {Math.round(fontScale * 100)}%</span>
        </div>

        <div className="vm-access__group">
          <label className="vm-switch">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            <span>High Contrast</span>
          </label>
        </div>
      </div>
    </div>
  );
}
