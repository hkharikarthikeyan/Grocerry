/**
 * Multi-user scalable data structure.
 * Designed for future expansion (User -> Products list) while starting with default 'Family' list.
 */
export const initialUsersData = [
  {
    id: "user-001",
    name: "Family",
    products: [
      // Vegetables (காய்கறிகள்)
      { id: "tomato", name: "Tomato", tamilName: "தக்காளி", category: "Vegetables", unit: "kg", icon: "🍅", defaultQty: 1 },
      { id: "onion", name: "Onion", tamilName: "வெங்காயம்", category: "Vegetables", unit: "kg", icon: "🧅", defaultQty: 1 },
      { id: "small_onion", name: "Small Onion (Shallots)", tamilName: "சின்ன வெங்காயம்", category: "Vegetables", unit: "kg", icon: "🧅", defaultQty: 1 },
      { id: "potato", name: "Potato", tamilName: "உருளைக்கிழங்கு", category: "Vegetables", unit: "kg", icon: "🥔", defaultQty: 1 },
      { id: "carrot", name: "Carrot", tamilName: "கேரட்", category: "Vegetables", unit: "kg", icon: "🥕", defaultQty: 1 },
      { id: "beans", name: "Beans", tamilName: "பீன்ஸ்", category: "Vegetables", unit: "kg", icon: "🫛", defaultQty: 1 },
      { id: "chilli", name: "Green Chilli", tamilName: "பச்சை மிளகாய்", category: "Vegetables", unit: "g", icon: "🌶️", defaultQty: 250 },
      { id: "coriander", name: "Coriander Leaves", tamilName: "கொத்தமல்லி தழை", category: "Vegetables", unit: "packet", icon: "🌿", defaultQty: 1 },
      { id: "mint", name: "Mint Leaves", tamilName: "புதினா", category: "Vegetables", unit: "packet", icon: "🌿", defaultQty: 1 },
      { id: "curry_leaves", name: "Curry Leaves", tamilName: "கறிவேப்பிலை", category: "Vegetables", unit: "packet", icon: "🌿", defaultQty: 1 },
      { id: "lemon", name: "Lemon", tamilName: "எலுமிச்சை", category: "Vegetables", unit: "piece", icon: "🍋", defaultQty: 4 },
      { id: "ginger", name: "Ginger", tamilName: "இஞ்சி", category: "Vegetables", unit: "g", icon: "🫚", defaultQty: 100 },
      { id: "garlic", name: "Garlic", tamilName: "பூண்டு", category: "Vegetables", unit: "g", icon: "🧄", defaultQty: 250 },
      { id: "brinjal", name: "Brinjal (Eggplant)", tamilName: "கத்தரிக்காய்", category: "Vegetables", unit: "kg", icon: "🍆", defaultQty: 1 },
      { id: "ladies_finger", name: "Ladies Finger (Okra)", tamilName: "வெண்டைக்காய்", category: "Vegetables", unit: "kg", icon: "🫛", defaultQty: 1 },
      { id: "cabbage", name: "Cabbage", tamilName: "முட்டைக்கோஸ்", category: "Vegetables", unit: "kg", icon: "🥬", defaultQty: 1 },
      { id: "cauliflower", name: "Cauliflower", tamilName: "காலிஃபிளவர்", category: "Vegetables", unit: "piece", icon: "🥦", defaultQty: 1 },
      { id: "drumstick", name: "Drumstick", tamilName: "முருங்கைக்காய்", category: "Vegetables", unit: "piece", icon: "🪵", defaultQty: 3 },
      { id: "beetroot", name: "Beetroot", tamilName: "பீட்ரூட்", category: "Vegetables", unit: "kg", icon: "🍠", defaultQty: 1 },
      { id: "bottle_gourd", name: "Bottle Gourd", tamilName: "சுரைக்காய்", category: "Vegetables", unit: "piece", icon: "🥒", defaultQty: 1 },
      { id: "bitter_gourd", name: "Bitter Gourd", tamilName: "பாகற்காய்", category: "Vegetables", unit: "kg", icon: "🥒", defaultQty: 1 },
      { id: "cucumber", name: "Cucumber", tamilName: "வெள்ளரிக்காய்", category: "Vegetables", unit: "kg", icon: "🥒", defaultQty: 1 },
      { id: "coconut", name: "Coconut", tamilName: "தேங்காய்", category: "Vegetables", unit: "piece", icon: "🥥", defaultQty: 2 },

      // Grocery (மளிகை பொருட்கள்)
      { id: "raw_rice", name: "Raw Rice", tamilName: "பச்சரிசி", category: "Grocery", unit: "kg", icon: "🍚", defaultQty: 5 },
      { id: "boiled_rice", name: "Boiled Rice / Idli Rice", tamilName: "இட்லி அரிசி", category: "Grocery", unit: "kg", icon: "🍚", defaultQty: 5 },
      { id: "basmati_rice", name: "Basmati Rice", tamilName: "பாஸ்மதி அரிசி", category: "Grocery", unit: "kg", icon: "🍚", defaultQty: 1 },
      { id: "sugar", name: "Sugar", tamilName: "சர்க்கரை", category: "Grocery", unit: "kg", icon: "🍬", defaultQty: 1 },
      { id: "jaggery", name: "Jaggery", tamilName: "வெல்லம்", category: "Grocery", unit: "kg", icon: "🟤", defaultQty: 1 },
      { id: "salt", name: "Salt", tamilName: "உப்பு", category: "Grocery", unit: "packet", icon: "🧂", defaultQty: 1 },
      { id: "crystal_salt", name: "Crystal Salt", tamilName: "கல் உப்பு", category: "Grocery", unit: "packet", icon: "🧂", defaultQty: 1 },
      { id: "wheat_flour", name: "Wheat Flour (Atta)", tamilName: "கோதுமை மாவு", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 2 },
      { id: "maida", name: "Maida (All-Purpose Flour)", tamilName: "மைதா மாவு", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 1 },
      { id: "rava", name: "Rava (Sooji)", tamilName: "ரவா", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 1 },
      { id: "besan", name: "Besan (Gram Flour)", tamilName: "கடலை மாவு", category: "Grocery", unit: "kg", icon: "🌾", defaultQty: 1 },
      { id: "cooking_oil", name: "Cooking Oil", tamilName: "சமையல் எண்ணெய்", category: "Grocery", unit: "litre", icon: "🛢️", defaultQty: 1 },
      { id: "gingelly_oil", name: "Gingelly Oil (Sesame)", tamilName: "நல்லெண்ணெய்", category: "Grocery", unit: "litre", icon: "🛢️", defaultQty: 1 },
      { id: "coconut_oil", name: "Coconut Oil", tamilName: "தேங்காய் எண்ணெய்", category: "Grocery", unit: "litre", icon: "🛢️", defaultQty: 1 },
      { id: "ghee", name: "Ghee", tamilName: "நெய்", category: "Grocery", unit: "g", icon: "🧈", defaultQty: 200 },
      { id: "toor_dal", name: "Toor Dal", tamilName: "துவரம் பருப்பு", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },
      { id: "urad_dal", name: "Urad Dal", tamilName: "உளுந்தம் பருப்பு", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },
      { id: "moong_dal", name: "Moong Dal", tamilName: "பாசிப்பருப்பு", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },
      { id: "chana_dal", name: "Chana Dal", tamilName: "கடலைப்பருப்பு", category: "Grocery", unit: "kg", icon: "🫘", defaultQty: 1 },
      { id: "tamarind", name: "Tamarind", tamilName: "புளி", category: "Grocery", unit: "g", icon: "🟤", defaultQty: 250 },

      // Spices (மசாலா மற்றும் பொடிகள்)
      { id: "turmeric", name: "Turmeric Powder", tamilName: "மஞ்சள் தூள்", category: "Spices", unit: "packet", icon: "🟡", defaultQty: 1 },
      { id: "chilli_powder", name: "Chilli Powder", tamilName: "மிளகாய் தூள்", category: "Spices", unit: "packet", icon: "🔴", defaultQty: 1 },
      { id: "coriander_powder", name: "Coriander Powder", tamilName: "மல்லித் தூள்", category: "Spices", unit: "packet", icon: "🟤", defaultQty: 1 },
      { id: "sambar_powder", name: "Sambar Powder", tamilName: "சாம்பார் பொடி", category: "Spices", unit: "packet", icon: "🔴", defaultQty: 1 },
      { id: "garam_masala", name: "Garam Masala", tamilName: "கரம் மசாலா", category: "Spices", unit: "packet", icon: "🟤", defaultQty: 1 },
      { id: "pepper", name: "Pepper", tamilName: "மிளகு", category: "Spices", unit: "g", icon: "⚫", defaultQty: 100 },
      { id: "cumin", name: "Cumin (Jeera)", tamilName: "சீரகம்", category: "Spices", unit: "g", icon: "🟤", defaultQty: 100 },
      { id: "mustard", name: "Mustard Seeds", tamilName: "கடுகு", category: "Spices", unit: "g", icon: "🟡", defaultQty: 100 },
      { id: "fenugreek", name: "Fenugreek (Methi)", tamilName: "வெந்தயம்", category: "Spices", unit: "g", icon: "🟡", defaultQty: 100 },
      { id: "asafoetida", name: "Asafoetida (Hing)", tamilName: "பெருங்காயம்", category: "Spices", unit: "packet", icon: "📦", defaultQty: 1 },
      { id: "cardamom", name: "Cardamom", tamilName: "ஏலக்காய்", category: "Spices", unit: "g", icon: "🟢", defaultQty: 50 },
      { id: "cloves", name: "Cloves", tamilName: "கிராம்பு", category: "Spices", unit: "g", icon: "🟤", defaultQty: 50 },
      { id: "cinnamon", name: "Cinnamon", tamilName: "பட்டை", category: "Spices", unit: "g", icon: "🪵", defaultQty: 50 },

      // Other (பால் மற்றும் இதர பொருட்கள்)
      { id: "milk", name: "Milk", tamilName: "பால்", category: "Other", unit: "litre", icon: "🥛", defaultQty: 1 },
      { id: "curd", name: "Curd / Yogurt", tamilName: "தயிர்", category: "Other", unit: "packet", icon: "🥣", defaultQty: 1 },
      { id: "paneer", name: "Paneer", tamilName: "பன்னீர்", category: "Other", unit: "g", icon: "🧀", defaultQty: 200 },
      { id: "butter", name: "Butter", tamilName: "வெண்ணெய்", category: "Other", unit: "g", icon: "🧈", defaultQty: 100 },
      { id: "eggs", name: "Eggs", tamilName: "முட்டை", category: "Other", unit: "piece", icon: "🥚", defaultQty: 12 },
      { id: "bread", name: "Bread", tamilName: "பிரெட்", category: "Other", unit: "packet", icon: "🍞", defaultQty: 1 },
      { id: "tea_powder", name: "Tea Powder", tamilName: "தேயிலைத் தூள்", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 },
      { id: "coffee", name: "Coffee Powder", tamilName: "காபி தூள்", category: "Other", unit: "packet", icon: "☕", defaultQty: 1 }
    ]
  }
];

export const products = initialUsersData[0].products;

export const CATEGORIES = ["All", "Vegetables", "Grocery", "Spices", "Other"];
