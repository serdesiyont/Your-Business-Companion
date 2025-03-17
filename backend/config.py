import os
from dotenv import load_dotenv

load_dotenv()

FLASK_RUN_HOST = os.environ.get("FLASK_RUN_HOST", "0.0.0.0")
FLASK_RUN_PORT = os.environ.get("FLASK_RUN_PORT", 5000)
FLASK_DEBUG = os.environ.get("FLASK_DEBUG", False)
SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite3"
JWT_SECRET_KEY = "YOUR_BUSINESS_COMPANION"
JWT_TOKEN_LOCATION = ["headers"]
JWT_IDENTITY_CLAIM = "user_id"

