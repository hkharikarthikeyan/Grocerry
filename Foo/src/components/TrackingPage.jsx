import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const STATUS_STEPS = [
  { key: "PLACED",            label: "Order Placed",      icon: "📋", color: "#3b82f6" },
  { key: "RECEIVED",          label: "Received",          icon: "✅", color: "#8b5cf6" },
  { key: "PACKING",           label: "Packing",           icon: "📦", color: "#f59e0b" },
  { key: "READY_FOR_PICKUP",  label: "Ready for Pickup",  icon: "🛍️", color: "#10b981" },
  { key: "COMPLETED",         label: "Completed",         icon: "🎉", color: "#059669" },
];

function getStatusIndex(status) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function StatusBadge({ status }) {
  const step = STATUS_STEPS.find((s) => s.key === status) || STATUS_STEPS[0];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: `${step.color}18`,
        color: step.color,
        border: `1px solid ${step.color}40`,
        borderRadius: "999px",
        padding: "0.3rem 0.7rem",
        fontSize: "0.78rem",
        fontWeight: 700,
      }}
    >
      {step.icon} {step.label}
    </span>
  );
}

function OrderCard({ order, expanded, onToggle }) {
  const currentIndex = getStatusIndex(order.status);

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "14px",
        marginBottom: "1rem",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Card Header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          cursor: "pointer",
          background: expanded ? "#f8fafc" : "#fff",
          gap: "0.75rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              🏬 {order.supermarket_name}
            </span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""} ·{" "}
            {order.total_amount ? `₹${order.total_amount}` : "No price"} ·{" "}
            {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <StatusBadge status={order.status} />
          <span style={{ color: "#94a3b8", fontSize: "1rem" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          {/* Status Timeline */}
          <div style={{ padding: "1rem 1.25rem", background: "#f8fafc" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
              Order Progress
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {STATUS_STEPS.map((step, idx) => {
                const done = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <React.Fragment key={step.key}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "52px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: done ? step.color : "#e2e8f0",
                          color: done ? "#fff" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.95rem",
                          boxShadow: isCurrent ? `0 0 0 3px ${step.color}40` : "none",
                          transition: "all 0.3s",
                          flexShrink: 0,
                        }}
                      >
                        {done ? step.icon : "○"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.62rem",
                          fontWeight: 600,
                          color: done ? step.color : "#94a3b8",
                          marginTop: "0.3rem",
                          textAlign: "center",
                          lineHeight: 1.2,
                          maxWidth: "52px",
                          wordBreak: "break-word",
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div
                        style={{
                          flex: 1,
                          height: "2px",
                          background: idx < currentIndex ? STATUS_STEPS[idx + 1].color : "#e2e8f0",
                          marginBottom: "1.2rem",
                          transition: "background 0.3s",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Items list */}
          <div style={{ padding: "0.75rem 1.25rem 1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
              Items Ordered
            </p>
            {order.items?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.45rem 0",
                  borderBottom: i < order.items.length - 1 ? "1px dashed #f1f5f9" : "none",
                  fontSize: "0.88rem",
                }}
              >
                <span style={{ color: "#334155" }}>
                  {item.product_name} × {item.quantity} {item.unit}
                </span>
                {item.subtotal ? (
                  <span style={{ fontWeight: 600, color: "#059669" }}>₹{item.subtotal}</span>
                ) : null}
              </div>
            ))}
            {order.total_amount ? (
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.6rem", borderTop: "2px solid #e2e8f0", marginTop: "0.5rem" }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, color: "#059669" }}>₹{order.total_amount}</span>
              </div>
            ) : null}

            {/* Supermarket info */}
            <div style={{ marginTop: "0.75rem", padding: "0.65rem 0.9rem", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>
                📍 {order.supermarket_address} · {order.supermarket_district}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: "0.2rem" }}>
                🏪 Visit store to pay and collect when Ready for Pickup.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!token) return;
    async function fetchOrders() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          // Auto-expand latest order on first load
          if (data.orders.length > 0)
            setExpandedId((prev) => prev || data.orders[0].id);
        } else {
          setError(data.message || "Failed to fetch orders.");
        }
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔄</div>
        <p style={{ color: "#64748b", fontWeight: 600 }}>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📭</div>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.4rem" }}>
          No orders yet
        </p>
        <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
          Go to the 🏬 Shop tab, select items and place your first order!
        </p>
      </div>
    );
  }

  const totalSpent = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div style={{ padding: "1rem 0 6rem" }}>
      {/* Spending & Summary Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          color: "#fff",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total Spending (Completed Orders)
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#10b981", marginTop: "0.2rem" }}>
            ₹{totalSpent.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
            {orders.length} Total Order{orders.length !== 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", justifyContent: "flex-end", marginTop: "0.25rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#10b981" }}>Live Sync</span>
          </div>
        </div>
      </div>

      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          expanded={expandedId === order.id}
          onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
        />
      ))}
    </div>
  );
}
