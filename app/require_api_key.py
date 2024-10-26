from functools import wraps
from flask import request, jsonify


def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get(
            "X-API-Key"
        )  # Replace with your actual header key

        # Check if the API key is provided and is valid
        if (
            not api_key or api_key != "your_expected_api_key"
        ):  # Replace with your actual validation logic
            return (
                jsonify(
                    {"error": "Unauthorized access, API key is missing or invalid"}
                ),
                401,
            )

        return f(*args, **kwargs)

    return decorated_function
