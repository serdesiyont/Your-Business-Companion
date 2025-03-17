from flask import Blueprint, jsonify, request
from datetime import datetime

from models.tax import Tax
from extensions import db

tax_storage_blueprint = Blueprint('tax_storage', __name__)

@tax_storage_blueprint.route('/create-taxes', methods=['POST'])
def create_tax():
    data = request.get_json()
    if not data or 'user_id' not in data or 'tax_rate' not in data or 'tax_amount' not in data:
        return jsonify({'message': 'Missing tax data'}), 400

    new_tax = Tax(
        user_id=1,
        tax_rate=data['tax_rate'],
        tax_amount=data['tax_amount'],
        description=data.get('description')
    )
    db.session.add(new_tax)
    db.session.commit()
    return jsonify(new_tax.to_dict()), 201

@tax_storage_blueprint.route('/taxes', methods=['GET'])
def get_taxes():
    user_id = 1
    if not user_id:
        return jsonify({'message': 'Missing user_id parameter'}), 400

    taxes = Tax.query.filter_by(user_id=user_id).all()
    return jsonify([tax.to_dict() for tax in taxes])

@tax_storage_blueprint.route('/taxes/<int:tax_id>', methods=['GET'])
def get_tax(tax_id):
    tax = Tax.query.get(tax_id)
    if not tax:
        return jsonify({'message': 'Tax record not found'}), 404
    return jsonify(tax.to_dict())

@tax_storage_blueprint.route('/taxes/<int:tax_id>', methods=['PUT'])
def update_tax(tax_id):
    tax = Tax.query.get(tax_id)
    if not tax:
        return jsonify({'message': 'Tax record not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    if 'tax_rate' in data:
        tax.tax_rate = data['tax_rate']
    if 'tax_amount' in data:
        tax.tax_amount = data['tax_amount']
    if 'description' in data:
        tax.description = data['description']
    if 'tax_date' in data:
        tax.tax_date = datetime.fromisoformat(data['tax_date'])

    db.session.commit()
    return jsonify(tax.to_dict())

@tax_storage_blueprint.route('/taxes/<int:tax_id>', methods=['DELETE'])
def delete_tax(tax_id):
    tax = Tax.query.get(tax_id)
    if not tax:
        return jsonify({'message': 'Tax record not found'}), 404

    db.session.delete(tax)
    db.session.commit()
    return jsonify({'message': 'Tax record deleted'}), 200
