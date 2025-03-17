from flask import Blueprint, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, date, timedelta
from models.sale import Sale  # Import your Sale model

graphs_bp = Blueprint('graphs', __name__)

def fetch_monthly_sales(year, month):
    """Fetches sales data for a specific month and year."""
    try:
        # Calculate the start and end dates for the month
        start_date = date(year, month, 1)
        end_date = date(year, month + 1, 1) - timedelta(days=1) if month < 12 else date(year + 1, 1, 1) - timedelta(days=1)

        # Fetch sales data for the month using traditional querying
        sales = Sale.query.filter(Sale.sale_date >= start_date, Sale.sale_date <= end_date).all()

        # Convert sales data to a list of dictionaries
        sales_data = [
            {
                'product_id': sale.product_id,
                'quantity': sale.quantity,
                'sale_date': sale.sale_date,
                'sale_price': sale.sale_price
            }
            for sale in sales
        ]

        # Convert the list of dictionaries to a Pandas DataFrame
        df = pd.DataFrame(sales_data)
        return df

    except Exception as e:
        print(f"Error fetching sales data: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of an error

def generate_sales_comparison_graph(year1, month1, year2, month2):
    """
    Generates a bar graph comparing sales for two different months.
    """
    df1 = fetch_monthly_sales(year1, month1)
    df2 = fetch_monthly_sales(year2, month2)

    if df1.empty and df2.empty:
        return "No sales data available for the selected months."

    # Calculate total sales for each month
    total_sales1 = df1['sale_price'].sum() if not df1.empty else 0
    total_sales2 = df2['sale_price'].sum() if not df2.empty else 0

    # Create a bar graph
    months = [f"{year1}-{month1:02d}", f"{year2}-{month2:02d}"]
    sales = [total_sales1, total_sales2]

    plt.figure(figsize=(8, 6))
    plt.bar(months, sales, color=['blue', 'green'])
    plt.title('Sales Comparison')
    plt.xlabel('Month')
    plt.ylabel('Total Sales')
    plt.tight_layout()

    # Save the chart to a buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Encode the image to base64
    image_png = buffer.getvalue()
    graphic = base64.b64encode(image_png).decode('utf-8')

    return graphic

@graphs_bp.route('/sales_comparison/<int:year1>/<int:month1>/<int:year2>/<int:month2>')
def sales_comparison_route(year1, month1, year2, month2):
    """API endpoint to get the sales comparison graph."""
    graph = generate_sales_comparison_graph(year1, month1, year2, month2)
    return jsonify({'sales_comparison_graph': graph})