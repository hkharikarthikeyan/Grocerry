import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/Header";
import CategorySection from "./components/CategorySection";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import SelectedSummary from "./components/SelectedSummary";
import Toast from "./components/Toast";
import AuthModal from "./components/AuthModal";
import OrderModal from "./components/OrderModal";
import TrackingPage from "./components/TrackingPage";

import { API_BASE_URL } from "./config";
import { initialUsersData, CATEGORIES as DEFAULT_CATEGORIES } from "./data/products";
import {
  generateWhatsAppMessage,
  generateWhatsAppLink,
  generateWhatsAppWebFallback,
  copyShoppingList,
} from "./utils/whatsapp";

const LOCAL_STORAGE_KEY = "grocery_list_selections_v1";
const AUTH_TOKEN_KEY = "grocery_auth_token";
const AUTH_USER_KEY = "grocery_auth_user";
const SHOP_TAB = "🏬 Shop";

export default function App() {
  const [users] = useState(initialUsersData);
  const [activeUserId] = useState("user-001");

  // --- Auth State ---
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- View State: "home" | "tracking" — persisted in sessionStorage ---
  const [activeView, setActiveView] = useState(() => {
    return sessionStorage.getItem("grocery_active_view") || "home";
  });

  const handleSetView = (view) => {
    setActiveView(view);
    sessionStorage.setItem("grocery_active_view", view);
  };

  // --- Location & Supermarket State ---
  const [selectedDistrict, setSelectedDistrict] = useState("Dharmapuri");
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState(null);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // --- Selections: { [productId]: quantity } ---
  const [selections, setSelections] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // --- Category & Search ---
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ message: "", type: "info" });

  // --- Order Modal ---
  const [showOrderModal, setShowOrderModal] = useState(false);

  // --- Notifications ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  // ─── Auth Handlers ─────────────────────────────────────────────
  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    setToast({ message: `Welcome, ${newUser.name || newUser.username}! 🎉`, type: "success" });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem("grocery_active_view");
    setSupermarkets([]);
    setSelectedSupermarket(null);
    setDynamicProducts([]);
    setActiveCategory("All");
    handleSetView("home");
    setNotifications([]);
    setUnreadCount(0);
    setToast({ message: "You have been logged out.", type: "info" });
  };

  // Strip ugly hex order IDs from notification messages (e.g. "#6abba79c...")
  const cleanMessage = (msg) => msg.replace(/\s*#[a-f0-9]{24,}\b/gi, "").trim();

  // Track notification IDs that have already popped up as toasts to prevent repeated popups
  const toastedNotificationIdsRef = React.useRef(new Set());

  // ─── Notifications Polling ──────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const cleaned = (data.notifications || []).map((n) => ({
          ...n,
          message: cleanMessage(n.message),
        }));
        setNotifications(cleaned);
        const newUnread = data.unread_count || 0;

        // Show toast only for unread notifications that haven't popped up yet
        const newToasts = cleaned.filter(
          (n) => !n.is_read && !toastedNotificationIdsRef.current.has(n.id)
        );

        if (newToasts.length > 0) {
          // Toast the latest unread item
          setToast({ message: newToasts[0].message, type: "success" });
          // Mark all current unread notifications as toasted so they don't pop up again
          cleaned.forEach((n) => {
            if (!n.is_read) {
              toastedNotificationIdsRef.current.add(n.id);
            }
          });
        }

        setUnreadCount(newUnread);
      }
    } catch { /* server offline */ }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [token]); // eslint-disable-line

  // ─── Fetch Supermarkets (only in Shop tab) ──────────────────────
  useEffect(() => {
    if (!user || activeCategory !== SHOP_TAB) return;
    async function fetchSupermarkets() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/supermarkets?district=${selectedDistrict}`
        );
        const data = await res.json();
        if (data.success && data.supermarkets.length > 0) {
          setSupermarkets(data.supermarkets);
          if (!selectedSupermarket || selectedSupermarket.district !== selectedDistrict) {
            setSelectedSupermarket(data.supermarkets[0]);
          }
        } else {
          setSupermarkets([]);
          setSelectedSupermarket(null);
          setDynamicProducts([]);
        }
      } catch { /* offline */ }
    }
    fetchSupermarkets();
  }, [selectedDistrict, user, activeCategory]); // eslint-disable-line

  // ─── Fetch Products for selected Supermarket ────────────────────
  useEffect(() => {
    if (!selectedSupermarket) return;
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/supermarkets/${selectedSupermarket.id}/products`
        );
        const data = await res.json();
        if (data.success) {
          const mapped = data.products.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            unit: p.unit,
            price: p.price,
            availability: p.availability,
            defaultQty: 1,
            icon: p.icon || null,
            image: p.image_url,
          }));
          setDynamicProducts(mapped);
        }
      } catch { /* offline */ }
      finally { setLoadingProducts(false); }
    }
    fetchProducts();
  }, [selectedSupermarket]);

  // ─── Active Product List ────────────────────────────────────────
  const activeUser = useMemo(
    () => users.find((u) => u.id === activeUserId) || users[0],
    [users, activeUserId]
  );

  const isShopTab = activeCategory === SHOP_TAB;

  const allProducts = useMemo(
    () => (isShopTab ? dynamicProducts : activeUser.products),
    [isShopTab, dynamicProducts, activeUser]
  );

  // ─── Persist Selections ─────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selections));
    } catch { /* quota */ }
  }, [selections]);

  // ─── Visible Category Tabs ──────────────────────────────────────
  const visibleCategories = useMemo(() => {
    const staticCats = ["All", "Vegetables", "Grocery", "Spices", "Other"];
    return user ? [...staticCats, SHOP_TAB] : staticCats;
  }, [user]);

  // Reset to All tab on logout
  useEffect(() => {
    if (!user && activeCategory === SHOP_TAB) setActiveCategory("All");
  }, [user]); // eslint-disable-line

  // ─── Derived Selected Items ─────────────────────────────────────
  const selectedItems = useMemo(() => {
    return Object.entries(selections)
      .map(([id, quantity]) => {
        const prod = allProducts.find((p) => String(p.id) === String(id));
        if (!prod || quantity <= 0) return null;
        return {
          id: prod.id,
          name: prod.name,
          tamilName: prod.tamilName,
          unit: prod.unit,
          quantity,
          price: prod.price,
          icon: prod.icon,
        };
      })
      .filter(Boolean);
  }, [selections, allProducts]);

  // ─── Filtered Products ──────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allProducts.filter((product) => {
      const matchesCategory =
        isShopTab || activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.tamilName && product.tamilName.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, activeCategory, isShopTab, searchQuery]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleToggleSelect = (productId, currentQty) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        delete updated[productId];
      } else {
        const prod = allProducts.find((p) => String(p.id) === String(productId));
        updated[productId] = currentQty || (prod ? prod.defaultQty : 1);
      }
      return updated;
    });
  };

  const handleQuantityChange = (productId, newQty) => {
    setSelections((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleShareWhatsApp = () => {
    if (selectedItems.length === 0) {
      setToast({ message: "Please select at least one item before sharing.", type: "error" });
      return;
    }
    const message = generateWhatsAppMessage(selectedItems);
    const directUrl = generateWhatsAppLink(message);
    const webFallbackUrl = generateWhatsAppWebFallback(message);

    // Direct native URI call via hidden link click - opens WhatsApp app directly
    // without navigating away or reloading/refreshing current page or state.
    const link = document.createElement("a");
    link.href = directUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // If protocol launcher isn't handled by system (e.g. desktop browser without app handler),
    // fallback cleanly to api.whatsapp.com after short timeout
    const timer = setTimeout(() => {
      if (!document.hidden) {
        window.open(webFallbackUrl, "_blank", "noopener,noreferrer");
      }
    }, 1200);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { once: true });
  };

  const handleCopyList = async () => {
    if (selectedItems.length === 0) return;
    const success = await copyShoppingList(selectedItems);
    setToast(
      success
        ? { message: "Shopping list copied to clipboard! 📋", type: "success" }
        : { message: "Failed to copy list to clipboard.", type: "error" }
    );
  };

  const handleClearAll = () => {
    setSelections({});
    setToast({ message: "All selections have been cleared.", type: "info" });
  };

  const handlePlaceOrder = () => {
    if (!user) {
      setToast({ message: "Please login to place an order.", type: "error" });
      setShowAuthModal(true);
      return;
    }
    if (selectedItems.length === 0) {
      setToast({ message: "Please select at least one item.", type: "error" });
      return;
    }
    if (!selectedSupermarket) {
      setToast({ message: "Please select a supermarket first.", type: "error" });
      return;
    }
    setShowOrderModal(true);
  };

  const handleOrderPlaced = (order) => {
    setShowOrderModal(false);
    setSelections({});
    setToast({
      message: `✅ Order placed at ${order.supermarket_name}! Visit store to pay & collect.`,
      type: "success",
    });
    // Switch to Tracking view after a short delay
    setTimeout(() => handleSetView("tracking"), 1200);
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Header
        user={user}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeView={activeView}
        onSetView={handleSetView}
        notifications={notifications}
        unreadCount={unreadCount}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showOrderModal && (
        <OrderModal
          selectedItems={selectedItems}
          supermarket={selectedSupermarket}
          token={token}
          onClose={() => setShowOrderModal(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* ── Tracking View ── */}
      {activeView === "tracking" && user ? (
        <main className="main-content">
          <TrackingPage token={token} />
        </main>
      ) : (
        /* ── Home / Shop View ── */
        <main className="main-content">
          {/* District & Supermarket — only in Shop tab */}
          {isShopTab && user && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.05) 100%)",
                padding: "0.85rem 1.25rem",
                borderRadius: "12px",
                marginBottom: "1rem",
                flexWrap: "wrap",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.2rem" }}>📍</span>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>
                  District:
                </span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    background: "#fff",
                    color: "#0f172a",
                    border: "1.5px solid #10b981",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                >
                  {[
                    "Dharmapuri","Chennai","Coimbatore","Salem","Madurai",
                    "Erode","Namakkal","Krishnagiri","Tiruchirappalli","Tiruppur","Vellore",
                  ].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🏬</span>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>
                  Supermarket:
                </span>
                <select
                  value={selectedSupermarket ? selectedSupermarket.id : ""}
                  onChange={(e) => {
                    const sm = supermarkets.find((s) => String(s.id) === String(e.target.value));
                    setSelectedSupermarket(sm);
                  }}
                  style={{
                    background: "#fff",
                    color: "#0f172a",
                    border: "1.5px solid #10b981",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                  }}
                >
                  {supermarkets.length === 0 ? (
                    <option value="">No supermarkets in {selectedDistrict}</option>
                  ) : (
                    supermarkets.map((sm) => (
                      <option key={sm.id} value={sm.id}>{sm.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}

          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <CategorySection
            categories={visibleCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          <section className="products-section" aria-label="Product catalog">
            {loadingProducts ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔄</div>
                <p>Loading {selectedSupermarket?.name || "supermarket"} catalog...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const isSelected = Boolean(selections[product.id]);
                  const qty = selections[product.id] || product.defaultQty || 1;
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
            ) : isShopTab ? (
              <div className="empty-state">
                <span className="empty-icon">🏬</span>
                <p className="empty-title">
                  {supermarkets.length === 0
                    ? `No supermarkets found in ${selectedDistrict}`
                    : `No products from ${selectedSupermarket?.name || "this supermarket"} yet`}
                </p>
                <p className="empty-subtitle">
                  {supermarkets.length === 0
                    ? "Try selecting a different district."
                    : "The supermarket hasn't added products yet. Check back soon!"}
                </p>
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
      )}

      <SelectedSummary
        selectedCount={selectedItems.length}
        onShareWhatsApp={handleShareWhatsApp}
        onCopyList={handleCopyList}
        onClearAll={handleClearAll}
        isShopTab={isShopTab && activeView === "home"}
        onPlaceOrder={handlePlaceOrder}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
