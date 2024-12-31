import base64
from datetime import datetime
import hashlib
import hmac
from os import environ, path

import boto3.session
from botocore.exceptions import BotoCoreError, ClientError
from dependency_injector import containers, providers
from dependency_injector.wiring import Provide
from flask import current_app as app
from flask import jsonify

from .api.smsService import SmsServiceMock


class AwsServiceMock(object):

    def __init__(self, s3_client, sns_client):
        self.s3_client = s3_client
        self.sns_client = sns_client

    def publish_message(self, phone_number, message):
        return jsonify({"phone_number": phone_number, "message": message})


class AwsService:
    def __init__(self, config, sts_client, s3_client, sns_client, cognito_client):
        self.userPoolId = config.get("USER_POOL_ID")
        self.clientId = config.get("CLIENT_ID")
        self.clientSecret = config.get("CLIENT_SECRET")

        self.sts_client = sts_client
        self.s3_client = s3_client
        self.sns_client = sns_client
        self.cognito_client = cognito_client

    def getIdentity(self):
        return self.sts_client.get_caller_identity()

    def getUser(self, access_token):
        ret = {
            "Success": True,
        }
        try:
            resp = self.cognito_client.get_user(AccessToken=access_token)
            ret["User"] = {
                "UserAttributes": resp["UserAttributes"],
                "Username": resp["Username"],
            }
            print(resp)
        except ClientError as e:
            print(f"ClientError: {e.response['Error']['Message']}")
            ret["Success"] = False
            ret["Message"] = e.response["Error"]["Message"]
            error_code = e.response["Error"]["Code"]
            if error_code == "NotAuthorizedException":
                print("Session is invalid or expired.")
            elif error_code == "ExpiredTokenException":
                print("Token has expired.")
            else:
                print("An unexpected error occurred:", e)

        return ret

    def adminGetUser(self, username):
        try:
            return self.cognito_client.admin_get_user(
                UserPoolId=self.userPoolId, Username=username
            )
        except ClientError as e:
            print("Error getting user", e)
            return None

    def requestCode(self, email, phoneNumber):
        ret = {
            "Success": True,
            "Email": email,
            "PhoneNumber": phoneNumber,
            "Session": "",
            "ChallengeName": "",
        }

        user = self.adminGetUser(email)

        if user:
            if user["UserStatus"] == "CONFIRMED":
                try:
                    resp = self.cognito_client.admin_initiate_auth(
                        UserPoolId=self.userPoolId,
                        ClientId=self.clientId,
                        AuthFlow="ADMIN_NO_SRP_AUTH",
                        AuthParameters={
                            "USERNAME": email,
                            "PASSWORD": "DummyPassword123!",
                            "SECRET_HASH": self.calculateSecretHash(
                                self.clientId, self.clientSecret, email
                            ),
                        },
                    )

                    print("admin_initiate_auth", resp)

                    ret["Session"] = resp["Session"]
                    ret["ChallengeName"] = resp["ChallengeName"]
                    ret["SentCode"] = datetime.now()
                except ClientError as e:
                    print(f"ClientError: {e.response['Error']['Message']}")
                    ret["Success"] = False
                    ret["Message"] = e.response["Error"]["Message"]
                    return ret

            elif user["UserStatus"] == "UNCONFIRMED":
                try:
                    self.cognito_client.resend_confirmation_code(
                        ClientId=self.clientId,
                        Username=email,
                        SecretHash=self.calculateSecretHash(
                            self.clientId, self.clientSecret, email
                        ),
                    )

                    ret["ResentCode"] = datetime.now()

                    print("Confirmation code sent")
                except ClientError as e:
                    print("Error resending confirmation code", e)
                    ret["Success"] = False
                    ret["Message"] = e.response["Error"]["Message"]
                    return ret
        else:
            try:
                resp = self.cognito_client.sign_up(
                    ClientId=self.clientId,
                    Username=email,
                    Password="DummyPassword123!",
                    SecretHash=self.calculateSecretHash(
                        self.clientId, self.clientSecret, email
                    ),
                    UserAttributes=[
                        {"Name": "email", "Value": email},
                        {"Name": "phone_number", "Value": phoneNumber},
                    ],
                )
                ret["Confirmed"] = resp["UserConfirmed"]
            except ClientError as e:
                print("Error signing up user", e)
                ret["Success"] = False
                ret["Message"] = e.response["Error"]["Message"]
                return ret

        return ret

    def verifyCode(self, email, phoneNumber, code, challengeName, session):

        ret = {
            "Success": True,
        }

        user = self.adminGetUser(email)

        if user:
            if user["UserStatus"] == "UNCONFIRMED":
                print("User not confirmed")
                try:
                    resp = self.cognito_client.confirm_sign_up(
                        ClientId=self.clientId,
                        Username=email,
                        ConfirmationCode=code,
                        SecretHash=self.calculateSecretHash(
                            self.clientId, self.clientSecret, email
                        ),
                    )

                    print("User signup confirmed successfully!", resp)

                except ClientError as e:
                    print(f"ClientError: {e.response['Error']['Message']}")
                    ret["Success"] = False
                    ret["Message"] = e.response["Error"]["Message"]
                    return ret

                try:
                    resp = self.cognito_client.admin_initiate_auth(
                        UserPoolId=self.userPoolId,
                        ClientId=self.clientId,
                        AuthFlow="ADMIN_NO_SRP_AUTH",
                        AuthParameters={
                            "USERNAME": email,
                            "PASSWORD": "DummyPassword123!",
                            "SECRET_HASH": self.calculateSecretHash(
                                self.clientId, self.clientSecret, email
                            ),
                        },
                    )

                    print("User authenticated successfully!", resp)

                    ret["Authentication"] = resp["AuthenticationResult"]

                    ret["User"] = self.getUser(
                        resp["AuthenticationResult"]["AccessToken"]
                    )["User"]

                    ret["Message"] = "User is authenticated successfully"

                    self.cognito_client.admin_set_user_mfa_preference(
                        UserPoolId=self.userPoolId,
                        Username=email,
                        EmailMfaSettings={"Enabled": True, "PreferredMfa": True},
                    )

                except ClientError as e:
                    print(f"ClientError: {e.response['Error']['Message']}")
                    ret["Success"] = False
                    ret["Message"] = e.response["Error"]["Message"]
                    return ret

            elif user["UserStatus"] == "CONFIRMED":
                try:
                    resp = self.cognito_client.respond_to_auth_challenge(
                        ClientId=self.clientId,
                        ChallengeName=challengeName,
                        ChallengeResponses={
                            "USERNAME": email,
                            "EMAIL_OTP_CODE": code,
                            "SECRET_HASH": self.calculateSecretHash(
                                self.clientId, self.clientSecret, email
                            ),
                        },
                        Session=session,
                    )

                    print("User authenticated successfully!", resp)

                    ret["Authentication"] = resp["AuthenticationResult"]

                    ret["User"] = self.getUser(
                        resp["AuthenticationResult"]["AccessToken"]
                    )["User"]

                    ret["Message"] = "User is authenticated successfully"
                except ClientError as e:
                    print(f"ClientError: {e.response['Error']['Message']}")
                    ret["Success"] = False
                    ret["Message"] = e.response["Error"]["Message"]
                    return ret
                except Exception as e:
                    print(f"Unexpected error: {str(e)}")
                    ret["Success"] = False
                    ret["Message"] = str(e)
                    return ret

        return ret

    def refreshToken(self, username, refresh_token):
        ret = {
            "Success": True,
        }

        try:
            resp = self.cognito_client.initiate_auth(
                AuthFlow="REFRESH_TOKEN_AUTH",
                AuthParameters={
                    "REFRESH_TOKEN": refresh_token,
                    "SECRET_HASH": self.calculateSecretHash(
                        self.clientId,
                        self.clientSecret,
                        username,
                    ),
                },
                ClientId=self.clientId,
            )
            ret["Authentication"] = resp["AuthenticationResult"]
            ret["Message"] = "User is authenticated successfully"
            return ret
        except ClientError as e:
            print(f"ClientError: {e.response['Error']['Message']}")
            ret["Success"] = False
            ret["Message"] = e.response["Error"]["Message"]
            return ret
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            ret["Success"] = False
            ret["Message"] = str(e)
            return ret

    def calculateSecretHash(self, client_id, client_secret, username):
        message = username + client_id
        dig = hmac.new(
            client_secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256
        ).digest()
        return base64.b64encode(dig).decode()


class Container(containers.DeclarativeContainer):

    config = providers.Configuration()

    print(config.get("USER_POOL_ID"))

    session = providers.Resource(
        boto3.session.Session,
        aws_access_key_id=environ.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=environ.get("AWS_SECRET_ACCESS_KEY"),
        region_name=environ.get("AWS_DEFAULT_REGION"),
    )

    print(environ.get("AWS_DEFAULT_REGION"))

    sts_client = providers.Resource(
        session.provided.client.call(),
        service_name="sts",
    )

    s3_client = providers.Resource(
        session.provided.client.call(),
        service_name="s3",
    )

    sns_client = providers.Resource(
        session.provided.client.call(),  # Alternative syntax
        service_name="sns",
    )

    cognito_client = providers.Resource(
        session.provided.client.call(),
        service_name="cognito-idp",
    )

    aws_service = providers.Factory(
        AwsService,
        config,
        s3_client=s3_client,
        sns_client=sns_client,
        sts_client=sts_client,
        cognito_client=cognito_client,
    )
