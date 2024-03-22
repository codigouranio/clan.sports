# https://flask-login.readthedocs.io/en/latest/
# https://testdriven.io/blog/flask-sessions/
# https://docs.sqlalchemy.org/en/20/core/type_basics.html#sqlalchemy.types.DateTime
# https://www.digitalocean.com/community/tutorials/how-to-add-authentication-to-your-app-with-flask-login

import random
from datetime import datetime, timedelta
from http import HTTPStatus

from dependency_injector.wiring import Provide, inject
from flask import Blueprint, abort
from flask import current_app as app
from flask import flash, jsonify, redirect, request, session, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)

from .api.models import Base, RequestCode, User
from .api.repo import Repo
from .api.sessions import Sessions
from .api.smsService import SmsService
from .api.utils import generate_session_id, generate_sha256_hash
from sqlalchemy.orm import Session, sessionmaker, scoped_session


api_blueprint = Blueprint("api", __name__, url_prefix="/api")
smsService: SmsService = app.container.smsService()
ssmClient = app.container.ssmClient()

try:
    print(
        ssmClient.get_parameter(Name="/clan.sports.club/staging/test")["Parameter"][
            "Value"
        ]
    )
except:
    print("An exception occurred")


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
    smsService.send(
        phoneNumber=phoneNumber, message=f"Clan Sports code: {0}".format(code)
    )
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

    user = app.db.session.query(User).filter_by(phoneNumber=code.phoneNumber).first()
    if not user:
        print("adding user to db")
        user = User(name="unknown", phoneNumber=code.phoneNumber)
        app.db.session.add(user)
        app.db.session.commit()

    login_user(user, remember=True, duration=timedelta(days=60), force=True, fresh=True)
    flash("Logged in successfully.")
    return jsonify({"success": True})


def loadSession():
    if "sessionId" in session:
        return Repo().getUser(session["sessionId"])
    return None


@api_blueprint.route("/allUsers", methods=["POST"])
@login_required
def allUsers():
    print(current_user)
    with Session(app.engine) as db:
        users = db.query(User).all()
        user_list = [user.to_dict() for user in users]
        return jsonify({"users": user_list})
    # if not current_user.is_authenticated:
    #     return jsonify({ "error": "Not authenticated" })


@app.login_manager.user_loader
def load_user(user_id):
    user = app.db.session.query(User).filter_by(id=user_id).first()
    return user


# return User.get(user_id)

# data = request.get_json(force=True)
# users = Repo().getAllUsers()
# user_list = [user.to_dict() for user in users]
# return jsonify({ "users": user_list, "request": data })


@api_blueprint.route("/getCurrentUser", methods=["GET"])
@login_required
def getCurrentUser():
    print(current_user)
    return jsonify({"id": current_user.id})

    # with Session(engine) as db:
    #     user = db.query(User).filter_by(id=current_user.id).first()
    #     return user

    # return User.get(user_id)

    # data = request.get_json(force=True)
    # users = Repo().getAllUsers()
    # user_list = [user.to_dict() for user in users]
    # return jsonify({ "users": user_list, "request": data })


@api_blueprint.route('/profiles')
@login_required
def list_tasks():
    return ""

@api_blueprint.route('/profiles/add', methods=['POST'])
@login_required
def add_task():
    return ""

@api_blueprint.route('/profiles/<int:profile_id>/edit', methods=['PUT'])
@login_required
def edit_task(profile_id):
    return ""

@api_blueprint.route('/profiles')
@login_required
def list_tasks():
    return ""

@api_blueprint.route('/profiles/add', methods=['POST'])
@login_required
def add_task():
    return ""

@api_blueprint.route('/profiles/<int:profile_id>/edit', methods=['PUT'])
@login_required
def edit_task(profile_id):
    return ""

@api_blueprint.route('/tasks/<int:profile_id>/delete', methods=['POST'])
@login_required
def delete_task(profile_id):
    return ""

@api_blueprint.route('/points')
@login_required
def list_points():
    return ""

@api_blueprint.route('/passes')
@login_required
def list_passes():
    return ""

@api_blueprint.route('/trophies')
@login_required
def list_passes():
    return ""

@api_blueprint.route('/badges')
@login_required
def list_passes():
    return ""

@api_blueprint.route('/clans')
@login_required
def list_passes():
    return ""