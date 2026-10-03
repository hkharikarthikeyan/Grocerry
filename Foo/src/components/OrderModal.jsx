import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function OrderModal({ selectedItems, supermarket, token, onClose, onOrderPlaced }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = selectedItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const handleConfirm = async () => {
    if (!token) {
      setError("You must be logged in to place an order.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const items = selectedItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supermarket_id: supermarket.id,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to place order.");
      }
      onOrderPlaced(data.order);
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
        backgroundColor: "rgba(15,23,42,0.75)",
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
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#fff",
          }}
        >
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>📦 Confirm Order</div>
            <div style={{ fontSize: "0.82rem", opacity: 0.9, marginTop: "0.15rem" }}>
              {supermarket?.name} • {supermarket?.district}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Order Summary ({selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""})
          </p>

          {selectedItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.65rem 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f172a" }}>
                  {item.icon && <span style={{ marginRight: "0.4rem" }}>{item.icon}</span>}
                  {item.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {item.quantity} {item.unit}
                  {item.price ? ` × ₹${item.price}` : ""}
                </div>
              </div>
              {item.price ? (
                <div style={{ fontWeight: 700, color: "#059669", fontSize: "0.95rem" }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              ) : null}
            </div>
          ))}

          {/* Total */}
          {total > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 0 0",
                borderTop: "2px solid #e2e8f0",
                marginTop: "0.5rem",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#059669" }}>
                ₹{total.toFixed(2)}
              </span>
            </div>
          )}

          {/* Info note */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              marginTop: "1rem",
              fontSize: "0.82rem",
              color: "#166534",
            }}
          >
            🏪 <strong>Pay at store</strong> — Visit the supermarket to pay and collect your order.
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                padding: "0.75rem",
                borderRadius: "8px",
                marginTop: "0.75rem",
                fontSize: "0.85rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              color: "#334155",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              flex: 2,
              padding: "0.75rem",
              background: loading ? "#6ee7b7" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Placing Order..." : "✅ Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
