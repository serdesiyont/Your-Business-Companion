import pandas as pd
from models.products import Product 
from models.sale import Sale   
from extensions import db


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
        top_products = df.head(num_products)

        # Identify bottom-performing products
        bottom_products = df.tail(num_products)

        return top_products, bottom_products

    except Exception as e:
        print(f"Error analyzing sales data: {e}")
        return pd.DataFrame(), pd.DataFrame()  # Return empty DataFrames in case of error
