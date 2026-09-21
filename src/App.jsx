import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import CategorySection from "./components/CategorySection";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import SelectedSummary from "./components/SelectedSummary";
import Toast from "./components/Toast";

import { initialUsersData, CATEGORIES } from "./data/products";
import { generateWhatsAppMessage, generateWhatsAppLink, copyShoppingList } from "./utils/whatsapp";

const LOCAL_STORAGE_KEY = "grocery_list_selections_v1";

export default function App() {
  // Multi-user architecture ready: current default user is 'user-001' (Family)
  const [users, setUsers] = useState(initialUsersData);
  const [activeUserId, setActiveUserId] = useState("user-001");

  // Get active user's product list
  const activeUser = useMemo(() => {
    return users.find((u) => u.id === activeUserId) || users[0];
  }, [users, activeUserId]);

  const allProducts = activeUser.products;

  // Selections state: { [productId]: quantity }
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selections));
    } catch (e) {
      console.warn("Could not save selections to localStorage:", e);
    }
  }, [selections]);

  // Derived selected products array with detailed names and quantities
  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([id, quantity]) => {
        const prod = allProducts.find((p) => p.id === id);
        if (!prod || quantity <= 0) return null;
        return {
          id: prod.id,
          name: prod.name,
          unit: prod.unit,
          quantity: quantity
        };
      })
      .filter(Boolean);
  }, [selections, allProducts]);

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, searchQuery]);

  // Handle card select / unselect toggle
  const handleToggleSelect = (productId, currentQty) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        const prod = allProducts.find((p) => p.id === productId);
        updated[productId] = currentQty || (prod ? prod.defaultQty : 1);
      }
      return updated;
    });
  };

  // Handle quantity adjustment
  const handleQuantityChange = (productId, newQty) => {
    setSelections((prev) => {
      if (!prev[productId]) {
        // If not selected yet, updating quantity automatically selects it
        return { ...prev, [productId]: newQty };
      }
      return { ...prev, [productId]: newQty };
    });
  };

  // WhatsApp share click
  const handleShareWhatsApp = () => {
    if (selectedItems.length === 0) {
      setToast({
        message: "Please select at least one item before sharing.",
        type: "error"
      });
      return;
    }

    const message = generateWhatsAppMessage(selectedItems);
    const whatsappUrl = generateWhatsAppLink(message);

    try {
      const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        // Pop-up blocked fallback
        window.location.href = whatsappUrl;
      }
    } catch (e) {
      setToast({
        message: "WhatsApp could not be opened automatically. You can copy the list instead.",
        type: "error"
      });
    }
  };

  // Copy list fallback
  const handleCopyList = async () => {
    if (selectedItems.length === 0) return;

    const success = await copyShoppingList(selectedItems);
    if (success) {
      setToast({
        message: "Shopping list copied to clipboard! 📋",
        type: "success"
      });
    } else {
      setToast({
        message: "Failed to copy list to clipboard.",
        type: "error"
      });
    }
  };

  // Reset / Clear all selections
  const handleClearAll = () => {
    setSelections({});
    setToast({
      message: "All selections have been cleared.",
      type: "info"
    });
  };

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CategorySection
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <section className="products-section" aria-label="Ingredients product catalog">
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isSelected = Boolean(selections[product.id]);
                const qty = selections[product.id] || product.defaultQty;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={isSelected}
                    quantity={qty}
                    onToggleSelect={handleToggleSelect}
                    onQuantityChange={handleQuantityChange}
                  />
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p className="empty-title">No products found</p>
              <p className="empty-subtitle">
                Try searching for another item or choose a different category.
              </p>
            </div>
          )}
        </section>
      </main>

      <SelectedSummary
        selectedCount={selectedItems.length}
        onShareWhatsApp={handleShareWhatsApp}
        onCopyList={handleCopyList}
        onClearAll={handleClearAll}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
