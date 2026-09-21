/**
 * Multi-user scalable data structure.
 * Designed for future expansion (User -> Products list) while starting with default 'Family' list.
 */
export const initialUsersData = [
  {
    id: "user-001",
    name: "Family",
    products: [
      // Vegetables
      { id: "tomato", name: "Tomato", category: "Vegetables", unit: "kg", icon: "🍅", defaultQty: 1 },
      { id: "onion", name: "Onion", category: "Vegetables", unit: "kg", icon: "🧅", defaultQty: 1 },
      { id: "potato", name: "Potato", category: "Vegetables", unit: "kg", icon: "🥔", defaultQty: 1 },
      { id: "carrot", name: "Carrot", category: "Vegetables", unit: "kg", icon: "🥕", defaultQty: 1 },
      { id: "beans", name: "Beans", category: "Vegetables", unit: "kg", icon: "🫛", defaultQty: 1 },
      { id: "chilli", name: "Green Chilli", category: "Vegetables", unit: "g", icon: "🌶️", defaultQty: 250 },
      { id: "coriander", name: "Coriander / Mint", category: "Vegetables", unit: "packet", icon: "🌿", defaultQty: 1 },
      { id: "lemon", name: "Lemon", category: "Vegetables", unit: "piece", icon: "🍋", defaultQty: 4 },

      // Grocery
      { id: "rice", name: "Rice", category: "Grocery", unit: "kg", icon: "🍚", defaultQty: 5 },
      { id: "sugar", name: "Sugar", category: "Grocery", unit: "kg", icon: "🍬", defaultQty: 1 },
      { id: "salt", name: "Salt", category: "Grocery", unit: "packet", icon: "🧂", defaultQty: 1 },
      { id: "wheat_flour", name: "Wheat Flour (Atta)", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 2 },
      { id: "cooking_oil", name: "Cooking Oil", category: "Grocery", unit: "litre", icon: "🛢️", defaultQty: 1 },
      { id: "toor_dal", name: "Toor Dal", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },

      // Spices
      { id: "turmeric", name: "Turmeric Powder", category: "Spices", unit: "packet", icon: "🟡", defaultQty: 1 },
      { id: "chilli_powder", name: "Chilli Powder", category: "Spices", unit: "packet", icon: "🔴", defaultQty: 1 },
      { id: "pepper", name: "Pepper", category: "Spices", unit: "g", icon: "⚫", defaultQty: 100 },
      { id: "cumin", name: "Cumin (Jeera)", category: "Spices", unit: "g", icon: "🟤", defaultQty: 100 },
      { id: "mustard", name: "Mustard Seeds", category: "Spices", unit: "g", icon: "🟡", defaultQty: 100 },

      // Other
      { id: "milk", name: "Milk", category: "Other", unit: "litre", icon: "🥛", defaultQty: 1 },
      { id: "bread", name: "Bread", category: "Other", unit: "packet", icon: "🍞", defaultQty: 1 },
      { id: "eggs", name: "Eggs", category: "Other", unit: "piece", icon: "🥚", defaultQty: 12 },
      { id: "tea_powder", name: "Tea Powder", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 },
      { id: "coffee", name: "Coffee Powder", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 }
    ]
  }
];

export const products = initialUsersData[0].products;

export const CATEGORIES = ["All", "Vegetables", "Grocery", "Spices", "Other"];
