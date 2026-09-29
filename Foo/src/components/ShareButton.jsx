import React from "react";

export default function ShareButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      className="share-whatsapp-btn"
      disabled={disabled}
      onClick={onClick}
      aria-label="Share grocery list on WhatsApp"
    >
      <span className="whatsapp-icon" aria-hidden="true">💬</span>
      <span>Share on WhatsApp</span>
    </button>
  );
}
