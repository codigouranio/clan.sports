from datetime import datetime

from flask import current_app as app
from sqlalchemy import create_engine
from sqlalchemy.ext.serializer import dumps, loads
from sqlalchemy.orm import Session, sessionmaker

from .models import Base, User


class Repo:
    def getAllUsers(self):
        # with Session(engine) as session:
        users = app.db.query(User).all()
        return users

    def getUser(self, id):
        user = app.db.query(User).filter(User.id == id).first()
        return user

    def getUserBySessionId(self, sessionId):
        user = app.db.query(User).filter(User.sessionId == sessionId).first()
        return user

    def checkSessionId(self, sessionId):
        user = app.db.query(User).filter(User.sessionId == sessionId).first()
        return user.sessionExpires < datetime.now()

    def createUser(self, phoneNumber, sessionId, sessionExpires):
        user = User(
            phoneNumber=phoneNumber, sessionId=sessionId, sessionExpires=sessionExpires
        )
        app.db.add(user)
        app.db.commit()
        return user
