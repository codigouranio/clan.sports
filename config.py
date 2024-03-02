"""Class-based Flask app configuration."""

import subprocess
from os import environ, path

from dotenv import load_dotenv

# from .container import Container

BASE_DIR = path.abspath(path.dirname(__file__))
load_dotenv(path.join(BASE_DIR, ".env"))


class Config:
    """Configuration from environment variables."""

    # General Config\
    ENVIRONMENT = environ.get("ENVIRONMENT")

    # Flask Config
    SECRET_KEY = environ.get("SECRET_KEY")
    FLASK_DEBUG = environ.get("FLASK_DEBUG")
    FLASK_APP = "wsgi.py"

    DATABASE = "sqlite:///database.db"

    # Static Assets
    STATIC_FOLDER = "static"
    TEMPLATES_FOLDER = "templates"
    COMPRESSOR_DEBUG = False

    # UI APP
    UI_APP_STATIC_FOLDER = "./build"
