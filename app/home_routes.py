# https://medium.com/@steve.2.farrington/how-to-extend-create-react-app-for-multi-page-applications-4f9c0fb0710c
# https://medium.com/@shriharim006/code-splitting-in-react-optimize-performance-by-splitting-your-code-e3e70d0c3d91
# https://www.codemzy.com/blog/react-bundle-size-webpack-code-splitting
# https://ui.shadcn.com/

"""General page routes."""

from flask import Blueprint, Flask
from flask import current_app as app
from flask import (
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


@home_blueprint.route("/", defaults={"path": "index.html"})
@home_blueprint.route("/<string:path>")
def catch_all(path):
    return home_blueprint.send_static_file(path)


@home_blueprint.errorhandler(404)
def not_found(e):
    return home_blueprint.send_static_file("index.html")


# @home_blueprint.route("/profile/<string:id>")
# def catch_all_more_level(id=None):
#     return home_blueprint.send_static_file("index.html")


# @home_blueprint.route("/profile/main.js")
# def catch_all_more_level():
#     return home_blueprint.send_static_file("main.js")


# @home_blueprint.route("/<string:path_1>/<string:path_2>")
# def catch_all_more_level(path=None, path_2=None):
#     return redirect(url_for("home_blueprint.catch_all"))


# @home_blueprint.route("/<string:path_1>/<string:path_2>/<string:path_3>")
# def catch_all_beyond_level(path_1=None, path_2=None, path_3=None):
#     return "hola"


# @home_blueprint.route("/static/<string:path_1>/<string:path_2>")
# def catch_static_1_level(path_1, path_2):
#     return home_blueprint.send_static_file(safe_join("./static/", path_1, path_2))


# @home_blueprint.route("/static/<string:path_1>/<string:path_2>/<string:path_3>")
# def catch_static_2_level(path_1, path_2, path_3):
#     return home_blueprint.send_static_file(
#         safe_join("./static/", path_1, path_2, path_3)
#     )
