import React, { useState } from "react";

export default function Header({ user, onOpenAuthModal, onLogout, activeView, onSetView, notifications, unreadCount }) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  return (
    <header className="app-header" style={{ flexDirection: "column", gap: 0, padding: 0 }}>
      {/* Top Row: Brand + Auth */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 10px 16px",
          width: "100%",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div className="header-brand">
          <span className="brand-icon">🥦</span>
          <div>
            <h1 className="header-title">My Grocery List</h1>
            <p className="header-subtitle">
              {user ? `Hello, ${user.name || user.username} 👋` : "Select what you need and share it on WhatsApp."}
            </p>
          </div>
        </div>

        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {user ? (
            <>
              {/* Notification Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifDropdown((v) => !v)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    borderRadius: "10px",
                    padding: "0.4rem 0.65rem",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                  title="Notifications"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: "999px",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 3px",
                      }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "300px",
                      background: "#fff",
                      borderRadius: "14px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
                      border: "1px solid #e2e8f0",
                      zIndex: 500,
                      overflow: "hidden",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        padding: "0.85rem 1rem",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>
                        🔔 Notifications
                      </span>
                      <button
                        onClick={() => setShowNotifDropdown(false)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "0.9rem" }}
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                      {notifications && notifications.length > 0 ? (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            style={{
                              padding: "0.75rem 1rem",
                              borderBottom: "1px solid #f8fafc",
                              background: n.is_read ? "#fff" : "#f0fdf4",
                              borderLeft: n.is_read ? "none" : "3px solid #10b981",
                            }}
                          >
                            <div style={{ fontSize: "0.85rem", color: "#0f172a", lineHeight: 1.4 }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                              {n.created_at ? new Date(n.created_at).toLocaleString("en-IN") : ""}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fecaca",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuthModal}
              style={{
                background: "#10b981",
                color: "#ffffff",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                transition: "transform 0.2s, background 0.2s",
              }}
            >
              🔑 Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Nav Tabs (only when logged in) */}
      {user && (
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            padding: "0 16px 10px 16px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "8px",
          }}
        >
          <button
            onClick={() => onSetView("home")}
            style={{
              background: activeView === "home" ? "rgba(255,255,255,0.25)" : "transparent",
              color: "#fff",
              border: activeView === "home" ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
              borderRadius: "8px",
              padding: "0.35rem 0.9rem",
              fontWeight: activeView === "home" ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            🛒 Shop & List
          </button>
          <button
            onClick={() => onSetView("tracking")}
            style={{
              background: activeView === "tracking" ? "rgba(255,255,255,0.25)" : "transparent",
              color: "#fff",
              border: activeView === "tracking" ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
              borderRadius: "8px",
              padding: "0.35rem 0.9rem",
              fontWeight: activeView === "tracking" ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            📦 Tracking
          </button>
        </div>
      )}
    </header>
  );
}
