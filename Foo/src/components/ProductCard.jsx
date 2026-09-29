import React from "react";
import QuantitySelector from "./QuantitySelector";

export default function ProductCard({ product, isSelected, quantity, onToggleSelect, onQuantityChange }) {
  const currentQuantity = quantity || product.defaultQty;

  const handleCardClick = () => {
    onToggleSelect(product.id, currentQuantity);
  };

  const handleQtyChange = (newQty) => {
    onQuantityChange(product.id, newQty);
  };

  return (
    <div
      className={`product-card ${isSelected ? "selected" : ""}`}
      onClick={handleCardClick}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="card-top-row">
        <div className="product-info">
          <span className="product-icon">{product.icon}</span>
          <div className="product-names">
            <span className="product-name">{product.name}</span>
            {product.tamilName && (
              <span className="product-tamil-name">{product.tamilName}</span>
            )}
          </div>
        </div>
        <div className={`selection-badge ${isSelected ? "active" : ""}`}>
          {isSelected ? "✓ Selected" : "+ Add"}
        </div>
      </div>

      <div className="card-bottom-row">
        <label className="qty-label">Quantity</label>
        <QuantitySelector
          quantity={currentQuantity}
          unit={product.unit}
          onQuantityChange={handleQtyChange}
        />
      </div>
    </div>
  );
}
