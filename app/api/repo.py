from datetime import datetime

from flask import current_app as app
from sqlalchemy import create_engine
from sqlalchemy.ext.serializer import dumps, loads
from sqlalchemy.orm import Session, sessionmaker

from .models import Base, User

# engine = create_engine("sqlite:///database.db", echo=True)
# Base.metadata.create_all(engine)
# # Session = sessionmaker(bind=engine)

# with Session(engine) as db:

#     db.query(User).delete()
#     db.query(Address).delete()

#     admin = User(
#         name="admin",
#         fullname="ADMIN",
#         phoneNumber="1234567890",
#         addresses=[Address(email_address="admin@paskot.com")]
#     )

#     db.add_all([admin])

#     db.commit()


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


#   def createSession(self):
#     return ""
