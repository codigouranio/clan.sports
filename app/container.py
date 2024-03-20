from os import environ, path

import boto3
from dependency_injector import containers, providers
from dependency_injector.wiring import Provide

from .api.smsService import SmsServiceMock


class Container(containers.DeclarativeContainer):
    config = providers.Configuration(json_files=[path.join("..", "config.{}.json".format(environ.get("ENVIRONMENT", "dev")))])

    smsService = providers.Singleton(SmsServiceMock, servicePlanId=config.servicePlanId)
    ssmClient = providers.Singleton(boto3.client, "ssm")
