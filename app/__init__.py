"""Initialize Flask app."""

import logging
from datetime import timedelta
from os import environ, path

from dependency_injector.wiring import Provide, inject
from flask import Flask, json, session
from flask_assets import Environment
from flask_caching import Cache
from flask_cors import CORS
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from . import heartbeat_routes, home_routes
from .api.models import Base
from .container import Container


def create_app():
    """Create Flask application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_pyfile(
        path.join("..", "config.{}.py".format(environ.get("ENVIRONMENT", "dev")))
    )
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000

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

        return app

        # @app.before_request  # runs before FIRST request (only once)
        # def catch_all_requests():
        #     session.permanent = True
        #     app.permanent_session_lifetime = timedelta(minutes=5)
