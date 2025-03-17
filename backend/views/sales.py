from flask import Blueprint, jsonify, request

from models.products import Product
from models.sale import Sale
from extensions import db

sale_blueprint = Blueprint('sales', __name__)

@sale_blueprint.route('/transactions', methods=['GET'])
def get_sales():
    user_id = 1
    sales = Sale.query.filter_by(user_id=user_id)
    return jsonify([sale.to_dict() for sale in sales])

@sale_blueprint.route('/transactions/<int:sale_id>', methods=['GET'])
def get_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404
    return jsonify(sale.to_dict())

@sale_blueprint.route('/transactions/<int:sale_id>', methods=['PUT'])
def update_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    if 'product_id' in data:
      sale.product_id = data['product_id']
    if 'quantity' in data:
      sale.quantity = data['quantity']
    if 'sale_price' in data:
      sale.sale_price = data['sale_price']
    if 'user_id' in data:
      sale.user_id = data['user_id']

    db.session.commit()
    return jsonify(sale.to_dict())

@sale_blueprint.route('/transactions/<int:sale_id>', methods=['DELETE'])
def delete_sale(sale_id):
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({'message': 'Sale not found'}), 404

    db.session.delete(sale)
    db.session.commit()
    return jsonify({'message': 'Sale deleted'}), 200

@sale_blueprint.route('/transactions/create', methods=['POST'])
def create_sale():
    data = request.get_json()
    if not data or 'product_id' not in data or 'quantity' not in data or 'sale_price' not in data or 'user_id' not in data:
        return jsonify({'message': 'Missing sale data or user_id'}), 400

    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if product.initial_stock < data['quantity']:
        return jsonify({'message': 'Insufficient stock'}), 400

    new_sale = Sale(
        product_id=data['product_id'],
        quantity=data['quantity'],
        sale_price=data['sale_price'],
        user_id = 1
    )

    product.initial_stock -= data['quantity'] #Reduce the stock.

    db.session.add(new_sale)
    db.session.commit()
    return jsonify(new_sale.to_dict()), 201