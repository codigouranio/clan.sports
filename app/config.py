"""Class-based Flask app configuration."""

from os import environ


class Config:
    """Configuration from environment variables."""

    # General Config
    ENVIRONMENT = environ.get("ENVIRONMENT") or "dev"

    GITHUB_TOKEN = environ.get("GITHUB_TOKEN")

    # Static Assets
    STATIC_FOLDER = "static"
    TEMPLATES_FOLDER = "templates"

    # UI APP
    UI_APP_STATIC_FOLDER = "./build"
