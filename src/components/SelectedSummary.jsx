import React, { useState } from "react";
import ShareButton from "./ShareButton";

export default function SelectedSummary({
  selectedCount,
  onShareWhatsApp,
  onCopyList,
  onClearAll
}) {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearClick = () => {
    setShowClearModal(true);
  };

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
                : "Please select at least one item."}
            </span>

            {hasSelected && (
              <div className="summary-secondary-actions">
                <button
                  type="button"
                  className="btn-text-action btn-copy"
                  onClick={onCopyList}
                  title="Copy list to clipboard"
                >
                  📋 Copy List
                </button>
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
            <ShareButton disabled={!hasSelected} onClick={onShareWhatsApp} />
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
              <button
                type="button"
                className="modal-btn modal-confirm"
                onClick={confirmClear}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
