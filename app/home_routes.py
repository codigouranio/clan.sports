# https://medium.com/@steve.2.farrington/how-to-extend-create-react-app-for-multi-page-applications-4f9c0fb0710c
# https://medium.com/@shriharim006/code-splitting-in-react-optimize-performance-by-splitting-your-code-e3e70d0c3d91
# https://www.codemzy.com/blog/react-bundle-size-webpack-code-splitting
# https://ui.shadcn.com/

"""General page routes."""

import base64
import os

from flask import Blueprint, Flask
from flask import current_app as app
from flask import (
    g,
    jsonify,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from werkzeug.utils import safe_join

#  app.config.get("UI_APP_STATIC_FOLDER")

# Blueprint Configuration
home_blueprint = Blueprint(
    "home_blueprint",
    __name__,
    url_prefix="/app",
    static_folder="./home/build",
    static_url_path="",
)


# @home_blueprint.route("/<page_name>")
# def serve_page(page_name):
#     return render_template(f"{page_name}.html")


# @home_blueprint.route("/", defaults={"path": "index.html"})
# @home_blueprint.route("/<string:path>")
# def catch_all(path):
#     return home_blueprint.send_static_file(path)


@home_blueprint.errorhandler(404)
def not_found(e):
    return home_blueprint.send_static_file("index.html")


@home_blueprint.route("/error")
def trigger_error():
    raise Exception("This is a test error!")
