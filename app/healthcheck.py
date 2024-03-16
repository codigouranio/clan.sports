from flask import Blueprint, jsonify


healthcheck_blueprint = Blueprint(
    "healthcheck_blueprint", __name__, url_prefix="/healthcheck"
)


@healthcheck_blueprint.route("/")
def healthcheck():
    # print(home_blueprint.root_path)
    return jsonify({"ok": "ok"})
