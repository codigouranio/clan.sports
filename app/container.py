from os import environ

from dependency_injector import containers, providers
from dependency_injector.wiring import Provide

from .api.smsService import SmsServiceMock


class Container(containers.DeclarativeContainer):
  config = providers.Configuration()
  config.from_json(filepath=f'config.{environ.get("ENVIRONMENT")}.json', required=True)
  sms_service = providers.Factory(
    SmsServiceMock, 
    servicePlanId=config.smsService.servicePlanId(),
  )
  