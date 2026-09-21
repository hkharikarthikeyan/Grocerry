import React from "react";

export default function QuantitySelector({ quantity, unit, onQuantityChange }) {
  const step = unit === "g" ? 50 : 1;
  const minQty = unit === "g" ? 50 : 1;

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (quantity > minQty) {
      onQuantityChange(quantity - step);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    onQuantityChange(quantity + step);
  };

  return (
    <div className="quantity-selector" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="qty-btn qty-btn-minus"
        onClick={handleDecrease}
        disabled={quantity <= minQty}
        aria-label={`Decrease quantity for ${unit}`}
      >
        −
      </button>

      <span className="qty-value-display">
        {quantity} <span className="qty-unit">{unit}</span>
      </span>

      <button
        type="button"
        className="qty-btn qty-btn-plus"
        onClick={handleIncrease}
        aria-label={`Increase quantity for ${unit}`}
      >
        +
      </button>
    </div>
  );
}
