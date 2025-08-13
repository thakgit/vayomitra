import React from "react";

export default function StoriesMock() {
  return (
    <div className="vm-form">
      <div className="vm-form__row">
        <label>Language</label>
        <select defaultValue="gujarati">
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="gujarati">Gujarati</option>
        </select>
      </div>

      <div className="vm-form__row">
        <label>Story</label>
        <select defaultValue="guj_001">
          <option value="guj_001">મિત્રતાનો મૂલ્ય</option>
          <option value="guj_002">દાદીની ઘડિયાળ</option>
          <option value="guj_003">શાંતિનો શ્વાસ</option>
        </select>
      </div>

      <div className="vm-actions">
        <button className="btn btn--primary">Play Audio</button>
        <button className="btn btn--ghost">Show Text</button>
      </div>

      <div className="vm-reading-box">
        <p>
          આ એક નમૂનાના રૂપે લખાયેલું વાક્ય છે જેથી મોટા અક્ષરોમાં વાંચન સરળ રહે.
          This is a sample paragraph to preview large, comfortable reading sizes.
        </p>
      </div>
    </div>
  );
}
