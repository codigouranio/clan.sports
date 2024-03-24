import hashlib
import uuid
from datetime import datetime
from typing import List, Optional

from flask_login import UserMixin
from sqlalchemy import Column, DateTime, Enum, ForeignKey, PickleType, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from .serializablemixin import SerializableMixin


class Base(DeclarativeBase):
    pass


class User(Base, UserMixin, SerializableMixin):
    __tablename__ = "user_account"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    phoneNumber: Mapped[str] = mapped_column(String(30))
    fullname: Mapped[Optional[str]]
    is_active: Mapped[bool] = mapped_column(default=True)
    addresses: Mapped[List["Address"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    profiles: Mapped[List["Profile"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r}, phoneNumber={self.phoneNumber!r})"

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class RequestCode(Base, SerializableMixin):
    __tablename__ = "request_code"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(6))
    phoneNumber: Mapped[str] = mapped_column(String(30))
    sessionId: Mapped[str] = mapped_column(String(256))
    expires: Mapped[datetime] = mapped_column(DateTime)

    def __repr__(self) -> str:
        return f"RequestCode(id={self.id!r}, code={self.code!r})"


class Address(Base, SerializableMixin):
    __tablename__ = "address"
    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"))
    user: Mapped["User"] = relationship(back_populates="addresses")

    def __repr__(self) -> str:
        return f"Address(id={self.id!r}, email_address={self.email_address!r})"


class ProfileType(Base):
    __tablename__ = "profile_type"

    # id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(6), primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    
    def to_dict(self):
        return {"id": self.id, "code": self.code, "name": self.name}


class Profile(Base, SerializableMixin):
    __tablename__ = "profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"))
    user: Mapped["User"] = relationship(back_populates="profiles")
    profile_type_code: Mapped[int] = mapped_column(ForeignKey("profile_type.code"))
    bio: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(30))
    street_address: Mapped[str] = mapped_column(String(30))
    city: Mapped[str] = mapped_column(String(30))
    state_province: Mapped[str] = mapped_column(String(30))
    postal_code: Mapped[str] = mapped_column(String(30))
    country: Mapped[str] = mapped_column(String(30))
    
    def to_dict(self, full = False):
        if full:
            return {}
        return {"id": self.id, "profile_type_code": self.profile_type_code, "name": self.name}


class AssetType(Enum):
    PASS = "pass"
    TROPHY = "trophy"
    BADGE = "badge"


class AssetNFT(Base, SerializableMixin):
    __tablename__ = "asset_nft"
    id: Mapped[int] = mapped_column(primary_key=True)
    nft_id: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False
    )  # 256-bit NFT ID in hexadecimal format
    asset_type: Mapped[str] = mapped_column(AssetType, nullable=False)
    # asset_type: Mapped[str] = mapped_column(Enum(AssetType), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    desc: Mapped[str] = mapped_column(nullable=False)

    @staticmethod
    def generate_nft_id():
        # Generate UUID version 4
        uuid_bytes = uuid.uuid4().bytes

        # Hash the UUID using SHA-256
        hash_object = hashlib.sha256(uuid_bytes)
        hash_bytes = hash_object.digest()

        # Return the first 256 bits (32 bytes) of the hash in hexadecimal format
        return hash_bytes.hex()


class SessionModel(Base):
    __tablename__ = "sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    data: Mapped[PickleType] = mapped_column(PickleType, nullable=False)
    expiry: Mapped[DateTime] = mapped_column(DateTime)

    # db.Column(db.PickleType, nullable=False)
