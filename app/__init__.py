"""Initialize Flask app."""

import logging
from datetime import timedelta

from dependency_injector.wiring import Provide, inject
from flask import Flask, session
from flask_assets import Environment
from flask_cors import CORS
from flask_login import LoginManager
from sqlalchemy import create_engine

from flask_session import Session

from .container import Container


def create_app():
    """Create Flask application."""
    app = Flask(__name__, instance_relative_config=False)

    app.logger.setLevel(logging.DEBUG)

    app.config["SESSION_PERMANENT"] = True
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=5)
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True

    app.config.from_object("config.Config")

    app.container = Container()
    app.container.init_resources()
    app.container.wire(modules=[__name__])

    CORS(app)
    Session(app)

    assets = Environment()
    assets.init_app(app)

    Session(app)

    app.login_manager = LoginManager()
    app.login_manager.init_app(app)

    @app.before_request  # runs before FIRST request (only once)
    def catch_all_requests():
        # session.permanent = True
        # app.permanent_session_lifetime = timedelta(minutes=5)
        return

    with app.app_context():
        # Import parts of our application
        from .api import api
        from .home import home
        from .ui import ui

        # Register Blueprints
        app.register_blueprint(home.home_blueprint)
        app.register_blueprint(api.api_blueprint)
        app.register_blueprint(ui.ui_blueprint)

        return app
