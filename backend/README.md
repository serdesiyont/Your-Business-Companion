# supet_agent_backend

# supet_agent_backend

## Getting Started

After cloning the repository, follow these steps to set up the project:

1.  **Create a virtual environment:**

    ```bash
    python3 -m venv env
    ```

2.  **Activate the virtual environment:**

    ```bash
    source env/bin/activate
    ```

3.  **Install the dependencies:**

    ```bash
    pip install -r req.txt
    ```


## Folder Structure

*   **`app.py`**: The main application file. It creates the Flask app instance, registers blueprints, and initializes extensions like the database and JWT.
*   **`auth/`**: Contains authentication-related code.
    *   `__init__.py`: An empty file that makes the `auth` directory a Python package.
    *   `helpers.py`: Helper functions for authentication, such as token management.
    *   `validation_schema.py`: Defines Marshmallow schemas for validating user data during registration and login.
    *   `views.py`: Defines the authentication routes (register, login, refresh, revoke).
*   **`config.py`**: Configuration settings for the application (database URI, JWT secret key, etc.). It uses `python-dotenv` to load settings from the environment.
*   **`env/`**: The virtual environment directory. It contains the Python interpreter and installed packages for your project. This directory should not be committed to version control (hence it is in `.gitignore`).
*   **`extensions.py`**: Initializes and configures Flask extensions (SQLAlchemy, Migrate, Marshmallow, JWT). This avoids circular dependencies.
*   **`instance/`**: Contains instance-specific files, such as the SQLite database (`db.sqlite3`). This directory is often excluded from version control.
*   **`main/`**: Contains the main blueprint for the application.
    *   `__init__.py`: An empty file that makes the `main` directory a Python package.
    *   `main.py`: Defines the main blueprint and a basic route.
*   **`migrations/`**: Contains Alembic migration scripts.
    *   `alembic.ini`: Alembic configuration file.
    *   `env.py`: Alembic environment configuration. It sets up the database connection and metadata for migrations.
    *   `versions/`: Contains the individual migration scripts.
*   **`models/`**: Defines the database models (User, TokenBlocklist).
    *   `__init__.py`: Imports the models and makes them available for use in other parts of the application.
    *   `token.py`: Defines the `TokenBlocklist` model for storing revoked tokens.
    *   `users.py`: Defines the `User` model.
*   **`README.md`**: A description of the project.
*   **`req.txt`**: A list of Python packages required to run the application. You can install these using `pip install -r req.txt`.

## Database Migrations with Flask-Migrate

Flask-Migrate is used to manage database schema changes. Here's how to use it:

1.  **Initialize Migrate:** This is already done in `app.py` and `extensions.py`.

    ```python
    # extensions.py
    from flask_migrate import Migrate
    migrate = Migrate()

    # app.py
    from extensions import migrate
    migrate.init_app(app, db)
    ```

2.  **Create the initial migration repository:**

    ```bash
    flask db init
    ```

    This creates the [migrations](http://_vscodecontentref_/0) directory.

3.  **Create a migration:**

    ```bash
    flask db migrate -m "Initial migration"
    ```

    This command detects changes in your models and generates a migration script in the [versions](http://_vscodecontentref_/1) directory. The `-m` flag adds a message to the migration.

4.  **Upgrade the database:**

    ```bash
    flask db upgrade
    ```

    This applies the migration to your database, updating the schema.

5.  **Downgrade the database:**

    ```bash
    flask db downgrade
    ```

    This reverts the last migration. You can also specify a specific revision to downgrade to.

**Important Notes:**

*   Make sure your Flask application context is available when running these commands. This usually means running them from within your virtual environment and ensuring your Flask app is properly configured.
*   When you make changes to your models, always run [flask db migrate](http://_vscodecontentref_/2) to generate a new migration script.
*   Test your migrations in a development environment before applying them to a production database.

**Example: Adding a new field to the User model**

1.  **Modify the [User](http://_vscodecontentref_/3) model:** Add a new field, for example, `is_active`:

    ```python
    # models/users.py
    from sqlalchemy import Column
    from sqlalchemy.ext.hybrid import hybrid_property

    from extensions import db, pwd_context


    class User(db.Model):
        __tablename__ = "users"
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        name = db.Column(db.String, nullable=False)
        email = db.Column(db.String, unique=True, nullable=False)
        _password = Column("password", db.String(255), nullable=False)
        is_active = db.Column(db.Boolean, default=True)  # New field

        @hybrid_property
        def password(self):
            return self._password

        @password.setter
        def password(self, value):
            self._password = pwd_context.hash(value)
    ```

2.  **Generate a migration:**

    ```bash
    flask db migrate -m "Add is_active field to User model"
    ```

3.  **Upgrade the database:**

    ```bash
    flask db upgrade
    ```

## Adding New Features

Here's a general approach to adding new features to your Flask application:

1.  **Define the Feature:** Clearly define what the feature should do.

2.  **Plan the Implementation:**

    *   **Routes:** Determine the necessary routes (URLs) for the feature.
    *   **Models:** Do you need new database models or changes to existing ones?
    *   **Schemas:** Create Marshmallow schemas for validating input data and serializing output data.
    *   **Business Logic:** Write the code that implements the feature's functionality. This might involve interacting with the database, calling external APIs, or performing calculations.
    *   **Testing:** Write unit tests to ensure the feature works correctly.

3.  **Implement the Feature:**

    *   **Models:** If needed, define new models in the [models](http://_vscodecontentref_/4) directory or modify existing ones. Remember to create migrations for any database changes.
    *   **Schemas:** Create Marshmallow schemas in the appropriate directory (e.g., [validation_schema.py](http://_vscodecontentref_/5) or a new directory for feature-specific schemas).
    *   **Routes and Views:** Create a new blueprint or add routes to an existing blueprint in the [views.py](http://_vscodecontentref_/6) or [main.py](http://_vscodecontentref_/7) or create a new blueprint. Write the view functions to handle the requests.
    *   **Business Logic:** Implement the core logic of the feature in helper functions or within the view functions themselves.
    *   **Register the Blueprint:** Register the new blueprint in [app.py](http://_vscodecontentref_/8).

4.  **Test the Feature:** Write unit tests to verify the feature's functionality.

**Example: Adding a "Profile" Feature**

Let's say you want to add a feature that allows users to view their profile information.

1.  **Plan:**

    *   **Route:** `/auth/profile` (GET request)
    *   **Model:** Use the existing [User](http://_vscodecontentref_/9) model.
    *   **Schema:** Create a `ProfileSchema` to serialize the user's profile data.
    *   **Logic:** Retrieve the user's information from the database based on their ID.

2.  **Implement:**

    *   **Schema:**

        ```python
        # auth/validation_schema.py
        from marshmallow import fields
        from auth.validation_schema import UserSchema


        class ProfileSchema(UserSchema):
            class Meta:
                fields = ("id", "name", "email")  # Fields to include in the profile
        ```

    *   **Route and View:**

        ```python
        # auth/views.py
        from flask_jwt_extended import jwt_required, get_jwt_identity
        from auth.validation_schema import ProfileSchema
        from models import User


        @auth_blueprint.route("/profile", methods=["GET"])
        @jwt_required()
        def get_profile():
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if user is None:
                return jsonify({"msg": "User not found"}), 404

            schema = ProfileSchema()
            return schema.dump(user), 200
        ```

3.  **Test:** Write a unit test to verify that the `/auth/profile` route returns the correct user information.

This is a basic example, and the specific steps will vary depending on the complexity of the feature. Remember to keep your code organized, well-documented, and testable.# supet_agent_backend
