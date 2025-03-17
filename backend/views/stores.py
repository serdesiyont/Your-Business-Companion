from flask import Blueprint, jsonify, request
from extensions import db
from models.store import Store

store_blueprint = Blueprint("stores", __name__)



@store_blueprint.route('/stores', methods=['POST'])
def create_store():
    data = request.get_json()
    if not data or 'store_name' not in data or 'user_id' not in data:
        return jsonify({'message': 'Missing store data'}), 400

    new_store = Store(
        store_name=data['store_name'],
        address=data.get('address'),
        phone_number=data.get('phone_number'),
        user_id=data['user_id']
    )
    db.session.add(new_store)
    db.session.commit()
    return jsonify(new_store.to_dict()), 201

@store_blueprint.route('/stores', methods=['GET'])
def get_stores():
    stores = Store.query.all()
    return jsonify([store.to_dict() for store in stores])

@store_blueprint.route('/stores/<int:store_id>', methods=['GET'])
def get_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'message': 'Store not found'}), 404
    return jsonify(store.to_dict())

@store_blueprint.route('/stores/<int:store_id>', methods=['PUT'])
def update_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'message': 'Store not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    store.store_name = data.get('store_name', store.store_name)
    store.address = data.get('address', store.address)
    store.phone_number = data.get('phone_number', store.phone_number)
    store.user_id = data.get('user_id', store.user_id)

    db.session.commit()
    return jsonify(store.to_dict())

@store_blueprint.route('/stores/<int:store_id>', methods=['DELETE'])
def delete_store(store_id):
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'message': 'Store not found'}), 404

    db.session.delete(store)
    db.session.commit()
    return jsonify({'message': 'Store deleted'}), 200