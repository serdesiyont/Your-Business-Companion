from flask import Blueprint

main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/')
def method_name():
    return "<h1> Currently done, /login /register method post </h1>"


