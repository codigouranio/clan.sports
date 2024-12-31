"""Initialize Flask app."""

import base64
import logging
import os
import secrets
from datetime import timedelta
from os import environ, path
from authlib.integrations.flask_client import OAuth

from dependency_injector.wiring import Provide, inject
from flask import Flask, g, json, session
from flask_assets import Environment
from flask_caching import Cache
from flask_compress import Compress
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
from app.api.xHubDatabase import XHubDatabase
from app.appInfo import AppInfo

from . import heartbeat_routes, home_routes
from .api.models import Base
from .container import Container

"""Create Flask application."""
app = Flask(__name__, instance_relative_config=False)


def create_app():

    allowed_origins = ["http://localhost:5000", "https://clansports.club"]

    # Configure CORS to only allow requests from specified origins
    CORS(app, resources={r"/*": {"origins": allowed_origins}})

    csp = {
        "default-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "*.googleapis.com"],
        "script-src": ["'self'"],
        "script-src-elem": ["'self'", "*.googletagmanager.com"],
        "connect-src": ["'self'", "*.openstreetmap.org", "*.google-analytics.com"],
        "img-src": [
            "'self'",
            "data:",
            "blob:",
            "*.svgrepo.com",
            "*.googletagmanager.com",
        ],
        "font-src": ["'self'", "fonts.gstatic.com"],
    }

    Talisman(
        app,
        content_security_policy=csp,
        content_security_policy_nonce_in=["script-src", "script-src-elem"],
    )

    Compress(app)

    app.limiter = Limiter(
        get_remote_address,  # Utiliza la dirección IP del cliente
        app=app,
        default_limits=["2000 per day", "200 per hour"],  # Límites por defecto
    )

    app.info = AppInfo()

    app.config.from_pyfile(
        path.join("..", "config.{}.py".format(environ.get("ENVIRONMENT", "dev")))
    )
    app.config["SEC_REPO_TOKEN"] = environ.get("SEC_REPO_TOKEN")
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000

    app.logger.setLevel(app.config.get("LOGGER_LEVEL"))

    app.container = Container()
    app.container.config.from_dict(app.config)

    # print(app.container.config.get("USER_POOL_ID"))

    app.container.init_resources()
    app.container.wire(modules=[__name__])

    app.login_manager = LoginManager()
    app.login_manager.init_app(app)

    app.secret_key = os.urandom(24)  # Use a secure random key in production
    oauth = OAuth(app)

    oauth.register(
        name="oidc",
        authority="https://cognito-idp.us-east-2.amazonaws.com/us-east-2_wOCQFFzH6",
        client_id="43eb07uj4bm4qci6c2926u644f",
        client_secret="<client secret>",
        server_metadata_url="https://cognito-idp.us-east-2.amazonaws.com/us-east-2_wOCQFFzH6/.well-known/openid-configuration",
        client_kwargs={"scope": "phone openid email"},
    )

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

        app.limiter.exempt(pages_routes.pages_blueprint)
        app.limiter.exempt(heartbeat_routes.heartbeat_blueprint)

        return app

        # @app.before_request  # runs before FIRST request (only once)
        # def catch_all_requests():
        #     session.permanent = True
        #     app.permanent_session_lifetime = timedelta(minutes=5)
