import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

from db import get_db

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'grocerry-user-secret-key-2026')

CORS(app, resources={r"/api/*": {"origins": "*"}})

# Root Health Check Route
@app.route('/')
def home():
    return jsonify({
        'status': 'online',
        'service': 'Grocerry User Backend API',
        'message': 'API is running successfully on Vercel!'
    }), 200

# Global Exception Handler with CORS
@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through 404s so Flask handles unknown endpoints normally
    if getattr(e, 'code', 500) == 404:
        return jsonify({'success': False, 'message': '404 Not Found'}), 404
    print(f"Server Error in FG Backend: {e}")
    response = jsonify({
        'success': False,
        'message': str(e),
        'error': 'SERVER_ERROR'
    })
    response.status_code = 500
    return response

# Helper function to convert Mongo BSON object to JSON-serializable dict
def fmt_doc(doc):
    if not doc:
        return None
    doc = dict(doc)
    if '_id' in doc:
        doc['id'] = str(doc.pop('_id'))
    return doc

# Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'success': False, 'message': 'Authentication token is missing', 'error': 'UNAUTHORIZED'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            db = get_db()
            current_user = db.users.find_one({'_id': ObjectId(data['id'])})
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found', 'error': 'UNAUTHORIZED'}), 401
            current_user = fmt_doc(current_user)
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired', 'error': 'TOKEN_EXPIRED'}), 401
        except Exception:
            return jsonify({'success': False, 'message': 'Invalid token', 'error': 'INVALID_TOKEN'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


# --- HEALTH CHECK ---
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'success': True,
        'message': 'User Grocery API connected to MongoDB Atlas on port 5000!',
        'timestamp': datetime.utcnow().isoformat()
    })


# --- AUTHENTICATION ENDPOINTS ---
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not username or not name or not email or not password:
            return jsonify({'success': False, 'message': 'All fields are required', 'error': 'MISSING_FIELDS'}), 400

        if len(username) < 3 or len(password) < 6:
            return jsonify({'success': False, 'message': 'Invalid username or password length', 'error': 'INVALID_INPUT'}), 400

        db = get_db()
        if db.users.find_one({'username': username}):
            return jsonify({'success': False, 'message': 'Username is already taken', 'error': 'DUPLICATE_USERNAME'}), 400

        if db.users.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'Email address is already registered', 'error': 'DUPLICATE_EMAIL'}), 400

        user_doc = {
            'username': username,
            'name': name,
            'email': email,
            'password_hash': generate_password_hash(password),
            'role': 'USER',
            'state': 'Tamil Nadu',
            'district': data.get('district', 'Dharmapuri'),
            'created_at': datetime.utcnow().isoformat()
        }

        res = db.users.insert_one(user_doc)
        user_doc = fmt_doc(user_doc)
        user_doc.pop('password_hash', None)

        payload = {
            'id': user_doc['id'],
            'username': username,
            'role': 'USER',
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'success': True,
            'message': 'Registration successful!',
            'token': token,
            'user': user_doc
        }), 201
    except Exception as e:
        print(f"Error registering user: {e}")
        return jsonify({'success': False, 'message': f'Server error: {str(e)}', 'error': 'SERVER_ERROR'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()

        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password are required', 'error': 'MISSING_CREDENTIALS'}), 400

        db = get_db()
        user = db.users.find_one({'username': username})
        if not user or not check_password_hash(user.get('password_hash', ''), password):
            return jsonify({'success': False, 'message': 'Invalid username or password', 'error': 'INVALID_CREDENTIALS'}), 401

        user_doc = fmt_doc(user)
        user_doc.pop('password_hash', None)

        payload = {
            'id': user_doc['id'],
            'username': username,
            'role': user_doc.get('role', 'USER'),
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user_doc
        })
    except Exception as e:
        print(f"Error logging in: {e}")
        return jsonify({'success': False, 'message': f'Server error: {str(e)}', 'error': 'SERVER_ERROR'}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    current_user.pop('password_hash', None)
    return jsonify({
        'success': True,
        'user': current_user
    })


# --- LOCATION ENDPOINTS ---
@app.route('/api/locations/states', methods=['GET'])
def get_states():
    return jsonify({
        'success': True,
        'states': ['Tamil Nadu']
    })

@app.route('/api/locations/districts', methods=['GET'])
def get_districts():
    districts = [
        "Chennai", "Coimbatore", "Dharmapuri", "Salem", 
        "Madurai", "Erode", "Namakkal", "Krishnagiri", 
        "Tiruchirappalli", "Tiruppur", "Vellore"
    ]
    return jsonify({
        'success': True,
        'districts': districts
    })

@app.route('/api/users/location', methods=['PUT'])
@token_required
def update_user_location(current_user):
    data = request.get_json() or {}
    district = data.get('district')
    state = data.get('state', 'Tamil Nadu')

    if not district:
        return jsonify({'success': False, 'message': 'District is required', 'error': 'MISSING_DISTRICT'}), 400

    db = get_db()
    db.users.update_one(
        {'_id': ObjectId(current_user['id'])},
        {'$set': {'state': state, 'district': district}}
    )

    current_user['state'] = state
    current_user['district'] = district
    current_user.pop('password_hash', None)

    return jsonify({
        'success': True,
        'message': 'Location updated successfully',
        'user': current_user
    })


# --- SUPERMARKET ENDPOINTS ---
@app.route('/api/supermarkets', methods=['GET'])
def get_supermarkets():
    district = request.args.get('district')
    db = get_db()
    query = {'status': 'ACTIVE'}
    if district:
        query['district'] = district

    supermarkets = [fmt_doc(s) for s in db.supermarkets.find(query)]
    return jsonify({
        'success': True,
        'supermarkets': supermarkets
    })

@app.route('/api/supermarkets/<sm_id>', methods=['GET'])
def get_supermarket(sm_id):
    db = get_db()
    try:
        sm = db.supermarkets.find_one({'_id': ObjectId(sm_id)})
    except Exception:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'NOT_FOUND'}), 404

    if not sm:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'NOT_FOUND'}), 404
    return jsonify({'success': True, 'supermarket': fmt_doc(sm)})

@app.route('/api/supermarkets/<sm_id>/products', methods=['GET'])
def get_supermarket_products(sm_id):
    db = get_db()
    try:
        sm = db.supermarkets.find_one({'_id': ObjectId(sm_id)})
    except Exception:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'NOT_FOUND'}), 404

    if not sm:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'NOT_FOUND'}), 404

    category = request.args.get('category')
    search = request.args.get('search')
    availability_only = request.args.get('availability', 'false').lower() == 'true'

    query = {'supermarket_id': str(sm_id)}
    if category and category != 'All':
        query['category'] = category

    if availability_only:
        query['availability'] = True

    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'category': {'$regex': search, '$options': 'i'}}
        ]

    products = [fmt_doc(p) for p in db.products.find(query).sort('name', 1)]
    categories = db.products.distinct('category', {'supermarket_id': str(sm_id)})

    return jsonify({
        'success': True,
        'supermarket': fmt_doc(sm),
        'categories': ['All'] + sorted(categories),
        'products': products
    })


# --- ORDER ENDPOINTS ---
@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json() or {}
    supermarket_id = data.get('supermarket_id')
    items_data = data.get('items', [])

    if not supermarket_id or not items_data:
        return jsonify({'success': False, 'message': 'Supermarket ID and items required', 'error': 'INVALID_ORDER'}), 400

    db = get_db()
    try:
        supermarket = db.supermarkets.find_one({'_id': ObjectId(supermarket_id)})
    except Exception:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'SUPERMARKET_NOT_FOUND'}), 404

    if not supermarket:
        return jsonify({'success': False, 'message': 'Supermarket not found', 'error': 'SUPERMARKET_NOT_FOUND'}), 404

    total = 0.0
    order_items = []

    for item in items_data:
        prod_id = item.get('product_id')
        qty = int(item.get('quantity', 1))
        if qty <= 0:
            continue

        try:
            product = db.products.find_one({'_id': ObjectId(prod_id), 'supermarket_id': str(supermarket_id)})
        except Exception:
            return jsonify({'success': False, 'message': f'Product ID {prod_id} not found', 'error': 'PRODUCT_NOT_FOUND'}), 404

        if not product or not product.get('availability', True) or product.get('stock_quantity', 0) < qty:
            return jsonify({'success': False, 'message': f'Product "{product.get("name", "")}" is unavailable or out of stock', 'error': 'PRODUCT_UNAVAILABLE'}), 400

        subtotal = round(product['price'] * qty, 2)
        total += subtotal

        # Deduct stock
        db.products.update_one({'_id': ObjectId(prod_id)}, {'$inc': {'stock_quantity': -qty}})

        order_items.append({
            'product_id': str(product['_id']),
            'product_name': product['name'],
            'unit': product.get('unit', 'unit'),
            'quantity': qty,
            'unit_price': product['price'],
            'subtotal': subtotal
        })

    now_iso = datetime.utcnow().isoformat()
    order_doc = {
        'user_id': current_user['id'],
        'user_name': current_user.get('name'),
        'user_username': current_user.get('username'),
        'supermarket_id': str(supermarket_id),
        'supermarket_name': supermarket['name'],
        'supermarket_address': supermarket['address'],
        'supermarket_district': supermarket['district'],
        'status': 'PLACED',
        'total_amount': round(total, 2),
        'items': order_items,
        'created_at': now_iso,
        'updated_at': now_iso
    }

    res = db.orders.insert_one(order_doc)
    order_doc = fmt_doc(order_doc)

    return jsonify({
        'success': True,
        'message': 'Order placed successfully! Visit store to pay and collect.',
        'order': order_doc
    }), 201

@app.route('/api/orders/my-orders', methods=['GET'])
@token_required
def get_my_orders(current_user):
    db = get_db()
    orders = [fmt_doc(o) for o in db.orders.find({'user_id': current_user['id']}).sort('created_at', -1)]
    return jsonify({
        'success': True,
        'orders': orders
    })


# --- NOTIFICATIONS ENDPOINTS ---
@app.route('/api/notifications', methods=['GET'])
@token_required
def get_user_notifications(current_user):
    db = get_db()
    notifications = [fmt_doc(n) for n in db.notifications.find({'user_id': current_user['id']}).sort('created_at', -1)]
    unread_count = db.notifications.count_documents({'user_id': current_user['id'], 'is_read': False})

    return jsonify({
        'success': True,
        'unread_count': unread_count,
        'notifications': notifications
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
