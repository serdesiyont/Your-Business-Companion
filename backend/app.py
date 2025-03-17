from flask import Flask
from flask_cors import CORS
from auth.views import auth_blueprint
from main.main import main_blueprint
from views.calculates_taxes import tax_blueprint
from views.expenses import expense_blueprint
from views.products import product_blueprint
from views.profit_loss import profit_loss_blueprint
from views.reports import report_blueprint
from views.sales import sale_blueprint
from views.stores import store_blueprint
from views.taxes import tax_storage_blueprint
from extensions import db, migrate, jwt, swagger
from agent.views import agent
from reports.product_performance import product_performance_bp
from agent.recommendation import recommendation_bp



app = Flask(__name__)
app.config.from_object("config")
CORS(app)
app.register_blueprint(auth_blueprint) 
app.register_blueprint(agent)
app.register_blueprint(tax_blueprint)
app.register_blueprint(expense_blueprint)
app.register_blueprint(product_blueprint)
app.register_blueprint(profit_loss_blueprint)
app.register_blueprint(report_blueprint)
app.register_blueprint(sale_blueprint)
app.register_blueprint(store_blueprint)
app.register_blueprint(tax_storage_blueprint)
app.register_blueprint(main_blueprint)
app.register_blueprint(product_performance_bp)
app.register_blueprint(recommendation_bp)
db.init_app(app)
 

migrate.init_app(app, db)
jwt.init_app(app)
swagger.init_app(app)


if __name__ == "__main__":
    app.run(
        host=app.config.get("FLASK_RUN_HOST"),
        port=app.config.get("FLASK_RUN_PORT"),
        debug=True
    )