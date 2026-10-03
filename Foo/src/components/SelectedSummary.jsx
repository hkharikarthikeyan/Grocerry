import React, { useState } from "react";
import ShareButton from "./ShareButton";

export default function SelectedSummary({
  selectedCount,
  onShareWhatsApp,
  onCopyList,
  onClearAll,
  isShopTab,
  onPlaceOrder,
}) {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearClick = () => setShowClearModal(true);
  const confirmClear = () => {
    setShowClearModal(false);
    onClearAll();
  };

  const hasSelected = selectedCount > 0;

  return (
    <>
      <footer className="selected-summary-bar">
        <div className="summary-container">
          <div className="summary-info-row">
            <span className={`summary-count ${!hasSelected ? "empty" : ""}`}>
              {hasSelected
                ? `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected`
                : isShopTab
                ? "Select items to place an order."
                : "Please select at least one item."}
            </span>

            {hasSelected && (
              <div className="summary-secondary-actions">
                {!isShopTab && (
                  <button
                    type="button"
                    className="btn-text-action btn-copy"
                    onClick={onCopyList}
                    title="Copy list to clipboard"
                  >
                    📋 Copy List
                  </button>
                )}
                <button
                  type="button"
                  className="btn-text-action btn-clear"
                  onClick={handleClearClick}
                  title="Clear all selections"
                >
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>

          <div className="summary-main-action">
            {isShopTab ? (
              <button
                type="button"
                disabled={!hasSelected}
                onClick={onPlaceOrder}
                style={{
                  width: "100%",
                  height: "52px",
                  background: hasSelected
                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    : "#cbd5e1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: hasSelected ? "pointer" : "not-allowed",
                  boxShadow: hasSelected ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
                  transition: "all 0.2s",
                }}
              >
                📦 Place Order
              </button>
            ) : (
              <ShareButton disabled={!hasSelected} onClick={onShareWhatsApp} />
            )}
          </div>
        </div>
      </footer>

      {showClearModal && (
        <div className="modal-backdrop" onClick={() => setShowClearModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Clear Selections?</h3>
            <p className="modal-text">
              Are you sure you want to clear all selected items from your grocery list?
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn modal-cancel"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
              <button type="button" className="modal-btn modal-confirm" onClick={confirmClear}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
