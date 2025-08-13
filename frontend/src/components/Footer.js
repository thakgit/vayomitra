export default function Footer() {
  return (
    <footer className="vm-footer">
      <div className="vm-footer__inner">
        <span className="vm-footer__logo" aria-hidden>
          {/* tiny inline mark so you don't need to manage an asset file */}
          <svg width="18" height="18" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vm_g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8ab6ff"/><stop offset="1" stopColor="#b099ff"/>
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#vm_g)" opacity="0.28"/>
            <circle cx="32" cy="32" r="22" fill="none" stroke="#bcd3ff" strokeWidth="2" opacity="0.7"/>
            <path d="M24 36c2 3 6 5 8 5s6-2 8-5" fill="none" stroke="#e6f0ff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="26" cy="28" r="2.5" fill="#e6f0ff"/>
            <circle cx="38" cy="28" r="2.5" fill="#e6f0ff"/>
          </svg>
        </span>

        <span className="vm-footer__brand">VayoMitra</span>
        <span className="vm-footer__sep">•</span>
        <span className="vm-footer__credit">
          Co-created by <strong>Jayesh Thakkar</strong> × <strong>GPT-5 Thinking</strong>
        </span>
        <span className="vm-footer__tagline">Human warmth + helpful AI</span>
      </div>
    </footer>
  );
}
