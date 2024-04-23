# https://flask-login.readthedocs.io/en/latest/
# https://testdriven.io/blog/flask-sessions/
# https://docs.sqlalchemy.org/en/20/core/type_basics.html#sqlalchemy.types.DateTime
# https://www.digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login

from io import BytesIO
import random
from datetime import datetime, timedelta
from http import HTTPStatus
import uuid

from dependency_injector.wiring import Provide, inject
from flask import Blueprint, abort, send_file
from flask import current_app as app
from flask import flash, jsonify, redirect, request, session, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from sqlalchemy.orm import Session, scoped_session, sessionmaker
from PIL import Image
import qrcode

from app.api.schemas import ProfileSchema, ProfileTypeSchema, UserSchema

from .api.models import Base, Profile, ProfileType, RequestCode, User
from .api.repo import Repo
from .api.sessions import Sessions
from .api.smsService import SmsService
from .api.utils import generate_session_id, generate_sha256_hash

api_blueprint = Blueprint("api", __name__, url_prefix="/api")
# smsService: SmsService = app.container.smsService()
# ssmClient = app.container.ssmClient()

# try:
#     print(
#         ssmClient.get_parameter(Name="/clan.sports.club/staging/test")["Parameter"][
#             "Value"
#         ]
#     )
# except:
#     print("An exception occurred")


@api_blueprint.route("/test", methods=["GET"])
def test():
    return jsonify({"success": True})


@api_blueprint.route("/requestCode", methods=["POST"])
def requestCode():
    # with Session(app.engine) as db:
    phoneNumber = request.get_json(force=True)["phoneNumber"]
    code = "{:06d}".format(random.randint(0, 999999))
    today = datetime.now()
    sessionExpires = today + timedelta(seconds=90)
    sessionId = generate_sha256_hash(generate_session_id())
    app.db.session.add(
        RequestCode(
            code=code,
            sessionId=sessionId,
            expires=sessionExpires,
            phoneNumber=phoneNumber,
        )
    )
    app.db.session.commit()
    # smsService.send(
    #     phoneNumber=phoneNumber, message=f"Clan Sports code: {0}".format(code)
    # )
    return jsonify(
        {
            "code": code,
            "sessionExpires": sessionExpires,
            "sessionId": sessionId,
            "phoneNumber": phoneNumber,
        }
    )


@api_blueprint.route("/checkCode", methods=["POST"])
def checkCode():
    data = request.get_json(force=True)
    code = (
        app.db.session.query(RequestCode)
        .filter_by(code=data["code"], sessionId=data["sessionId"])
        .first()
    )
    if not code or code.expires < datetime.now():
        return jsonify({"success": False})

    user = app.db.session.query(User).filter_by(phone_number=code.phoneNumber).first()
    if not user:
        print("adding user to db")
        user = User(phone_number=code.phoneNumber, email_address="")
        app.db.session.add(user)
        app.db.session.commit()

    login_user(user, remember=True, duration=timedelta(days=60), force=True, fresh=True)
    flash("Logged in successfully.")
    return jsonify({"success": True})


@app.login_manager.user_loader
def load_user(user_id):
    user = app.db.session.query(User).filter_by(id=user_id).first()
    return user


@api_blueprint.route("/currentUser", methods=["GET"])
@login_required
def getCurrentUser():
    return UserSchema().dump(current_user)


@api_blueprint.route("/profiles")
@login_required
def get_profiles():
    all_profiles = app.db.session.query(Profile).all()
    res = {}
    for profile in all_profiles:
        p = ProfileSchema().dump(profile)
        # res.append({"%s" % (profile.unique_id): p})
        res[profile.unique_id] = p
    return jsonify({"items": {"profiles": res}})


@api_blueprint.route("/profileTypes", methods=["GET"])
@login_required
def get_list_profile_types():
    items = app.db.session.query(ProfileType).all()
    return ProfileTypeSchema(many=True).dump(items)


@api_blueprint.route("/profiles", methods=["POST"])
@login_required
def add_profile():
    try:
        data = request.get_json(force=True)
        new_profile = Profile(
            user_id=current_user.id,
            unique_id=str(uuid.uuid4()),
            profile_type_code=data["profile_type_code"],
            name=data["name"],
            last_name=data["last_name"],
            bio=data.get("bio", ""),  # Providing a default value for optional fields
            street_address=data.get("street_address", ""),
            city=data.get("city", ""),
            state_province=data.get("state_province", ""),
            postal_code=data.get("postal_code", ""),
            country=data.get("country", ""),
        )
        app.db.session.add(new_profile)
        app.db.session.commit()
        # {"message": "Profile added successfully", "profile_id": new_profile.id}
        return (
            jsonify(
                {
                    "added_profile": {
                        "success": True,
                        "profile_id": new_profile.id,
                        "profile_type_name": new_profile.get_profile_type_name(
                            app.db.session
                        ),
                    }
                }
            ),
            201,
        )
    except KeyError as e:
        return jsonify({"error": "Missing required field: {}".format(str(e))}), 400
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "An error occurred while adding the profile: {}".format(
                        str(e)
                    )
                }
            ),
            500,
        )


@api_blueprint.route("/users", methods=["GET"])
@login_required
def get_list_users():
    items = app.db.session.query(User).all()
    return UserSchema(many=True).dump(items)


@api_blueprint.route("/user/<int:user_id>", methods=["GET"])
@login_required
def get_user(user_id):
    item = app.db.session.query(User).filter_by(id=user_id).first()
    if not item:
        return jsonify({"message": "No item found"}), 404
    return UserSchema().dump(item)


@api_blueprint.route("/profileQr/<string:profile_id>", methods=["GET"])
@login_required
def get_profile_qr(profile_id):

    origin_url = request.url_root
    base_url = origin_url.split(request.path)[0]
    profile_qr_url = base_url + "/profile?id=" + profile_id

    qr = qrcode.make(profile_qr_url)

    # Create an in-memory byte stream
    qr_byte_array = BytesIO()
    qr.save(qr_byte_array, format="PNG")
    # img.save(img_byte_array, format="JPEG")  # Save the image to the byte stream

    # Set the byte stream's position to the beginning
    qr_byte_array.seek(0)

    # Return the image directly from the byte stream
    return send_file(qr_byte_array, mimetype="image/jpeg")


@api_blueprint.route("/profile/<string:profile_id>", methods=["GET"])
@login_required
def get_profile(profile_id):

    all_profiles = app.db.session.query(Profile).filter_by(
        user_id=current_user.id, unique_id=profile_id
    )
    res = {}
    for profile in all_profiles:
        p = ProfileSchema().dump(profile)
        res[profile.unique_id] = p
    return jsonify({"items": {"profiles": res}})
    # items = app.db.session.query(Profile).filter_by(
    #     user_id=current_user.id, unique_id=profile_id
    # )
    # if not item:
    #     return jsonify({"message": "No item found"}), 404

    # return jsonify({"items": {profile_id: ProfileSchema().dump(item)}})


@api_blueprint.route("/profile/<int:profile_id>", methods=["DELETE"])
@login_required
def del_profile(profile_id):
    item = (
        app.db.session.query(Profile)
        .filter_by(user_id=current_user.id, id=profile_id)
        .first()
    )
    if not item:
        return jsonify({"message": "No item found"}), 404
    app.db.session.delete(item)
    app.db.session.commit()
    return jsonify({"message": "Item deleted"}), 200


@api_blueprint.route("/profile/form", methods=["GET"])
@login_required
def profile_form():

    states_us = [
        "AK",
        "AL",
        "AR",
        "AS",
        "AZ",
        "CA",
        "CO",
        "CT",
        "DC",
        "DE",
        "FL",
        "GA",
        "GU",
        "HI",
        "IA",
        "ID",
        "IL",
        "IN",
        "KS",
        "KY",
        "LA",
        "MA",
        "MD",
        "ME",
        "MI",
        "MN",
        "MO",
        "MP",
        "MS",
        "MT",
        "NC",
        "ND",
        "NE",
        "NH",
        "NJ",
        "NM",
        "NV",
        "NY",
        "OH",
        "OK",
        "OR",
        "PA",
        "PR",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UM",
        "UT",
        "VA",
        "VI",
        "VT",
        "WA",
        "WI",
        "WV",
        "WY",
    ]
    profile_types = (
        app.db.session.query(ProfileType)
        .filter(ProfileType.schema_type != 0)
        .order_by(ProfileType.name)
        .all()
    )
    profile_types_json = ProfileTypeSchema(many=True).dump(profile_types)

    return (
        jsonify(
            {
                "form": {
                    "profile_types": profile_types_json,
                    "states_by_country": {"us": states_us},
                }
            }
        ),
        200,
    )

    # {"states_us": []]


@api_blueprint.route("/profile/favorite", methods=["POST"])
def set_profile_as_favorite():
    try:
        data = request.get_json(force=True)
        profile = (
            app.db.session.query(Profile)
            .filter_by(user_id=current_user.id, unique_id=data["profile_id"])
            .first()
        )
        print(data)
        profile.favorite = data["favorite"]
        app.db.session.commit()
        all_profiles = (
            app.db.session.query(Profile)
            .filter_by(user_id=current_user.id, unique_id=data["profile_id"])
            .all()
        )
        res = {}
        for profile in all_profiles:
            p = ProfileSchema().dump(profile)
            res[profile.unique_id] = p
            # res.append({"%s" % (profile.unique_id): p})
        return jsonify({"items": {"profiles": res}})
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "An error occurred while adding the profile: {}".format(
                        str(e)
                    )
                }
            ),
            500,
        )
