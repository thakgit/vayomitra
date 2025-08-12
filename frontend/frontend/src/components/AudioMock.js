import React from "react";

export default function AudioMock() {
  return (
    <div className="vm-form">
      <p>Browse audio generated from your story library. Recently added:</p>
      <div className="vm-list">
        {["guj_001_gujarati.wav", "guj_002_gujarati.wav", "guj_003_gujarati.wav"].map(f => (
          <div key={f} className="vm-list__item">
            <div>{f}</div>
            <button className="btn btn--ghost">Play</button>
          </div>
        ))}
      </div>
    </div>
  );
}
