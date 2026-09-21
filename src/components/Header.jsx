import React from "react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="brand-icon">🥦</span>
        <div>
          <h1 className="header-title">My Grocery List</h1>
          <p className="header-subtitle">
            Select what you need and share it on WhatsApp.
          </p>
        </div>
      </div>
    </header>
  );
}
