from models.expense import Expense
from models.products import Product
from models.sale import Sale   
from models.tax import Tax  

from datetime import datetime, timedelta
from langchain.tools import tool
from datetime import datetime
from typing import Dict, List, Union
import pandas as pd
from sqlalchemy import extract, func
from extensions import db

# @tool
# def calculate_taxes_for_user(args: str) -> Dict[str, Union[int, float]]:
#     """
#     Calculates the total sales and taxes for a given user.

#     Args:
#         user_id (int): The ID of the user.
#         tax_rate (float): The tax rate (e.g., 0.05 for 5%).

#     Returns:
#         Dict[str, Union[int, float]]: A dictionary containing the user ID, total sales, total taxes, and tax rate.
#     """
#     user_id ,tax_rate = map(int, args.split(',')) 
#     sales = Sale.query.filter_by(user_id=user_id).all()

#     total_sales = 0
#     total_taxes = 0

#     for sale in sales:
#         sale_amount = sale.quantity * sale.sale_price
#         total_sales += sale_amount
#         total_taxes += sale_amount * tax_rate

#     return {
#         'user_id': user_id,
#         'total_sales': total_sales,
#         'total_taxes': total_taxes,
#         'tax_rate': tax_rate * 100  # Return as percentage
#     }

# @tool
# def calculate_product_taxes_for_user(product_id: int, user_id: int, tax_rate: float) -> Dict[str, Union[int, float]]:
#     """
#     Calculates the taxes for a specific product sold by a given user.

#     Args:
#         product_id (int): The ID of the product.
#         user_id (int): The ID of the user.
#         tax_rate (float): The tax rate (e.g., 0.05 for 5%).

#     Returns:
#         Dict[str, Union[int, float]]: A dictionary containing the product ID, user ID, total sales, total taxes, and tax rate.
#     """

#     user_id = int(user_id)
#     product_id = int(product_id)
#     tax_rate = float(tax_rate)
#     sales = Sale.query.filter_by(product_id=product_id, user_id=user_id).all()

#     total_sales = 0
#     total_taxes = 0

#     for sale in sales:
#         sale_amount = sale.quantity * sale.sale_price
#         total_sales += sale_amount
#         total_taxes += sale_amount * tax_rate

#     return {
#         'product_id': product_id,
#         'user_id': user_id,
#         'total_sales': total_sales,
#         'total_taxes': total_taxes,
#         'tax_rate': tax_rate * 100  # Return as percentage
#     }


# @tool
# def calculate_taxes_by_date_range(user_id: int, tax_rate: float, start_date: str, end_date: str) -> Dict[str, Union[str, int, float]]:
#     """
#     Calculates the taxes for a given user within a specified date range.

#     Args:
#         user_id (int): The ID of the user.
#         tax_rate (float): The tax rate (e.g., 0.05 for 5%).
#         start_date (str): The start date in YYYY-MM-DD format.
#         end_date (str): The end date in YYYY-MM-DD format.

#     Returns:
#         Dict[str, Union[str, int, float]]: A dictionary containing the start date, end date, user ID, total sales, total taxes, and tax rate.
#     """
#     user_id = int(user_id)
#     try:
#         start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
#         end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
#     except ValueError:
#         raise ValueError("Invalid date format. Use YYYY-MM-DD.")

#     sales = Sale.query.filter(Sale.sale_date >= start_date_dt, Sale.sale_date <= end_date_dt, Sale.user_id == user_id).all()

#     total_sales = 0
#     total_taxes = 0

#     for sale in sales:
#         sale_amount = sale.quantity * sale.sale_price
#         total_sales += sale_amount
#         total_taxes += sale_amount * tax_rate

#     return {
#         'start_date': start_date,
#         'end_date': end_date,
#         'user_id': user_id,
#         'total_sales': total_sales,
#         'total_taxes': total_taxes,
#         'tax_rate': tax_rate * 100  # Return as percentage
#     }


@tool
def get_expenses_for_user(user_id: str) -> List[Dict[str, Union[int, str, float]]]:
    """
    Retrieves all expenses for a given user and returns them as a list of dictionaries.

    Args:
        user_id (int): The ID of the user.

    Returns:
        List[Dict[str, Union[int, str, float]]]: A list of dictionaries, where each dictionary
                                                represents an expense.  Returns an empty list if
                                                no expenses are found.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    expenses = Expense.query.filter_by(user_id=user_id).all()
    expense_list = []
    for expense in expenses:
        expense_dict = {
            'id': expense.id,
            'description': expense.description,
            'amount': expense.amount,
            'date': expense.date.isoformat(),
            'category': expense.category,
        }
        expense_list.append(expense_dict)
    return expense_list



@tool
def get_products_for_user(user_id: int) -> List[Dict[str, Union[int, str]]]:
    """
    Retrieves all products for a given user and returns them as a list of dictionaries.

    Args:
        user_id (int): The ID of the user.

    Returns:
        List[Dict[str, Union[int, str]]]: A list of dictionaries, where each dictionary
                                            represents a product. Returns an empty list if no
                                            products are found.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    products = Product.query.filter_by(user_id=user_id).all()
    product_list = []
    for product in products:
        product_dict = {
            "id": product.id,
            "product_name": product.product_name,
            "description": product.description,
            "initial_stock": product.initial_stock,
            "price": product.price,
            "category": product.category,
             
        }
        product_list.append(product_dict)
    return product_list


@tool
def calculate_profit_loss(user_id: int) -> Dict[str, Union[int, float]]:
    """
    Calculates the total profit or loss for a given user.

    Args:
        user_id (int): The ID of the user.

    Returns:
        Dict[str, Union[int, float]]: A dictionary containing the user ID, total sales,
                                        total expenses, and profit/loss.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    sales = Sale.query.filter_by(user_id=user_id).all()
    expenses = Expense.query.filter_by(user_id=user_id).all()

    total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
    total_expenses = sum(expense.amount for expense in expenses)

    profit_loss = total_sales - total_expenses

    return {
        'user_id': user_id,
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss,
    }

# @tool
# def calculate_profit_loss_by_date(user_id: int, start_date: str, end_date: str) -> Dict[str, Union[int, float, str]]:
#     """
#     Calculates the profit or loss for a given user within a specified date range.

#     Args:
#         user_id (int): The ID of the user.
#         start_date (str): The start date in YYYY-MM-DD format.
#         end_date (str): The end date in YYYY-MM-DD format.

#     Returns:
#         Dict[str, Union[int, float, str]]: A dictionary containing the user ID, start date,
#                                             end date, total sales, total expenses, and profit/loss.

#     Raises:
#         TypeError: If user_id is not an integer.
#         ValueError: If user_id is not a positive integer or if the date format is invalid.
#     """
#     user_id = int(user_id)
#     if not isinstance(user_id, int):
#         raise TypeError("user_id must be an integer.")
#     if user_id <= 0:
#         raise ValueError("user_id must be a positive integer.")

#     try:
#         start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
#         end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
#     except ValueError:
#         raise ValueError("Invalid date format. Use YYYY-MM-DD.")

#     sales = Sale.query.filter(Sale.user_id == user_id, Sale.sale_date >= start_date_dt,
#                                Sale.sale_date <= end_date_dt).all()
#     expenses = Expense.query.filter(Expense.user_id == user_id, Expense.date >= start_date_dt,
#                                      Expense.date <= end_date_dt).all()

#     total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#     total_expenses = sum(expense.amount for expense in expenses)

#     profit_loss = total_sales - total_expenses

#     return {
#         'user_id': user_id,
#         'start_date': start_date,
#         'end_date': end_date,
#         'total_sales': total_sales,
#         'total_expenses': total_expenses,
#         'profit_loss': profit_loss,
#     }


@tool
def get_weekly_sales(user_id: int) -> Dict[str, Union[int, str, float]]:
    """
    Calculates the total sales and sale count for a given user for the current week.

    Args:
        user_id (int): The ID of the user.

    Returns:
        Dict[str, Union[int, str, float]]: A dictionary containing the user ID, start of week,
                                            end of week, total sales, and sale count.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    user_id = int(user_id)

    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

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

    return {
        'user_id': user_id,
        'start_of_week': start_of_week.isoformat(),
        'end_of_week': end_of_week.isoformat(),
        'total_sales': total_sales,
        'sale_count': sale_count
    }

# @tool
# def get_monthly_sales(user_id: int, year: int, month: int) -> Dict[str, Union[int, float]]:
#     """
#     Calculates the total sales and sale count for a given user for a specific month and year.

#     Args:
#         user_id (int): The ID of the user.
#         year (int): The year.
#         month (int): The month.

#     Returns:
#         Dict[str, Union[int, float]]: A dictionary containing the user ID, year, month,
#                                         total sales, and sale count.

#     Raises:
#         TypeError: If user_id, year, or month are not integers.
#         ValueError: If user_id, year, or month are not positive integers.
#     """
#     user_id = int(user_id)

#     if not isinstance(user_id, int) or not isinstance(year, int) or not isinstance(month, int):
#         raise TypeError("user_id, year, and month must be integers.")
#     if user_id <= 0 or year <= 0 or month <= 0:
#         raise ValueError("user_id, year, and month must be positive integers.")

#     sales = Sale.query.filter(
#         Sale.user_id == user_id,
#         extract('year', Sale.sale_date) == year,
#         extract('month', Sale.sale_date) == month
#     ).all()

#     total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#     sale_count = len(sales)

#     return {
#         'user_id': user_id,
#         'year': year,
#         'month': month,
#         'total_sales': total_sales,
#         'sale_count': sale_count
#     }

@tool
def get_weekly_profit_loss(user_id: int) -> Dict[str, Union[int, str, float]]:
    """
    Calculates the total sales, total expenses, and profit/loss for a given user for the current week.

    Args:
        user_id (int): The ID of the user.

    Returns:
        Dict[str, Union[int, str, float]]: A dictionary containing the user ID, start of week,
                                            end of week, total sales, total expenses, and profit/loss.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    
    user_id = int(user_id)

    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

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

    return {
        'user_id': user_id,
        'start_of_week': start_of_week.isoformat(),
        'end_of_week': end_of_week.isoformat(),
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'profit_loss': profit_loss
    }

# @tool
# def get_monthly_profit_loss(args: str) -> Dict[str, Union[int, float]]:
#     """
#     Calculates the total sales, total expenses, and profit/loss for a given user for a specific month and year.

#     Args:
#         args (str): A comma-separated string containing the user ID, year, and month.

#     Returns:
#         Dict[str, Union[int, float]]: A dictionary containing the user ID, year, month,
#                                         total sales, total expenses, and profit/loss.

#     Raises:
#         TypeError: If user_id, year, or month are not integers.
#         ValueError: If user_id, year, or month are not positive integers.
#     """
#     print(args)
#     try:
#         user_id, year, month = map(int, args.split(''))
#     except ValueError:
#         raise ValueError("args must be a comma-separated string of three integers: user_id, year, month.")

#     if user_id <= 0 or year <= 0 or month <= 0:
#         raise ValueError("user_id, year, and month must be positive integers.")

#     sales = Sale.query.filter(
#         Sale.user_id == user_id,
#         extract('year', Sale.sale_date) == year,
#         extract('month', Sale.sale_date) == month
#     ).all()

#     expenses = Expense.query.filter(
#         Expense.user_id == user_id,
#         extract('year', Expense.date) == year,
#         extract('month', Expense.date) == month
#     ).all()

#     total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#     total_expenses = sum(expense.amount for expense in expenses)
#     profit_loss = total_sales - total_expenses

#     return {
#         'user_id': user_id,
#         'year': year,
#         'month': month,
#         'total_sales': total_sales,
#         'total_expenses': total_expenses,
#         'profit_loss': profit_loss
#     }
@tool
def analyze_sales_performance_orm() -> Dict:
    """
    Analyzes sales data to identify top and bottom-performing products using SQLAlchemy ORM.

    Returns:
         A dictionary containing two lists:
            - top_products: List of dictionaries representing top-performing products.
            - bottom_products: List of dictionaries representing bottom-performing products.
    """
    try:
        # ORM query to join products and sales tables and calculate total sales per product
        results = db.session.query(
            Product.product_name,
            db.func.sum(Sale.sale_price).label('total_sales')
        ).join(Sale, Product.id == Sale.product_id).group_by(Product.product_name).order_by(
            db.func.sum(Sale.sale_price).desc()).all()

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

        return response

    except Exception as e:
        # Consider logging the error here for debugging purposes
        return {
            'top_products': [],
            'bottom_products': []
        }  # Return empty lists in case of error
    
@tool
def get_sales(user_id: int) -> List[Dict[str, Union[int, float, str]]]:
    """
    Retrieves all sales and returns them as a list of dictionaries.

    Returns:
        List[Dict[str, Union[int, float, str]]]: A list of dictionaries, where each dictionary
                                                 represents a sale. Returns an empty list if no
                                                 sales are found.
    """
    user_id = int(user_id)
    sales = Sale.query.filter_by(user_id=user_id)
    sale_list = []
    for sale in sales:
        sale_dict = {
            "id": sale.id,
            "product_id": sale.product_id,
            "quantity": sale.quantity,
            "sale_date": sale.sale_date.isoformat(),
            "sale_price": sale.sale_price,
            "user_id": sale.user_id,
        }
        sale_list.append(sale_dict)
    return sale_list  




@tool
def get_taxes_for_user(user_id: int) -> List[Dict[str, Union[int, float, str]]]:
    """
    Retrieves all tax records for a given user and returns them as a list of dictionaries.

    Args:
        user_id (int): The ID of the user.

    Returns:
        List[Dict[str, Union[int, float, str]]]: A list of dictionaries, where each dictionary
                                                 represents a tax record. Returns an empty list if
                                                 no tax records are found for the user.

    Raises:
        TypeError: If user_id is not an integer.
        ValueError: If user_id is not a positive integer.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    taxes = Tax.query.filter_by(user_id=user_id).all()
    tax_list = []
    for tax in taxes:
        tax_dict = {
            'id': tax.id,
            'user_id': tax.user_id,
            'tax_rate': tax.tax_rate,
            'tax_amount': tax.tax_amount,
            'tax_date': tax.tax_date.isoformat(),
            'description': tax.description,
        }
        tax_list.append(tax_dict)
    return tax_list