from flask import Blueprint, jsonify


heartbeat_blueprint = Blueprint(
    "heartbeat_blueprint", __name__, static_url_path="/", url_prefix="/"
)


@heartbeat_blueprint.route("/heartbeat")
def heartbeat():
    return jsonify({"status": "healthy"})
