# import inspect
# from models.expense import Expense
# from models.products import Product
# from models.sale import Sale
# from models.tax import Tax
# from models.users import User
# from agent.tools import *
# from agent.crud_tools import *

# def generate_agent_context() -> str:
#     """
#     Generates a comprehensive context string for the LLM agent, including:
#         - Database schema information.
#         - Descriptions of all available functions (tools), including their purpose, arguments, and return types.
#         - Instructions on how to generate new functions if existing ones are not suitable.

#     Returns:
#         str: A comprehensive context string for the LLM agent.
#     """

#     database_context = """
#     You are working with a database for a business management application. Here's the schema:

#     Tables:

#     - users:
#         - id (INTEGER, PRIMARY KEY): User ID
#         - name (TEXT): User's name
#         - email (TEXT): User's email
#         - is_active (BOOLEAN): User's active status

#     - products:
#         - id (INTEGER, PRIMARY KEY): Product ID
#         - product_name (TEXT): Product name
#         - description (TEXT): Product description
#         - initial_stock (INTEGER): Initial stock level
#         - price (TEXT): Product price
#         - category (TEXT): Product category
#         - user_id (INTEGER, FOREIGN KEY referencing users.id): User who owns the product

#     - sales:
#         - id (INTEGER, PRIMARY KEY): Sale ID
#         - product_id (INTEGER, FOREIGN KEY referencing products.id): Product sold
#         - quantity (INTEGER): Quantity sold
#         - sale_date (DATETIME): Date of sale
#         - sale_price (REAL): Price per unit at the time of sale
#         - user_id (INTEGER, FOREIGN KEY referencing users.id): User who made the sale

#     - expenses:
#         - id (INTEGER, PRIMARY KEY): Expense ID
#         - description (TEXT): Expense description
#         - amount (REAL): Expense amount
#         - date (DATETIME): Date of expense
#         - category (TEXT): Expense category
#         - user_id (INTEGER, FOREIGN KEY referencing users.id): User who incurred the expense

#     - taxes:
#         - id (INTEGER, PRIMARY KEY): Tax ID
#         - user_id (INTEGER, FOREIGN KEY referencing users.id): User who the tax applies to
#         - tax_rate (REAL): Tax rate
#         - tax_amount (REAL): Tax amount
#         - tax_date (DATETIME): Date the tax was applied
#         - description (TEXT): Description of the tax

#     Relationships:

#     - One user can have multiple products (one-to-many)
#     - One user can have multiple sales (one-to-many)
#     - One product can have multiple sales (one-to-many)
#     - One user can have multiple expenses (one-to-many)
#     - One user can have multiple tax records (one-to-many)

#     When querying, always filter by user_id to get data relevant to the current user.
#     """

#     function_descriptions = """
#     Here are descriptions of the available functions (tools) that you can use:
#     """
#     # Dynamically gather functions from the global scope
#     for name, obj in globals().items():
#         if callable(obj) and hasattr(obj, '__name__') and obj.__module__ not in ['flask.app', 'sqlalchemy.orm.decl_api']:
#             try:
#                 signature = inspect.signature(obj)
#                 docstring = inspect.getdoc(obj)
#                 function_descriptions += f"""
#                 Function Name: {name}
#                 Description: {docstring or "No description provided."}
#                 Arguments: {signature}
#                 """ + "\n"
#             except Exception as e:
#                 function_descriptions += f"""
#                 Function Name: {name}
#                 Could not retrieve signature or docstring due to: {e}
#                 """ + "\n"

#     # Add example functions from calculates_taxes.py, profit_loss.py, and reports.py
#     example_functions = """
#     Here are some example functions that demonstrate how to interact with the database and perform calculations:

#     # Example functions from calculates_taxes.py
#     def calculate_taxes(user_id: int, tax_rate: float) -> dict:
#         \"\"\"Calculates total sales and taxes for a given user.\"\"\"
#         sales = Sale.query.filter_by(user_id=user_id).all()
#         total_sales = 0
#         total_taxes = 0
#         for sale in sales:
#             sale_amount = sale.quantity * sale.sale_price
#             total_sales += sale_amount
#             total_taxes += sale_amount * tax_rate
#         return {
#             'user_id': user_id,
#             'total_sales': total_sales,
#             'total_taxes': total_taxes,
#             'tax_rate': tax_rate * 100 #return as percentage.
#         }

#     def calculate_product_taxes(product_id: int, user_id: int, tax_rate: float) -> dict:
#         \"\"\"Calculates taxes for a specific product sold by a given user.\"\"\"
#         sales = Sale.query.filter_by(product_id=product_id, user_id=user_id).all()
#         total_sales = 0
#         total_taxes = 0
#         for sale in sales:
#             sale_amount = sale.quantity * sale.sale_price
#             total_sales += sale_amount
#             total_taxes += sale_amount * tax_rate
#         return {
#             'product_id': product_id,
#             'user_id': user_id,
#             'total_sales': total_sales,
#             'total_taxes': total_taxes,
#             'tax_rate': tax_rate * 100 #return as percentage.
#         }

#     def calculate_taxes_by_date(user_id: int, tax_rate: float, start_date: str, end_date: str) -> dict:
#         \"\"\"Calculate taxes between two dates.\"\"\"
#         start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
#         end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
#         sales = Sale.query.filter(Sale.sale_date >= start_date_dt, Sale.sale_date <= end_date_dt, Sale.user_id == user_id).all()
#         total_sales = 0
#         total_taxes = 0
#         for sale in sales:
#             sale_amount = sale.quantity * sale.sale_price
#             total_sales += sale_amount
#             total_taxes += sale_amount * tax_rate
#         return {
#             'start_date': start_date,
#             'end_date': end_date,
#             'user_id': user_id,
#             'total_sales': total_sales,
#             'total_taxes': total_taxes,
#             'tax_rate': tax_rate * 100 #return as percentage.
#         }

#     # Example functions from profit_loss.py
#     def calculate_profit_loss(user_id: int) -> dict:
#         \"\"\"Calculates total profit or loss for a user.\"\"\"
#         sales = Sale.query.filter_by(user_id=user_id).all()
#         expenses = Expense.query.filter_by(user_id=user_id).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         total_expenses = sum(expense.amount for expense in expenses)
#         profit_loss = total_sales - total_expenses
#         return {
#             'user_id': user_id,
#             'total_sales': total_sales,
#             'total_expenses': total_expenses,
#             'profit_loss': profit_loss,
#         }

#     def calculate_profit_loss_by_date(user_id: int, start_date: str, end_date: str) -> dict:
#         \"\"\"Calculates profit or loss for a user between two dates.\"\"\"
#         start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
#         end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
#         sales = Sale.query.filter(Sale.user_id == user_id, Sale.sale_date >= start_date_dt, Sale.sale_date <= end_date_dt).all()
#         expenses = Expense.query.filter(Expense.user_id == user_id, Expense.date >= start_date_dt, Expense.date <= end_date_dt).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         total_expenses = sum(expense.amount for expense in expenses)
#         profit_loss = total_sales - total_expenses
#         return {
#             'user_id': user_id,
#             'start_date': start_date,
#             'end_date': end_date,
#             'total_sales': total_sales,
#             'total_expenses': total_expenses,
#             'profit_loss': profit_loss,
#         }

#     # Example functions from reports.py
#     def get_weekly_sales(user_id: int) -> dict:
#         \"\"\"Calculates total sales and sale count for a user this week.\"\"\"
#         today = datetime.now().date()
#         start_of_week = today - timedelta(days=today.weekday())
#         end_of_week = start_of_week + timedelta(days=6)
#         sales = Sale.query.filter(Sale.user_id == user_id, func.date(Sale.sale_date) >= start_of_week, func.date(Sale.sale_date) <= end_of_week).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         sale_count = len(sales)
#         return {
#             'user_id': user_id,
#             'start_of_week': start_of_week.isoformat(),
#             'end_of_week': end_of_week.isoformat(),
#             'total_sales': total_sales,
#             'sale_count': sale_count
#         }

#     def get_monthly_sales(user_id: int, year: int, month: int) -> dict:
#         \"\"\"Calculates total sales and sale count for a user in a specific month.\"\"\"
#         sales = Sale.query.filter(Sale.user_id == user_id, extract('year', Sale.sale_date) == year, extract('month', Sale.sale_date) == month).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         sale_count = len(sales)
#         return {
#             'user_id': user_id,
#             'year': year,
#             'month': month,
#             'total_sales': total_sales,
#             'sale_count': sale_count
#         }

#     def get_weekly_profit_loss(user_id: int) -> dict:
#         \"\"\"Calculates profit/loss for a user this week.\"\"\"
#         today = datetime.now().date()
#         start_of_week = today - timedelta(days=today.weekday())
#         end_of_week = start_of_week + timedelta(days=6)
#         sales = Sale.query.filter(Sale.user_id == user_id, func.date(Sale.sale_date) >= start_of_week, func.date(Sale.sale_date) <= end_of_week).all()
#         expenses = Expense.query.filter(Expense.user_id == user_id, func.date(Expense.date) >= start_of_week, func.date(Expense.date) <= end_of_week).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         total_expenses = sum(expense.amount for expense in expenses)
#         profit_loss = total_sales - total_expenses
#         return {
#             'user_id': user_id,
#             'start_of_week': start_of_week.isoformat(),
#             'end_of_week': end_of_week.isoformat(),
#             'total_sales': total_sales,
#             'total_expenses': total_expenses,
#             'profit_loss': profit_loss
#         }

#     def get_monthly_profit_loss(user_id: int, year: int, month: int) -> dict:
#         \"\"\"Calculates profit/loss for a user in a specific month.\"\"\"
#         sales = Sale.query.filter(Sale.user_id == user_id, extract('year', Sale.sale_date) == year, extract('month', Sale.sale_date) == month).all()
#         expenses = Expense.query.filter(Expense.user_id == user_id, extract('year', Expense.date) == year, extract('month', Expense.date) == month).all()
#         total_sales = sum(sale.quantity * sale.sale_price for sale in sales)
#         total_expenses = sum(expense.amount for expense in expenses)
#         profit_loss = total_sales - total_expenses
#         return {
#             'user_id': user_id,
#             'year': year,
#             'month': month,
#             'total_sales': total_sales,
#             'total_expenses': total_expenses,
#             'profit_loss': profit_loss
#         }

#     def analyze_sales_performance_orm() -> dict:
#         \"\"\"Analyzes sales data to identify top and bottom-performing products using SQLAlchemy ORM.\"\"\"
#         results = db.session.query(Product.product_name, db.func.sum(Sale.sale_price).label('total_sales')).join(Sale, Product.id == Sale.product_id).group_by(Product.product_name).order_by(db.func.sum(Sale.sale_price).desc()).all()
#         df = pd.DataFrame(results, columns=['product_name', 'total_sales'])
#         num_products = min(5, len(df))
#         top_products = df.head(num_products).to_dict(orient='records')
#         bottom_products = df.tail(num_products).to_dict(orient='records')
#         return {
#             'top_products': top_products,
#             'bottom_products': bottom_products
#         }
#     """

#     instructions = """
#     If the existing functions are not sufficient to fulfill the user's request, you can generate new Python functions.
#     When generating new functions:
#         - Ensure they are valid Python code.
#         - Include a docstring explaining the function's purpose, arguments, and return type.
#         - Use the database schema information to construct valid queries.
#         - If the function is for querying the database, use SQLAlchemy ORM to interact with the database.
#         - The new function should be able to be called directly with the user ID as an argument.
#         - Add the function's description, including its name, arguments, and docstring, to the context for future use.
#         - You can import from the models using this imports statements (
#                     from models.expense import Expense
#                     from models.products import Product
#                     from models.sale import Sale
#                     from models.tax import Tax
#                     from models.users import User )
#     You should respond with the Python code to execute, or the name of the existing function to use.
#     """

#     full_context = database_context + "\n" + function_descriptions + "\n" + example_functions + "\n" + instructions
#     return full_context