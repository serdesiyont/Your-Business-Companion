from flask import Blueprint, jsonify, request
from datetime import datetime
from models.expense import Expense
from extensions import db
expense_blueprint = Blueprint("expenses", __name__)



@expense_blueprint.route('/expenses', methods=['POST'])
def create_expense():
    data = request.get_json()
    if not data or 'description' not in data or 'amount' not in data or 'user_id' not in data:
        return jsonify({'message': 'Missing expense data'}), 400

    new_expense = Expense(
        description=data['description'],
        amount=data['amount'],
        category=data.get('category'),
        user_id=data['user_id']
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201

@expense_blueprint.route('/expenses', methods=['GET'])
def get_expenses():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'Missing user_id parameter'}), 400

    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([expense.to_dict() for expense in expenses])

@expense_blueprint.route('/expenses/<int:expense_id>', methods=['GET'])
def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'message': 'Expense not found'}), 404
    return jsonify(expense.to_dict())

@expense_blueprint.route('/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'message': 'Expense not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    if 'description' in data:
        expense.description = data['description']
    if 'amount' in data:
        expense.amount = data['amount']
    if 'category' in data:
        expense.category = data['category']
    if 'date' in data:
        expense.date = datetime.fromisoformat(data['date']) #parse iso format date
    db.session.commit()
    return jsonify(expense.to_dict())

@expense_blueprint.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return jsonify({'message': 'Expense not found'}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({'message': 'Expense deleted'}), 200

 
