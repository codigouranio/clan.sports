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

# Blueprint Configuration
react_app_blueprint = Blueprint(
    "react_app_blueprint",
    __name__,
    url_prefix="/app",
    static_folder=app.config.get("UI_APP_STATIC_FOLDER"),
    static_url_path="",
)


@react_app_blueprint.route("/", defaults={"path": "index.html"})
@react_app_blueprint.route("/<string:path>")
def catch_all(path):
    return react_app_blueprint.send_static_file(path)


@react_app_blueprint.route("/static/<string:path_1>/<string:path>")
def catch_all_1_level(path_1, path):
    # print(home_blueprint.root_path)
    return react_app_blueprint.send_static_file(safe_join("./static/", path_1, path))
