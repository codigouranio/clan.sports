# https://gist.github.com/bradtraversy/1c93938c1fe4f10d1e5b0532ae22e16a

# Vanilla Site for login, registration and landing page

from flask import Blueprint, Flask
from flask import current_app as app
from flask import current_app as app1
from flask import (
    jsonify,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from flask_login import LoginManager, current_user, login_required
from werkzeug.utils import safe_join

# Blueprint Configuration
pages_blueprint = Blueprint(
    "pages_blueprint",
    __name__,
    template_folder="./pages/build",
    static_folder="./pages/build",
    static_url_path="/",
    url_prefix="/",
)


@pages_blueprint.route("/letmein", methods=["GET"])
def letmein() -> str:
    if current_user.is_authenticated:
        return redirect("/app")
    return render_template(
        "letmein.html",
        title="Let Me In",
        template="letmein-template",
        test={"test": "test"},
    )


@pages_blueprint.route("/letmeleave", methods=["GET"])
def letmeleave() -> str:
    return render_template(
        "letmeleave.html",
        title="Let Me In",
        template="letmeleave-template",
        test={"test": "test"},
    )


@pages_blueprint.route("/", methods=["GET"])
def index() -> str:
    return render_template(
        "index.html", title="Test", template="index-template", test={"test": "test"}
    )


@pages_blueprint.route("/test", methods=["GET"])
def test() -> str:
    return render_template(
        "test.html", title="Test", template="test-template", test={"test": "test"}
    )


@pages_blueprint.errorhandler(404)
def not_found(e):
    return render_template(
        "404.html", title="Not Found", template="404.html", test={"test": "test"}
    )


# # app name
# @app.errorhandler(404)
# def not_found(e):
#     return render_template("404.html")
