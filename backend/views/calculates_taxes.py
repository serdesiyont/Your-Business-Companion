from datetime import datetime
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.sale import Sale
from models.tax import Tax

tax_blueprint = Blueprint("taxes", __name__)

@tax_blueprint.route('/taxes', methods=['GET'])
def calculate_taxes():
    """Calculates total sales and taxes."""
    user_id = 1
    tax_rate = request.args.get('tax_rate')

    if not user_id or not tax_rate:
        return jsonify({'message': 'Missing user_id or tax_rate parameter'}), 400

    try:
        user_id = int(user_id)
        tax_rate = float(tax_rate) / 100.0
    except ValueError:
        return jsonify({'message': 'Invalid user_id or tax_rate format. Must be a number.'}), 400

    sales = Sale.query.filter_by(user_id=user_id).all()

    total_sales = 0
    total_taxes = 0

    for sale in sales:
        sale_amount = sale.quantity * sale.sale_price
        total_sales += sale_amount
        total_taxes += sale_amount * tax_rate

    return jsonify({
        'user_id': user_id,
        'total_sales': total_sales,
        'total_taxes': total_taxes,
        'tax_rate': tax_rate * 100 #return as percentage.
    }), 200

@tax_blueprint.route('/taxes/<int:product_id>', methods=['GET'])
def calculate_product_taxes(product_id):
    """Calculates taxes for a specific product."""
    user_id = request.args.get('user_id')
    tax_rate = request.args.get('tax_rate')

    if not user_id or not tax_rate:
        return jsonify({'message': 'Missing user_id or tax_rate parameter'}), 400

    try:
        user_id = int(user_id)
        tax_rate = float(tax_rate) / 100.0
    except ValueError:
        return jsonify({'message': 'Invalid user_id or tax_rate format. Must be a number.'}), 400

    sales = Sale.query.filter_by(product_id=product_id, user_id=user_id).all()

    total_sales = 0
    total_taxes = 0

    for sale in sales:
        sale_amount = sale.quantity * sale.sale_price
        total_sales += sale_amount
        total_taxes += sale_amount * tax_rate

    return jsonify({
        'product_id': product_id,
        'user_id': user_id,
        'total_sales': total_sales,
        'total_taxes': total_taxes,
        'tax_rate': tax_rate * 100 #return as percentage.
    }), 200

@tax_blueprint.route('/taxes/date', methods=['GET'])
def calculate_taxes_by_date():
    """Calculate taxes between two dates."""
    user_id = request.args.get('user_id')
    tax_rate = request.args.get('tax_rate')

    if not user_id or not tax_rate:
        return jsonify({'message': 'Missing user_id or tax_rate parameter'}), 400

    try:
        user_id = int(user_id)
        tax_rate = float(tax_rate) / 100.0
    except ValueError:
        return jsonify({'message': 'Invalid user_id or tax_rate format. Must be a number.'}), 400

    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not start_date_str or not end_date_str:
        return jsonify({'message': 'Missing start_date or end_date'}), 400

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use %Y-%m-%d'}), 400

    sales = Sale.query.filter(Sale.sale_date >= start_date, Sale.sale_date <= end_date, Sale.user_id == user_id).all()

    total_sales = 0
    total_taxes = 0

    for sale in sales:
        sale_amount = sale.quantity * sale.sale_price
        total_sales += sale_amount
        total_taxes += sale_amount * tax_rate

    return jsonify({
        'start_date': start_date.strftime('%Y-%m-%d'),
        'end_date': end_date.strftime('%Y-%m-%d'),
        'user_id': user_id,
        'total_sales': total_sales,
        'total_taxes': total_taxes,
        'tax_rate': tax_rate * 100 #return as percentage.
    }), 200




@tax_blueprint.route('/taxes/time_range', methods=['GET'])
def get_tax_data_time_range():
    user_id = request.args.get('user_id')
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not user_id or not start_date_str or not end_date_str:
        return jsonify({'message': 'Missing user_id, start_date, or end_date parameters'}), 400

    try:
        user_id = int(user_id)
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Invalid user_id or date format. Use YYYY-MM-DD for dates.'}), 400

    if start_date > end_date:
        return jsonify({'message': 'Start date must be before end date.'}), 400

    try:
        taxes = Tax.query.filter(
            Tax.user_id == user_id,
            Tax.tax_date >= start_date,
            Tax.tax_date <= end_date
        ).all()

        return jsonify([tax.to_dict() for tax in taxes]), 200

    except Exception as e:
        return jsonify({'message': 'An unexpected error occurred.'}), 500