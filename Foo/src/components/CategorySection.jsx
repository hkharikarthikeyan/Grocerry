import React from "react";

const SHOP_TAB = "🏬 Shop";

export default function CategorySection({ categories, activeCategory, onSelectCategory }) {
  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="category-scroll-container">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const isShop = cat === SHOP_TAB;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isShop ? "shop-pill" : ""} ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(cat)}
              aria-pressed={isActive}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
