from datetime import datetime, timedelta
import random
from extensions import db
from models.products import Product
from models.sale import Sale
from models.expense import Expense
from models.users import User  
from flask import Blueprint, jsonify, request
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import io
import base64


product_performance_bp = Blueprint('product_performance_bp', __name__)


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
                'sale_price': sale.sale_price,
                'user_id': sale.user_id
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
    """Preprocesses the sales data for machine learning."""
    if df.empty:
        return df  # Return empty DataFrame if input is empty

    # Convert 'sale_date' to datetime objects
    df['sale_date'] = pd.to_datetime(df['sale_date'])

    # Extract features: day of week, month, year
    df['day_of_week'] = df['sale_date'].dt.dayofweek
    df['month'] = df['sale_date'].dt.month
    df['year'] = df['sale_date'].dt.year

    # One-hot encode categorical features (if needed, e.g., product_id)
    df = pd.get_dummies(df, columns=['product_id', 'day_of_week', 'month', 'year'])

    # Drop the original 'sale_date' column
    df = df.drop('sale_date', axis=1)

    return df

def train_sales_prediction_model(df):
    """Trains a sales prediction model using linear regression."""
    if df.empty:
        return None  # Return None if input DataFrame is empty

    # Define features (X) and target (y)
    X = df.drop('sale_price', axis=1)
    y = df['sale_price']

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create a linear regression model
    model = LinearRegression()

    # Train the model
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    print(f"Mean Squared Error: {mse}")

    return model

def predict_sales(model, new_data):
    """Predicts sales for new data using the trained model."""
    if model is None or new_data.empty:
        return []  # Return an empty list if model is None or new_data is empty

    # Preprocess the new data
    new_data = preprocess_sales_data(new_data)

    # Ensure that the new data has the same columns as the training data
    # This is important because the model was trained on a specific set of features
    training_columns = model.feature_names_in_
    for col in training_columns:
        if col not in new_data.columns:
            new_data[col] = 0  # Add missing columns with a default value of 0
    new_data = new_data[training_columns]  # Select only the columns used for training

    # Make predictions
    predictions = model.predict(new_data)
    return predictions.tolist()  # Convert predictions to a list

@product_performance_bp.route('/predict_sales', methods=['POST'])
def predict_sales_route():
    """API endpoint to predict sales."""

    # Fetch sales data
    sales_data = fetch_sales_data()

    # Preprocess sales data
    processed_data = preprocess_sales_data(sales_data)

    # Train the sales prediction model
    model = train_sales_prediction_model(processed_data)

    # Get new data from the request
    new_data = request.get_json()
    new_df = pd.DataFrame([new_data])  # Convert to DataFrame

    # Predict sales for the new data
    predictions = predict_sales(model, new_df)

    return jsonify({'predictions': predictions})

def generate_product_performance_report():
    """
    Generates a report on product performance, including total sales and a sales trend chart.
    """
    try:
        # Fetch sales data with product names
        sales_data = db.session.query(Sale, Product.product_name).join(Product, Sale.product_id == Product.id).all()

        # Convert sales data to a Pandas DataFrame
        sales_list = [
            {
                'product_name': product_name,
                'quantity': sale.quantity,
                'sale_date': sale.sale_date,
                'sale_price': sale.sale_price
            }
            for sale, product_name in sales_data
        ]
        df = pd.DataFrame(sales_list)

        if df.empty:
            return "No sales data available."

        # Calculate total sales per product
        product_sales = df.groupby('product_name')['sale_price'].sum().sort_values(ascending=False)

        # Create a sales trend chart over time
        df['sale_date'] = pd.to_datetime(df['sale_date'])
        sales_trend = df.groupby(['product_name', pd.Grouper(key='sale_date', freq='M')])['sale_price'].sum().unstack()

        # Generate the chart
        plt.figure(figsize=(12, 6))
        sales_trend.plot(ax=plt.gca())
        plt.title('Sales Trend Over Time by Product')
        plt.xlabel('Date')
        plt.ylabel('Total Sales')
        plt.legend(title='Product')
        plt.tight_layout()

        # Save the chart to a buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()

        # Encode the image to base64
        image_png = buffer.getvalue()
        graphic = base64.b64encode(image_png).decode('utf-8')

        # Prepare the report
        report = {
            'product_sales': product_sales.to_dict(),
            'sales_trend_chart': graphic
        }

        return report

    except Exception as e:
        return f"Error generating product performance report: {e}"

@product_performance_bp.route('/product_performance_report')
def product_performance_report_route():
    """API endpoint to get the product performance report."""
    report = generate_product_performance_report()
    return jsonify(report)