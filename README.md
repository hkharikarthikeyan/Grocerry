# My Grocery List 🛒

A small, fast, mobile-first React web application for sharing food ingredients and grocery items to purchase via WhatsApp or system clipboard.

## 🌟 Key Features

- **Instant WhatsApp Sharing**: Share formatted grocery lists directly via WhatsApp Web or mobile WhatsApp app.
- **Quantity Management**: Custom quantity selector with units (`kg`, `g`, `litre`, `packet`, `piece`, `dozen`).
- **Category Filter & Search**: Instantly filter products by category (`Vegetables`, `Grocery`, `Spices`, `Other`) or search query.
- **Copy List Fallback**: Easily copy the shopping list to clipboard if WhatsApp is unavailable.
- **Mobile-First Touch Design**: Sticky bottom summary bar with large tap targets designed for quick operation by elderly users/parents.
- **Extensible Architecture**: Clean data model separation structured for future multi-user support without rewrite.
- **LocalStorage Persistence**: Remembers selected items and quantities across app refreshes.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   cd Foo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── CategorySection.jsx   # Horizontally scrollable category pills
│   ├── Header.jsx            # App header branding
│   ├── ProductCard.jsx       # Individual product card & checkmark toggle
│   ├── QuantitySelector.jsx  # Touch-friendly quantity controls
│   ├── SearchBar.jsx         # Search box with clear action
│   ├── SelectedSummary.jsx   # Sticky bottom bar & clear confirm modal
│   ├── ShareButton.jsx       # Primary WhatsApp share action button
│   └── Toast.jsx             # User notification toast
├── data/
│   └── products.js           # Static product data & multi-user container
├── utils/
│   └── whatsapp.js           # Formatted message generator & link builder
├── App.jsx                   # Main state container & localStorage sync
├── index.css                 # Vanilla CSS design system
└── main.jsx                  # React application entry point
```

---

## 📱 WhatsApp Message Format Example

When items are selected and **Share on WhatsApp** is tapped, the app generates:

```text
🛒 Grocery List

1. Tomato - 2 kg
2. Onion - 1 kg
3. Milk - 2 litre

Please buy these items.
Thank you ❤️
```

---

## 🛠️ Build & Deployment

The application is completely static with no backend required. You can deploy the generated `dist` folder to Vercel, Netlify, GitHub Pages, or Cloudflare Pages.

```bash
npm run build
```
