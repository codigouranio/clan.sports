"""Initialize Flask app."""

import base64
import logging
import os
from datetime import timedelta
from os import environ, path

from dependency_injector.wiring import Provide, inject
from flask import Flask, g, json, session
from flask_assets import Environment
from app.appInfo import AppInfo
from flask_caching import Cache
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_talisman import Talisman
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.api.databaseJupyter import DatabaseJupyter

from . import heartbeat_routes, home_routes
from .api.models import Base
from .container import Container

"""Create Flask application."""
app = Flask(__name__, instance_relative_config=False)


def generate_nonce():
    return base64.b64encode(os.urandom(16)).decode("utf-8")


@app.before_request
def set_nonce():
    g.nonce = generate_nonce()  # Store nonce in `g` for the request


@app.after_request
def set_csp(response):
    response.headers["Content-Security-Policy"] = (
        f"default-src 'self'; "
        f"style-src 'self' 'unsafe-inline'; "
        f"connect-src 'self' https://nominatim.openstreetmap.org;"
        f"img-src 'self' data:;"
    )
    return response


def create_app():

    allowed_origins = ["http://localhost:5000", "https://clansports.club"]

    # Configure CORS to only allow requests from specified origins
    CORS(app, resources={r"/*": {"origins": allowed_origins}})

    Talisman(app, content_security_policy={"default-src": ["'self'"]})

    limiter = Limiter(
        get_remote_address,  # Utiliza la dirección IP del cliente
        app=app,
        # default_limits=["1 per day", "1 per hour"],  # Límites por defecto
        default_limits=["200 per day", "50 per hour"],  # Límites por defecto
    )

    app.info = AppInfo()

    app.config.from_pyfile(
        path.join("..", "config.{}.py".format(environ.get("ENVIRONMENT", "dev")))
    )
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000
    app.config["SEC_REPO_TOKEN"] = environ.get("SEC_REPO_TOKEN")

    if not app.config["SEC_REPO_TOKEN"]:
        print("Please set SEC_REPO_TOKEN environment variable")

    app.logger.setLevel(app.config.get("LOGGER_LEVEL"))

    app.container = Container()
    app.container.init_resources()
    app.container.wire(modules=[__name__])

    app.login_manager = LoginManager()
    app.login_manager.init_app(app)

    app.assets = Environment()
    app.assets.init_app(app)

    app.db = SQLAlchemy(model_class=Base)
    app.db.init_app(app)

    app.ma = Marshmallow(app)

    app.cache = Cache(app)

    # load data from git repo
    app.database_jupyter = DatabaseJupyter(app)

    with app.app_context():
        app.config["SESSION_SQLALCHEMY"] = app.db

        # app.db.create_all()

        Session(app)
        CORS(app)

        from . import api_routes, pages_routes

        # Register Blueprints
        app.register_blueprint(pages_routes.pages_blueprint)
        app.register_blueprint(api_routes.api_blueprint)
        app.register_blueprint(home_routes.home_blueprint)
        app.register_blueprint(heartbeat_routes.heartbeat_blueprint)

        limiter.exempt(pages_routes.pages_blueprint)
        limiter.exempt(heartbeat_routes.heartbeat_blueprint)

        return app

        # @app.before_request  # runs before FIRST request (only once)
        # def catch_all_requests():
        #     session.permanent = True
        #     app.permanent_session_lifetime = timedelta(minutes=5)
