import React from "react";

export default function SentimentMock() {
  return (
    <div className="vm-form">
      <div className="vm-form__row">
        <label>How are you feeling today?</label>
        <textarea rows="3" placeholder="Write a few words..." />
      </div>
      <div className="vm-actions">
        <button className="btn btn--primary">Analyze Mood</button>
        <div className="vm-score">Score: <span>+0.42</span></div>
      </div>
    </div>
  );
}
