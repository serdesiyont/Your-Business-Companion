from flask import Blueprint, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from models.sale import Sale  # Import your Sale model
from models.products import Product  # Import your Product model
from extensions import db  # Import the database instance

predictions_bp = Blueprint('predictions', __name__)

def fetch_sales_data():
    """Fetches sales data from the database and returns it as a Pandas DataFrame."""
    try:
        # Fetch sales data using traditional querying
        sales = Sale.query.all()

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

def preprocess_sales_data(df):
    """Preprocesses the sales data for forecasting."""
    if df.empty:
        return df

    # Convert 'sale_date' to datetime objects
    df['sale_date'] = pd.to_datetime(df['sale_date'])

    # Set 'sale_date' as the index
    df = df.set_index('sale_date')

    # Resample the data to daily frequency (or any other frequency you need)
    df = df.resample('D').sum()  # Sum the sales for each day

    return df

def train_sales_forecasting_model(df):
    """Trains a sales forecasting model using linear regression."""
    if df.empty:
        return None

    # Create a column for time (number of days from the start)
    df['time'] = range(len(df))

    # Define features (X) and target (y)
    X = df[['time']]
    y = df['sale_price']

    # Create a linear regression model
    model = LinearRegression()

    # Train the model
    model.fit(X, y)

    return model

def predict_future_sales(model, num_days):
    """Predicts future sales for a given number of days."""
    if model is None:
        return []

    # Create a DataFrame for the future dates
    future_dates = [datetime.now() + timedelta(days=i) for i in range(1, num_days + 1)]
    future_df = pd.DataFrame({'sale_date': future_dates})
    future_df['sale_date'] = pd.to_datetime(future_df['sale_date'])
    future_df = future_df.set_index('sale_date')
    future_df['time'] = range(len(future_dates))

    # Predict sales for the future dates
    predictions = model.predict(future_df[['time']])

    # Create a list of dictionaries with the predicted sales
    forecast = [
        {
            'date': future_dates[i].strftime('%Y-%m-%d'),
            'predicted_sales': predictions[i]
        }
        for i in range(len(future_dates))
    ]

    return forecast

@predictions_bp.route('/sales_forecast/<int:num_days>')
def sales_forecast_route(num_days):
    """API endpoint to get the sales forecast."""

    # Fetch sales data
    sales_data = fetch_sales_data()

    # Preprocess sales data
    processed_data = preprocess_sales_data(sales_data)

    # Train the sales forecasting model
    model = train_sales_forecasting_model(processed_data)

    # Predict future sales
    forecast = predict_future_sales(model, num_days)

    return jsonify({'sales_forecast': forecast})

# Stock Level Forecasting (Example)
def fetch_product_data():
    """Fetches product data from the database."""
    try:
        # Fetch product data using traditional querying
        products = Product.query.all()
        product_data = [{'id': p.id, 'initial_stock': p.initial_stock} for p in products]
        return pd.DataFrame(product_data)
    except Exception as e:
        print(f"Error fetching product data: {e}")
        return pd.DataFrame()

def predict_stock_levels(num_days=30):
    """Predicts future stock levels (this is a simplified example)."""
    product_df = fetch_product_data()
    if product_df.empty:
        return "No product data available."

    # This is a placeholder - replace with a real forecasting model
    # For example, you could assume a constant rate of depletion
    # or use a more sophisticated time series model.
    predictions = {}
    for index, row in product_df.iterrows():
        product_id = row['id']
        initial_stock = row['initial_stock']
        # Simplistic assumption: stock decreases linearly over time
        daily_depletion = initial_stock / num_days  # Very basic
        future_levels = [max(0, initial_stock - daily_depletion * i) for i in range(num_days)]
        predictions[product_id] = future_levels

    return predictions

@predictions_bp.route('/stock_level_forecast')
def stock_level_forecast_route():
    forecasts = predict_stock_levels()
    return jsonify(forecasts)