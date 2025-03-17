from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from sqlalchemy import extract, func
from models.expense import Expense
from models.sale import Sale
import pandas as pd
from models.products import Product    
from extensions import db


report_blueprint = Blueprint('reports', __name__)



@report_blueprint.route('/reports', methods=['GET'])
def get_weekly_sales():
    user_id = 1
    if not user_id:
        return jsonify({'message': 'Missing user_id parameter'}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'message': 'Invalid user_id format. Must be an integer.'}), 400

    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    sales = Sale.query.filter(
        Sale.user_id == user_id,
        func.date(Sale.sale_date) >= start_of_week,
        func.date(Sale.sale_date) <= end_of_week
    ).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    sale_count = len(sales)

    return jsonify({
        'user_id': user_id,
        'start_of_week': start_of_week.isoformat(),
        'end_of_week': end_of_week.isoformat(),
        'total_sales': total_sales,
        'sale_count': sale_count
    }), 200


@report_blueprint.route('/sales/monthly', methods=['GET'])
def get_monthly_sales():
    user_id = 1
    year = request.args.get('year')
    month = request.args.get('month')

    if not user_id or not year or not month:
        return jsonify({'message': 'Missing parameters'}), 400

    try:
        user_id = int(user_id)
        year = int(year)
        month = int(month)
    except ValueError:
        return jsonify({'message': 'Invalid parameter format'}), 400

    sales = Sale.query.filter(
        Sale.user_id == user_id,
        extract('year', Sale.sale_date) == year,
        extract('month', Sale.sale_date) == month
    ).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    sale_count = len(sales)

    return jsonify({
        'user_id': user_id,
        'year': year,
        'month': month,
        'total_sales': total_sales,
        'sale_count': sale_count
    }), 200





@report_blueprint.route('/profit_loss/weekly', methods=['GET'])
def get_weekly_profit_loss():
    user_id = 1
    if not user_id:
        return jsonify({'message': 'Missing user_id parameter'}), 400

    try:
        user_id = int(user_id)
    except ValueError:
        return jsonify({'message': 'Invalid user_id format. Must be an integer.'}), 400

    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    sales = Sale.query.filter(
        Sale.user_id == user_id,
        func.date(Sale.sale_date) >= start_of_week,
        func.date(Sale.sale_date) <= end_of_week
    ).all()

    expenses = Expense.query.filter(
        Expense.user_id == user_id,
        func.date(Expense.date) >= start_of_week,
        func.date(Expense.date) <= end_of_week
    ).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)
    profit_loss = total_sales - total_expenses

    return jsonify({
        'user_id': user_id,
        'start_of_week': start_of_week.isoformat(),
        'end_of_week': end_of_week.isoformat(),
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss
    }), 200

@report_blueprint.route('/profit_loss/monthly', methods=['GET'])
def get_monthly_profit_loss():
    user_id = 1
    year = request.args.get('year')
    month = request.args.get('month')

    if not user_id or not year or not month:
        return jsonify({'message': 'Missing parameters'}), 400

    try:
        user_id = int(user_id)
        year = int(year)
        month = int(month)
    except ValueError:
        return jsonify({'message': 'Invalid parameter format'}), 400

    sales = Sale.query.filter(
        Sale.user_id == user_id,
        extract('year', Sale.sale_date) == year,
        extract('month', Sale.sale_date) == month
    ).all()

    expenses = Expense.query.filter(
        Expense.user_id == user_id,
        extract('year', Expense.date) == year,
        extract('month', Expense.date) == month
    ).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)
    profit_loss = total_sales - total_expenses

    return jsonify({
        'user_id': user_id,
        'year': year,
        'month': month,
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss
    }), 200








@report_blueprint.route('/performance')
def analyze_sales_performance_orm():
    """
    Analyzes sales data to identify top and bottom-performing products using SQLAlchemy ORM.

    Returns:
        tuple: A tuple containing two pandas DataFrames:
            - top_products: DataFrame of top-performing products.
            - bottom_products: DataFrame of bottom-performing products.
    """
    try:
        # ORM query to join products and sales tables and calculate total sales per product
        results = db.session.query(
            Product.product_name,
            db.func.sum(Sale.sale_price).label('total_sales')
        ).join(Sale, Product.id == Sale.product_id).group_by(Product.product_name).order_by(db.func.sum(Sale.sale_price).desc()).all()

        # Convert the results to a pandas DataFrame
        df = pd.DataFrame(results, columns=['product_name', 'total_sales'])

        # Calculate the number of products to include in top and bottom lists (e.g., top 5 and bottom 5)
        num_products = min(5, len(df))  # Ensure we don't try to slice beyond the DataFrame size

        # Identify top-performing products
        top_products = df.head(num_products).to_dict(orient='records')

        # Identify bottom-performing products
        bottom_products = df.tail(num_products).to_dict(orient='records')

        response = {
            'top_products': top_products,
            'bottom_products': bottom_products
        }

        return jsonify(response)

    except Exception as e:
        return {"msg": f"Error analyzing sales data: {e}"}  # Return empty DataFrames in case of error
