from flask import Blueprint, jsonify, request
from datetime import datetime

from models.expense import Expense
from models.sale import Sale

profit_loss_blueprint = Blueprint('profit_loss', __name__)

@profit_loss_blueprint.route('/profit_loss', methods=['GET'])
def calculate_profit_loss():
    user_id = 1
    if not user_id:
        return jsonify({'message': 'Missing user_id parameter'}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'message': 'Invalid user_id format. Must be an integer.'}), 400

    sales = Sale.query.filter_by(user_id=user_id).all()
    expenses = Expense.query.filter_by(user_id=user_id).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)

    profit_loss = total_sales - total_expenses

    return jsonify({

        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss,
    }), 200

@profit_loss_blueprint.route('/profit_loss/date', methods=['GET'])
def calculate_profit_loss_by_date():
    user_id = 1
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not user_id or not start_date_str or not end_date_str:
        return jsonify({'message': 'Missing parameters'}), 400

    try:
        user_id = int(user_id)
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid parameter format'}), 400

    sales = Sale.query.filter(Sale.user_id == user_id, Sale.sale_date >= start_date, Sale.sale_date <= end_date).all()
    expenses = Expense.query.filter(Expense.user_id == user_id, Expense.date >= start_date, Expense.date <= end_date).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)

    profit_loss = total_sales - total_expenses

    return jsonify({
        'start_date': start_date.strftime('%Y-%m-%d'),
        'end_date': end_date.strftime('%Y-%m-%d'),
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss,
    }), 200