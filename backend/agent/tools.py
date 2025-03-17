from datetime import datetime
from typing import List
from flask import jsonify
from langchain.tools import tool
import requests
from sqlalchemy import extract
from models.sale import Sale
from models.tax import Tax
from models.users import User
from models.products import Product
from extensions import db

@tool
def search_wikipedia(search_term: str):
    """ 
    Populate the URL with the search term, fetch the Wikipedia page, and return the summarized version.
    """
    url = f"https://en.wikipedia.org/wiki/{search_term}"
    response = requests.get(url=url)
    return response.text

@tool
def get_user_details(user_id):
    """
    Fetch user details from the database based on the user ID.
    """
    user = User.query.get(int(user_id))
    if user:
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
             
        }
    else:
        return jsonify({"error": "User not found"}), 404

 

@tool
def top_product_recommendations(user_id) -> List[int]:
    """
    Provides the top three product recommendations based on their total sales
    and any other available metrics. This function does not require a specific
    product ID as input.
    """
    import pandas as pd
    from models.products import Product
    from models.sale import Sale  # Adjust the import based on your actual models
    from sqlalchemy import func
    

    try:
        user_id = int(user_id)
        
        products = Product.query.filter_by(user_id=user_id)
        products_data = [
            {
                'id': product.id,
                'product_name': product.product_name,
                'description': product.description,
                'category': product.category
            }
            for product in products
        ]
        products_df = pd.DataFrame(products_data)

        # Fetch sales data with total sales per product
        sales = (
            Sale.query
            .with_entities(
                Sale.product_id.label('product_id'),
                func.sum(Sale.quantity * Sale.sale_price).label('total_sales')
            )
            .group_by(Sale.product_id)
            .all()
        )

        sales_data = [
            {
                'product_id': s.product_id,
                'total_sales': float(s.total_sales)  # ensure numeric
            }
            for s in sales
        ]
        sales_df = pd.DataFrame(sales_data)

        # Merge product data with sales data on the product ID
        merged_df = products_df.merge(sales_df, left_on='id', right_on='product_id', how='left').fillna(0)

        # If you have extra metrics, combine them into a single score. Here, we use total_sales alone.
        merged_df['score'] = merged_df['total_sales']

        # Sort by the score in descending order
        merged_df = merged_df.sort_values(by='score', ascending=False)

        # Extract the top 3 product IDs
        top_ids = merged_df['id'].head(3).tolist()
        return  top_ids

    except Exception as e:
        print(f"Error generating top product recommendations: {e}")
        return []
    

@tool
def calculate_monthly_taxes(user_id: int) -> List[float]:
    """
    Calculates monthly taxes for a given user for the current year.
    Returns a list of 12 tax amounts (one for each month).
    """
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    current_year = datetime.now().year
    monthly_taxes = []

    for month in range(1, 13):
        sales = Sale.query.filter(
            Sale.user_id == user_id,
            extract('year', Sale.sale_date) == current_year,
            extract('month', Sale.sale_date) == month
        ).all()

        total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
        monthly_tax = total_sales * 0.15   
        monthly_taxes.append({month: monthly_tax})

    return monthly_taxes




@tool
def calculate_monthly_sales(user_id: int) -> List[dict]:
    """
    Calculates monthly sales (total revenue) for a given user for the current year.
    Returns a list of dictionaries with 'month' and 'sales' keys.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")
    
    current_year = datetime.now().year
    monthly_sales = []

    for month in range(1, 13):
        sales = Sale.query.filter(
            Sale.user_id == user_id,
            extract('year', Sale.sale_date) == current_year,
            extract('month', Sale.sale_date) == month
        ).all()

        total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
        monthly_sales.append({ month, total_sales})

    return monthly_sales

# ...existing code...
from models.expense import Expense

@tool
def calculate_monthly_profit_loss(user_id: int) -> List[dict]:
    """
    Calculates monthly profit or loss (total revenue minus total expenses) 
    for a given user for the current year.
    Returns a list of dictionaries with 'month' and 'profit_loss' keys.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")
    
    current_year = datetime.now().year
    monthly_profit_loss = []

    for month in range(1, 13):
        sales = Sale.query.filter(
            Sale.user_id == user_id,
            extract('year', Sale.sale_date) == current_year,
            extract('month', Sale.sale_date) == month
        ).all()

        expenses = Expense.query.filter(
            Expense.user_id == user_id,
            extract('year', Expense.date) == current_year,
            extract('month', Expense.date) == month
        ).all()

        total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
        total_expenses = sum(expense.amount for expense in expenses)

        profit_loss = total_sales - total_expenses
        monthly_profit_loss.append({ month, profit_loss})

    return monthly_profit_loss

 
from models.expense import Expense

@tool
def calculate_weekly_profit_loss(user_id: int) -> List[dict]:
    """
    Calculates weekly profit or loss (total revenue minus total expenses)
    for a given user for the current year.
    Returns a list of dictionaries with 'week' and 'profit_loss' keys.
    """
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    current_year = datetime.now().year
    weekly_profit_loss = []

    for week in range(1, 53):  # 1 through 52 (some years may have 53 weeks)
        sales = Sale.query.filter(
            Sale.user_id == user_id,
            extract('year', Sale.sale_date) == current_year,
            extract('week', Sale.sale_date) == week
        ).all()

        expenses = Expense.query.filter(
            Expense.user_id == user_id,
            extract('year', Expense.date) == current_year,
            extract('week', Expense.date) == week
        ).all()

        total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
        total_expenses = sum(expense.amount for expense in expenses)

        profit_loss = total_sales - total_expenses
        weekly_profit_loss.append({ week, profit_loss})

    return weekly_profit_loss

# ...existing code...

@tool
def get_general_user_data(user_id: int) -> dict:
    """
    Fetches a broad overview of the user's data: products, sales, expenses, and monthly taxes.
    """
    user_id = int(user_id)
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if user_id <= 0:
        raise ValueError("user_id must be a positive integer.")

    

    # User products
    products = Product.query.filter_by(user_id=user_id).all()
    products_list = [
        {
            "id": p.id,
            "product_name": p.product_name,
            "description": p.description,
            "category": p.category
        }
        for p in products
    ]

    # User sales
    sales = Sale.query.filter_by(user_id=user_id).all()
    sales_list = [
        {
            "id": s.id,
            "product_id": s.product_id,
            "quantity": s.quantity,
            "sale_price": float(s.sale_price),
            "sale_date": s.sale_date.isoformat() if s.sale_date else None
        }
        for s in sales
    ]

    # User expenses
    expenses = Expense.query.filter_by(user_id=user_id).all()
    expenses_list = [
        {
            "id": e.id,
            "expense_type": e.expense_type,
            "amount": float(e.amount),
            "date": e.date.isoformat() if e.date else None
        }
        for e in expenses
    ]

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
    

    return {
        "products": products_list,
        "sales": sales_list,
        "expenses": expenses_list,
        "taxes": tax_list
    }

 