from abc import ABC, abstractmethod
import requests


class SmsService(ABC):
    @abstractmethod
    def send(self, phoneNumber: str, message: str) -> bool:
        pass


class SmsServiceDefault(SmsService):
    def __init__(self, servicePlanId: str) -> None:
        print("SmsServiceDefault __init__")
        # self.servicePlanId = servicePlanId
        # self.apiToken = apiToken
        # self.sinchNumber = sinchNumber
        # self.toNumber = toNumber

    def send(self, phoneNumber: str, message: str) -> bool:
        servicePlanId = ""
        apiToken = ""
        sinchNumber = ""
        toNumber = ""
        url = "https://us.sms.api.sinch.com/xms/v1/" + servicePlanId + "/batches"

        payload = {"from": sinchNumber, "to": [toNumber], "body": "Hello how are you"}

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken,
        }

        response = requests.post(url, json=payload, headers=headers)

        data = response.json()
        # print(data)


class SmsServiceMock(SmsService):
    def __init__(self, servicePlanId: str) -> None:
        print("SmsServiceDefault __init__")

    def send(self, phoneNumber: str, message: str) -> bool:
        print(phoneNumber, message)
        return True
