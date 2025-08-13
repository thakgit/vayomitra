
import React from 'react';

function StoryCard({ text }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
      <p>{text}</p>
    </div>
  );
}

export default StoryCard;
