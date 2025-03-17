from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.products import Product
from extensions import db


product_blueprint = Blueprint("product_blueprint", __name__)


@product_blueprint.route('/products/add', methods=['POST'])
def create_product():
    data = request.get_json()
    if not data or 'product_name' not in data or 'initial_stock' not in data or 'price' not in data or 'user_id' not in data:
        return jsonify({'message': 'Missing data'}), 400

    new_product = Product(
        product_name=data['product_name'],
        description=data.get('description'),
        initial_stock=data['initial_stock'],
        price=data['price'],
        category=data.get('category'),
        user_id=1
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@product_blueprint.route('/products', methods=['GET'])
def get_products():
    user_id = 1
    products = Product.query.filter_by(user_id=user_id)
    return jsonify([product.to_dict() for product in products])

@product_blueprint.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    user_id = 1
    product = Product.query.filter_by(user_id=user_id).get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product.to_dict())


@product_blueprint.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    user_id = 1
    product = Product.query.filter_by(user_id=user_id).get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    product.product_name = data.get('product_name', product.product_name)
    product.description = data.get('description', product.description)
    product.initial_stock = data.get('initial_stock', product.initial_stock)
    product.price = data.get('price', product.price)
    product.category = data.get('category', product.category)
    product.user_id = data.get('user_id', product.user_id)

    db.session.commit()
    return jsonify(product.to_dict())


@product_blueprint.route('/products/<int:product_id>', methods=['DELETE']) 
def delete_product(product_id):
    user_id = 1
    product = Product.query.filter_by(user_id=user_id).get(product_id)
  
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'}), 200
    


@product_blueprint.route('/products/<int:product_id>/stock', methods=['PUT'])
def update_stock(product_id):
    user_id = 1
    product = Product.query.filter_by(user_id=user_id).get(product_id)
  
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    data = request.get_json()
    if not data or 'initial_stock' not in data:
        return jsonify({'message': 'Missing stock data'}), 400

    product.initial_stock = data['initial_stock']
    db.session.commit()
    return jsonify(product.to_dict())