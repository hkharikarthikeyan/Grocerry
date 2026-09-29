from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for frontend requests (e.g. Vite on port 5173)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Flask backend is running smoothly!'
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        'items': [
            {'id': 1, 'name': 'Sample Item 1'},
            {'id': 2, 'name': 'Sample Item 2'}
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
