from flask import Blueprint, jsonify


healthcheck_blueprint = Blueprint(
    "healthcheck_blueprint", __name__, url_prefix="/healthcheck"
)


@healthcheck_blueprint.route("/")
def catch_all_1_level():
    # print(home_blueprint.root_path)
    return jsonify({"ok": "ok"})
