import React, { useState } from "react";

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "register"

  // Empty states by default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint =
      mode === "register"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

    const payload =
      mode === "register"
        ? {
            name,
            email,
            username: email, // use email as unique username identifier
            mobile,
            password,
          }
        : {
            username: email,
            password,
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || `${mode === "register" ? "Registration" : "Login"} failed`);
      }

      onAuthSuccess(data.token, data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "420px",
          color: "#f8fafc",
          position: "relative",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>🥦</div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            {mode === "register"
              ? "Register to order groceries from local supermarkets"
              : "Login to track orders and shop from supermarkets"}
          </p>
        </div>

        {/* Auth Mode Switcher */}
        <div
          style={{
            display: "flex",
            background: "#0f172a",
            padding: "0.25rem",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            border: "1px solid #334155",
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              background: mode === "login" ? "#10b981" : "transparent",
              color: mode === "login" ? "#ffffff" : "#94a3b8",
            }}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.5rem",
              border: "none",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              background: mode === "register" ? "#10b981" : "transparent",
              color: mode === "register" ? "#ffffff" : "#94a3b8",
            }}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "0.75rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.85rem",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "0.65rem 0.9rem",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "0.65rem 0.9rem",
                    color: "#f8fafc",
                    fontSize: "0.9rem",
                  }}
                  required
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
              Mail ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                width: "100%",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "0.65rem 0.9rem",
                color: "#f8fafc",
                fontSize: "0.9rem",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "0.65rem 0.9rem",
                color: "#f8fafc",
                fontSize: "0.9rem",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#10b981",
              color: "#ffffff",
              border: "none",
              padding: "0.8rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : mode === "register" ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
