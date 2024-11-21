from dataclasses import dataclass
import uuid


@dataclass
class UserModel:
    id: str = str(uuid.uuid4())
    name: str = ""
    follows: list = []
    followers: list = []
