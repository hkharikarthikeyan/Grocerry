import random
from datetime import datetime
from werkzeug.security import generate_password_hash
from db import get_db

PRODUCT_TEMPLATES = {
    "Rice": [
        ("Ponni Boiled Rice", "Kg", 58.0, "Premium Quality Ponni Boiled Rice"),
        ("Basmati Rice (Biryani Special)", "Kg", 140.0, "Aromatic Long Grain Basmati Rice"),
        ("Idli Rice", "Kg", 42.0, "High Grade Rice for Soft Idli & Dosa"),
        ("Raw Rice (Pachai Arisi)", "Kg", 50.0, "Traditional Raw Rice for cooking"),
        ("Brown Rice", "Kg", 75.0, "Nutritious Whole Grain Brown Rice"),
        ("Sona Masoori Rice", "Kg", 65.0, "Lightweight aromatic medium-grain rice"),
        ("Seeraga Samba Rice", "Kg", 110.0, "Special Seeraga Samba Rice for Biryani"),
        ("Red Rice (Kattuyanam)", "Kg", 85.0, "Organic Traditional Red Rice"),
        ("Black Rice (Karuppu Kavuni)", "Kg", 160.0, "High Antioxidant Black Rice")
    ],
    "Pulses": [
        ("Toor Dal (Tuvaram Paruppu)", "Kg", 145.0, "Unpolished Premium Toor Dal"),
        ("Urad Dal Whole (Ulundhu)", "Kg", 135.0, "White Whole Urad Dal for Dosa Batter"),
        ("Urad Dal Split", "Kg", 125.0, "Split White Urad Dal"),
        ("Moong Dal (Paasi Paruppu)", "Kg", 110.0, "Cleaned Yellow Moong Dal"),
        ("Chana Dal (Kadalai Paruppu)", "Kg", 95.0, "High Protein Bengal Gram Dal"),
        ("Rajma (Red Kidney Beans)", "Kg", 130.0, "Premium Jammu Rajma"),
        ("Green Gram Whole", "Kg", 105.0, "Whole Organic Green Gram"),
        ("Black Chickpeas (Kondakadalai)", "Kg", 85.0, "Nutritious Black Chana"),
        ("White Chickpeas (Kabuli Chana)", "Kg", 120.0, "Large Size Kabuli Chana")
    ],
    "Vegetables": [
        ("Fresh Tomato", "Kg", 32.0, "Farm Fresh Red Tomatoes"),
        ("Onion (Big)", "Kg", 45.0, "Quality Nashik Red Onions"),
        ("Small Onion (Shallots)", "Kg", 65.0, "Flavorful Tamil Nadu Shallots"),
        ("Potato", "Kg", 35.0, "Fresh Table Potatoes"),
        ("Carrot", "Kg", 48.0, "Ooty Fresh Carrots"),
        ("Beans", "Kg", 55.0, "Crispy French Green Beans"),
        ("Brinjal (Eggplant)", "Kg", 40.0, "Fresh Purple Brinjal"),
        ("Ladies Finger (Okra)", "Kg", 38.0, "Tender Green Okra"),
        ("Cabbage", "Kg", 28.0, "Fresh Round Cabbage"),
        ("Cauliflower", "Piece", 35.0, "Clean Fresh Cauliflower Head"),
        ("Green Chillies", "250g", 15.0, "Spicy Green Chillies"),
        ("Ginger", "250g", 30.0, "Fresh Organic Ginger"),
        ("Garlic", "250g", 45.0, "Peeled Quality Garlic")
    ],
    "Fruits": [
        ("Apple (Washington)", "Kg", 180.0, "Juicy Red Washington Apples"),
        ("Banana (Robusta)", "Dozen", 45.0, "Fresh Sweet Robusta Bananas"),
        ("Banana (Red)", "Kg", 75.0, "Nutritious Red Bananas"),
        ("Orange (Nagpur)", "Kg", 90.0, "Sweet Nagpur Oranges"),
        ("Pomegranate", "Kg", 160.0, "Fresh Red Pomegranate"),
        ("Green Grapes", "500g", 70.0, "Seedless Green Grapes"),
        ("Papaya", "Kg", 35.0, "Ripe Sweet Papaya"),
        ("Watermelon", "Kg", 22.0, "Hydrating Fresh Watermelon")
    ],
    "Cooking Items": [
        ("Gold Winner Sunflower Oil", "Liter", 145.0, "Refined Sunflower Oil"),
        ("Idhayam Sesame/Gingelly Oil", "Liter", 260.0, "Pure Cold Pressed Gingelly Oil"),
        ("Fortune Mustard Oil", "Liter", 160.0, "Kachi Ghani Mustard Oil"),
        ("Tata Salt (Iodized)", "Kg", 28.0, "Vacuum Evaporated Iodized Salt"),
        ("Crystal Rock Salt (Kal Uppu)", "Kg", 18.0, "Natural Coarse Rock Salt"),
        ("White Sugar", "Kg", 44.0, "Refined Fine Sugar Crystals"),
        ("Jaggery Powder (Nattu Sakkarai)", "Kg", 70.0, "Organic Sugarcane Jaggery Powder"),
        ("Aachi Turmeric Powder", "100g", 32.0, "Pure Salem Turmeric Powder"),
        ("Aachi Red Chilli Powder", "100g", 38.0, "Spicy Red Chilli Powder"),
        ("Aachi Coriander Powder", "100g", 28.0, "Aromatic Dhaniya Powder"),
        ("Aachi Garam Masala", "50g", 35.0, "Blended Indian Spices")
    ],
    "Dairy": [
        ("Aavin Toned Milk", "500ml", 22.0, "Pasteurized Toned Milk"),
        ("Aavin Premium Milk (Full Cream)", "500ml", 30.0, "Full Cream Fresh Milk"),
        ("Hatsun Curd", "500g", 35.0, "Thick Fresh Curd Pouch"),
        ("Amul Butter (Salted)", "100g", 58.0, "Delicious Amul Pasteurized Butter"),
        ("Amul Processed Cheese Blocks", "200g", 135.0, "Rich Processed Cheese"),
        ("Fresh Paneer", "200g", 95.0, "Soft Cottage Cheese Paneer")
    ],
    "Beverages": [
        ("3 Roses Dust Tea", "250g", 140.0, "Strong South Indian Blend Tea"),
        ("Chakra Gold Tea", "250g", 135.0, "Premium Leaf Tea"),
        ("Nescafé Classic Instant Coffee", "50g", 165.0, "100% Pure Instant Coffee"),
        ("Bru Filter Coffee Powder", "200g", 110.0, "Chicory Mixed Filter Coffee"),
        ("Horlicks Malt Drink", "500g", 245.0, "Classic Malted Milk Drink"),
        ("Tropicana 100% Orange Juice", "1 Liter", 130.0, "Real Fruit Orange Juice")
    ],
    "Personal Care": [
        ("Hamam Neem Soap", "100g", 38.0, "Neem Extract Bathing Bar"),
        ("Lux Rose Soap", "100g", 42.0, "Fragrant Rose Beauty Soap"),
        ("Sunsilk Black Shampoo", "180ml", 120.0, "Nourishing Hair Shampoo"),
        ("Colgate Strong Teeth Toothpaste", "150g", 95.0, "Calcium & Fluoride Toothpaste"),
        ("Dettol Original Handwash", "200ml", 85.0, "Antiseptic Liquid Hand Wash")
    ],
    "Household": [
        ("Surf Excel Easy Wash Detergent", "1 Kg", 145.0, "Effective Stain Removal Powder"),
        ("Vim Dishwash Liquid Gel", "250ml", 55.0, "Lemon Dishwash Liquid"),
        ("Lysol Disinfectant Floor Cleaner", "500ml", 110.0, "Surface Floor Cleaner"),
        ("Colin Glass Cleaner Spray", "500ml", 105.0, "Multi-surface Shine Cleaner")
    ],
    "Snacks & Bakery": [
        ("Britannia Good Day Biscuits", "100g", 25.0, "Butter & Cashew Cookies"),
        ("Parle-G Glucose Biscuits", "250g", 30.0, "Classic Energy Biscuits"),
        ("Lays Magic Masala Chips", "50g", 20.0, "Crispy Potato Chips"),
        ("Modern Whole Wheat Bread", "400g", 45.0, "Fresh Bakery Whole Wheat Loaf")
    ]
}

VARIANTS = ["100g", "250g", "500g", "1 Kg", "2 Kg", "5 Kg", "1 Liter", "Family Pack"]
BRANDS = ["Organic", "FarmFresh", "Aachi", "Fortune", "Tata", "Heritage", "MilkyMist", "MTR"]

def seed_atlas():
    db = get_db()
    print("🌱 Connected to MongoDB Atlas! Seeding database...")

    # Clear existing collections
    db.supermarkets.delete_many({})
    db.users.delete_many({})
    db.products.delete_many({})

    # 1. Insert ABC Supermarket
    sm_res = db.supermarkets.insert_one({
        "name": "ABC Supermarket",
        "address": "123 Dharmapuri Main Road, Near Bus Stand",
        "state": "Tamil Nadu",
        "district": "Dharmapuri",
        "contact_number": "+91 9876543210",
        "email": "contact@abcsupermarket.com",
        "status": "ACTIVE",
        "created_at": datetime.utcnow().isoformat()
    })
    supermarket_id = str(sm_res.inserted_id)

    # 2. Insert Supermarket Admin & User
    db.users.insert_many([
        {
            "username": "admin_abc",
            "name": "ABC Supermarket Manager",
            "email": "admin@abcsupermarket.com",
            "password_hash": generate_password_hash("admin123"),
            "role": "SUPERMARKET_ADMIN",
            "state": "Tamil Nadu",
            "district": "Dharmapuri",
            "supermarket_id": supermarket_id,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "username": "hk123",
            "name": "HK",
            "email": "hk@example.com",
            "password_hash": generate_password_hash("password123"),
            "role": "USER",
            "state": "Tamil Nadu",
            "district": "Dharmapuri",
            "created_at": datetime.utcnow().isoformat()
        }
    ])

    # 3. Generate 1,000+ Products
    products = []
    now_iso = datetime.utcnow().isoformat()

    for category, items in PRODUCT_TEMPLATES.items():
        for name, unit, price, desc in items:
            products.append({
                "supermarket_id": supermarket_id,
                "name": name,
                "category": category,
                "description": desc,
                "unit": unit,
                "price": round(price, 2),
                "stock_quantity": random.randint(30, 200),
                "availability": True,
                "created_at": now_iso
            })

    categories = list(PRODUCT_TEMPLATES.keys())
    while len(products) < 1010:
        cat = random.choice(categories)
        base = random.choice(PRODUCT_TEMPLATES[cat])
        brand = random.choice(BRANDS)
        var = random.choice(VARIANTS)

        item_name = f"{brand} {base[0]} ({var})"
        price = round(base[2] * random.uniform(0.75, 4.0), 2)
        stock = random.randint(5, 150)

        products.append({
            "supermarket_id": supermarket_id,
            "name": item_name,
            "category": cat,
            "description": f"{base[3]} - {var} pack by {brand}",
            "unit": var,
            "price": price,
            "stock_quantity": stock,
            "availability": True,
            "created_at": now_iso
        })

    db.products.insert_many(products)
    print(f"✅ Seeding Complete! Seeded 1 Supermarket, 2 User Accounts, and {len(products)} Products into MongoDB Atlas.")

if __name__ == '__main__':
    seed_atlas()
