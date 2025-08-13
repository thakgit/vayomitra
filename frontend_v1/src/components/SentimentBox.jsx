
import React, { useState } from 'react';

function SentimentBox({ onAnalyze }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Type something to analyze sentiment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Analyze</button>
    </div>
  );
}

export default SentimentBox;
