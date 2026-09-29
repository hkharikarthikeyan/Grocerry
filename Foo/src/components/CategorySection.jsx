import React from "react";

export default function CategorySection({ categories, activeCategory, onSelectCategory }) {
  return (
    <nav className="category-nav" aria-label="Product categories">
      <div className="category-scroll-container">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? "active" : ""}`}
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
