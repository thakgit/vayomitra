import React from "react";

export default function CareCircleMock() {
  return (
    <div className="vm-form">
      <p>Invite family to contribute stories and voice notes.</p>
      <div className="vm-form__row">
        <label>Invite by email</label>
        <input type="email" placeholder="name@example.com" />
      </div>
      <div className="vm-actions">
        <button className="btn btn--primary">Send Invite</button>
        <button className="btn btn--ghost">Copy Invite Link</button>
      </div>
    </div>
  );
}
