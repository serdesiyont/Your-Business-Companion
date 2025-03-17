from flask import request, jsonify, Blueprint, make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies
)


from auth.validation_schema import UserCreateSchema, UserSchema
from flask import current_app as app
from auth.helpers import revoke_token, is_token_revoked, add_token_to_database
from extensions import pwd_context, jwt, db
from models.users import User

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/register", methods=["POST"])
def register():
    """
    Register a new user.
    ---
    post:
      summary: Register a new user.
      requestBody:
        required: true
        content:
          application/json:
            schema: UserCreateSchema
      responses:
        200:
          description: User created successfully.
          content:
            application/json:
              schema: UserSchema
        400:
          description: Bad request (e.g., missing JSON).
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    schema = UserCreateSchema()
    user = schema.load(request.get_json())
    db.session.add(user)
    db.session.commit()

    schema = UserSchema()

    return {"msg": "User created", "user": schema.dump(user)}


@auth_blueprint.route("/login", methods=["POST"])
def login():
    """
    Login a user and return access and refresh tokens.
    ---
    post:
      summary: Login a user.
      requestBody:
        required: true
        content:
          application/json:
            schema: UserSchema
      responses:
        200:
          description: Login successful. Returns access and refresh tokens.
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  refresh_token:
                    type: string
        401:
          description: Invalid credentials.
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if not user or not pwd_context.verify(password, user.password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    response = jsonify({"msg": "Login Successful"})
    set_access_cookies(response, access_token )
    set_refresh_cookies(response, refresh_token)

    return response, 200




@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh an access token.
    ---
    post:
      summary: Refresh an access token using a refresh token.
      responses:
        200:
          description: Access token refreshed successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
        401:
          description: Invalid refresh token.
    """
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    response = jsonify({"access_token": access_token})
    set_access_cookies(response, access_token)
    return response, 200


@auth_blueprint.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    """
    Revoke an access token.
    ---
    delete:
      summary: Revoke an access token.
      security:
        - jwt: []
      responses:
        200:
          description: Access token revoked successfully.
    """
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    revoke_token(jti, user_identity)
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@auth_blueprint.route("/revoke_refresh", methods=["DELETE"])
@jwt_required(refresh=True)
def revoke_refresh_token():
    """
    Revoke a refresh token.
    ---
    delete:
      summary: Revoke a refresh token.
      security:
        - jwt: []
      responses:
        200:
          description: Refresh token revoked successfully.
    """
    jti = get_jwt()["jti"]
    user_identity = get_jwt_identity()
    revoke_token(jti, user_identity)
    return jsonify({"message": "token revoked"}), 200


@jwt.user_lookup_loader
def user_loader_callback(jwt_headers, jwt_payload):
    """
    User lookup callback for JWT.
    """
    identity = jwt_payload[app.config["JWT_IDENTITY_CLAIM"]]
    return User.query.get(identity)


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_headers, jwt_payload):
    """
    Check if a token is revoked.
    """
    return is_token_revoked(jwt_payload)