"""Initialize Flask app."""

import logging
from datetime import timedelta
from os import environ

from dependency_injector.wiring import Provide, inject
from flask import Flask, json, session
from flask_assets import Environment
from flask_cors import CORS
from flask_login import LoginManager
from sqlalchemy import create_engine

from flask_session import Session

from . import heartbeat_routes, home_routes

from .container import Container


def create_app():
    """Create Flask application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_pyfile("../config.py")
    app.logger.setLevel(app.config.get("LOGGER_LEVEL"))

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
        from . import pages_routes
        from . import api_routes

        # from .ui import ui
        # Register Blueprints
        app.register_blueprint(pages_routes.pages_blueprint)
        app.register_blueprint(api_routes.api_blueprint)
        app.register_blueprint(home_routes.home_blueprint)
        app.register_blueprint(heartbeat_routes.heartbeat_blueprint)

        return app
