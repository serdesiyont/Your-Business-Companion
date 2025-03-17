from flask import Blueprint, jsonify, request
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from models.products import Product  # Import your Product model

recommendation_bp = Blueprint('recommendation', __name__)

def fetch_products_data():
    """Fetches product data from the database and returns it as a Pandas DataFrame."""
    try:
        # Fetch product data using traditional querying
        products = Product.query.all()

        # Convert product data to a list of dictionaries
        products_data = [
            {
                'id': product.id,
                'product_name': product.product_name,
                'description': product.description,
                'category': product.category
            }
            for product in products
        ]

        # Convert the list of dictionaries to a Pandas DataFrame
        df = pd.DataFrame(products_data)
        return df

    except Exception as e:
        print(f"Error fetching product data: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of an error

def content_based_recommendation(product_id, products_df, top_n=5):
    """
    Generates content-based recommendations for a given product.

    Args:
        product_id (int): The ID of the product to generate recommendations for.
        products_df (pd.DataFrame): DataFrame containing product data.
        top_n (int): The number of recommendations to return.

    Returns:
        list: A list of product IDs that are recommended.
    """

    if products_df.empty:
        return []

    # Create a TF-IDF vectorizer to convert product descriptions to numerical data
    tfidf = TfidfVectorizer(stop_words='english')

    # Fit and transform the 'description' column
    tfidf_matrix = tfidf.fit_transform(products_df['description'].fillna(''))  # Fill NaN values

    # Compute the cosine similarity between products
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Get the index of the product
    idx = products_df[products_df['id'] == product_id].index[0]

    # Get the pairwise similarity scores of all products with that product
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the products based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the top N most similar products (excluding the product itself)
    sim_scores = sim_scores[1:top_n+1]

    # Get the product indices
    product_indices = [i[0] for i in sim_scores]

    # Return the top N similar products
    return products_df['id'].iloc[product_indices].tolist()

@recommendation_bp.route('/recommendations/<int:product_id>')
def get_recommendations(product_id):
    """API endpoint to get product recommendations."""

    # Fetch product data
    products_df = fetch_products_data()

    # Generate content-based recommendations
    recommendations = content_based_recommendation(product_id, products_df)

    return jsonify({'recommendations': recommendations})