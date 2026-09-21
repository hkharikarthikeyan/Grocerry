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
      { id: "tomato", name: "Tomato", tamilName: "தக்காளி", category: "Vegetables", unit: "kg", icon: "🍅", defaultQty: 1 },
      { id: "onion", name: "Onion", tamilName: "வெங்காயம்", category: "Vegetables", unit: "kg", icon: "🧅", defaultQty: 1 },
      { id: "potato", name: "Potato", tamilName: "உருளைக்கிழங்கு", category: "Vegetables", unit: "kg", icon: "🥔", defaultQty: 1 },
      { id: "carrot", name: "Carrot", tamilName: "கேரட்", category: "Vegetables", unit: "kg", icon: "🥕", defaultQty: 1 },
      { id: "beans", name: "Beans", tamilName: "பீன்ஸ்", category: "Vegetables", unit: "kg", icon: "🫛", defaultQty: 1 },
      { id: "chilli", name: "Green Chilli", tamilName: "பச்சை மிளகாய்", category: "Vegetables", unit: "g", icon: "🌶️", defaultQty: 250 },
      { id: "coriander", name: "Coriander / Mint", tamilName: "கொத்தமல்லி / புதினா", category: "Vegetables", unit: "packet", icon: "🌿", defaultQty: 1 },
      { id: "lemon", name: "Lemon", tamilName: "எலுமிச்சை", category: "Vegetables", unit: "piece", icon: "🍋", defaultQty: 4 },

      // Grocery
      { id: "rice", name: "Rice", tamilName: "அரிசி", category: "Grocery", unit: "kg", icon: "🍚", defaultQty: 5 },
      { id: "sugar", name: "Sugar", tamilName: "சர்க்கரை", category: "Grocery", unit: "kg", icon: "🍬", defaultQty: 1 },
      { id: "salt", name: "Salt", tamilName: "உப்பு", category: "Grocery", unit: "packet", icon: "🧂", defaultQty: 1 },
      { id: "wheat_flour", name: "Wheat Flour (Atta)", tamilName: "கோதுமை மாவு", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 2 },
      { id: "cooking_oil", name: "Cooking Oil", tamilName: "சமையல் எண்ணெய்", category: "Grocery", unit: "litre", icon: "🛢️", defaultQty: 1 },
      { id: "toor_dal", name: "Toor Dal", tamilName: "துவரம் பருப்பு", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },

      // Spices
      { id: "turmeric", name: "Turmeric Powder", tamilName: "மஞ்சள் தூள்", category: "Spices", unit: "packet", icon: "🟡", defaultQty: 1 },
      { id: "chilli_powder", name: "Chilli Powder", tamilName: "மிளகாய் தூள்", category: "Spices", unit: "packet", icon: "🔴", defaultQty: 1 },
      { id: "pepper", name: "Pepper", tamilName: "மிளகு", category: "Spices", unit: "g", icon: "⚫", defaultQty: 100 },
      { id: "cumin", name: "Cumin (Jeera)", tamilName: "சீரகம்", category: "Spices", unit: "g", icon: "🟤", defaultQty: 100 },
      { id: "mustard", name: "Mustard Seeds", tamilName: "கடுகு", category: "Spices", unit: "g", icon: "🟡", defaultQty: 100 },

      // Other
      { id: "milk", name: "Milk", tamilName: "பால்", category: "Other", unit: "litre", icon: "🥛", defaultQty: 1 },
      { id: "bread", name: "Bread", tamilName: "பிரெட்", category: "Other", unit: "packet", icon: "🍞", defaultQty: 1 },
      { id: "eggs", name: "Eggs", tamilName: "முட்டை", category: "Other", unit: "piece", icon: "🥚", defaultQty: 12 },
      { id: "tea_powder", name: "Tea Powder", tamilName: "தேயிலைத் தூள்", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 },
      { id: "coffee", name: "Coffee Powder", tamilName: "காபி தூள்", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 }
    ]
  }
];

export const products = initialUsersData[0].products;

export const CATEGORIES = ["All", "Vegetables", "Grocery", "Spices", "Other"];
