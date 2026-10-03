import random
from app import app
from models import db, User, State, District, Supermarket, Product

DISTRICTS_LIST = [
    "Chennai", "Coimbatore", "Dharmapuri", "Salem", 
    "Madurai", "Erode", "Namakkal", "Krishnagiri", 
    "Tiruchirappalli", "Tiruppur", "Vellore"
]

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
        ("Green Grapes", "50g", 70.0, "Seedless Green Grapes"),
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

VARIANTS_WEIGHTS = ["100g", "250g", "500g", "1 Kg", "2 Kg", "5 Kg", "10 Kg", "1 Liter", "2 Liters", "Pack of 2", "Pack of 5", "Family Pack"]
BRANDS = ["Organic", "FarmFresh", "Aachi", "Fortune", "Tata", "Heritage", "MilkyMist", "MTR", "Everest", "Keya"]

def generate_1000_products(supermarket_id):
    products = []
    count = 0
    
    # 1. Add baseline templates
    for category, items in PRODUCT_TEMPLATES.items():
        for name, unit, price, desc in items:
            p = Product(
                supermarket_id=supermarket_id,
                name=name,
                category=category,
                description=desc,
                unit=unit,
                price=round(price, 2),
                stock_quantity=random.randint(20, 200),
                availability=True,
                image_url=None
            )
            products.append(p)
            count += 1
            
    # 2. Synthesize additional unique product variants up to 1,020 total items
    categories = list(PRODUCT_TEMPLATES.keys())
    while count < 1020:
        cat = random.choice(categories)
        base_item = random.choice(PRODUCT_TEMPLATES[cat])
        brand = random.choice(BRANDS)
        variant = random.choice(VARIANTS_WEIGHTS)
        
        item_name = f"{brand} {base_item[0]} - {variant}"
        price = round(base_item[2] * (random.uniform(0.7, 4.5)), 2)
        stock = random.randint(0, 150)
        availability = stock > 0
        
        p = Product(
            supermarket_id=supermarket_id,
            name=item_name,
            category=cat,
            description=f"{base_item[3]} ({variant} pack by {brand})",
            unit=variant,
            price=price,
            stock_quantity=stock,
            availability=availability,
            image_url=None
        )
        products.append(p)
        count += 1

    return products

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        print("Seeding State & Districts...")
        tn_state = State(name="Tamil Nadu")
        db.session.add(tn_state)
        db.session.commit()

        for dist_name in DISTRICTS_LIST:
            d = District(state_id=tn_state.id, name=dist_name)
            db.session.add(d)
        db.session.commit()

        print("Seeding Supermarket...")
        supermarket = Supermarket(
            name="ABC Supermarket",
            address="123 Dharmapuri Main Road, Near Bus Stand",
            state="Tamil Nadu",
            district="Dharmapuri",
            contact_number="+91 9876543210",
            email="contact@abcsupermarket.com",
            status="ACTIVE"
        )
        db.session.add(supermarket)
        db.session.commit()

        print("Seeding Admin & User Accounts...")
        # Supermarket Admin
        admin = User(
            username="admin_abc",
            name="ABC Supermarket Manager",
            email="admin@abcsupermarket.com",
            role="SUPERMARKET_ADMIN",
            state="Tamil Nadu",
            district="Dharmapuri",
            supermarket_id=supermarket.id
        )
        admin.set_password("admin123")

        # Standard Customer User
        user = User(
            username="hk123",
            name="HK",
            email="hk@example.com",
            role="USER",
            state="Tamil Nadu",
            district="Dharmapuri",
            supermarket_id=None
        )
        user.set_password("password123")

        db.session.add(admin)
        db.session.add(user)
        db.session.commit()

        print("Seeding 1,000+ Products for ABC Supermarket...")
        products = generate_1000_products(supermarket.id)
        db.session.bulk_save_objects(products)
        db.session.commit()

        print(f"Database successfully seeded! Created {len(products)} products for {supermarket.name}.")

if __name__ == '__main__':
    seed_database()
