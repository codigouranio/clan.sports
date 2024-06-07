import hashlib
import uuid
from datetime import datetime
from typing import List, Optional
from datetime import datetime, timedelta

from flask_login import UserMixin
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    LargeBinary,
    PickleType,
    String,
)
from enum import Enum as PyEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from .serializablemixin import SerializableMixin


class Base(DeclarativeBase):
    pass


class User(Base, UserMixin, SerializableMixin):
    __tablename__ = "user_account"
    id: Mapped[int] = mapped_column(primary_key=True)
    phone_number: Mapped[str] = mapped_column(String(30))
    is_active: Mapped[bool] = mapped_column(default=True)
    email_address: Mapped[str] = mapped_column(String(254), nullable=True, default=None)
    profiles: Mapped[List["Profile"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    public_key = Column(String(254), nullable=True)
    private_key = Column(String(254), nullable=True)
    seed_phrase = Column(String(254), nullable=True)
    salt = Column(String(254), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    modified_at = Column(DateTime, onupdate=datetime.now)

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, phone_number={self.phone_number}, email_address={self.email_address}, is_active={self.is_active})"

    def to_dict(self):
        return {"id": self.id}


class RequestCode(Base, SerializableMixin):
    __tablename__ = "request_code"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(6))
    phoneNumber: Mapped[str] = mapped_column(String(30))
    sessionId: Mapped[str] = mapped_column(String(256))
    expires: Mapped[datetime] = mapped_column(DateTime)

    def __repr__(self) -> str:
        return f"RequestCode(id={self.id!r}, code={self.code!r})"


class ProfileType(Base):
    __tablename__ = "profile_type"

    code: Mapped[str] = mapped_column(String(6), primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    schema_type: Mapped[int] = mapped_column()

    def to_dict(self):
        return {"code": self.code, "name": self.name}


class Profile(Base, SerializableMixin):
    __tablename__ = "profile"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"), nullable=False)
    unique_id: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, default=str(uuid.uuid4())
    )
    asset_nfts: Mapped[List["AssetNFT"]] = relationship(
        back_populates="profile", cascade="all, delete-orphan"
    )
    user: Mapped["User"] = relationship(back_populates="profiles")
    bio: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(30))
    street_address: Mapped[str] = mapped_column(String(30))
    city: Mapped[str] = mapped_column(String(30))
    state_province: Mapped[str] = mapped_column(String(30))
    postal_code: Mapped[str] = mapped_column(String(30))
    country: Mapped[str] = mapped_column(String(30))
    favorite: Mapped[Boolean] = mapped_column(Boolean, nullable=False, default=False)
    sharing_url: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    profile_type: Mapped[ProfileType] = relationship("ProfileType")
    profile_type_code: Mapped[str] = mapped_column(
        String(6), ForeignKey("profile_type.code")
    )
    created_at = Column(DateTime, default=datetime.now)
    modified_at = Column(DateTime, onupdate=datetime.now)

    def get_profile_type_name(self, session):
        if hasattr(self, "_profile_type_name"):
            return self._profile_type_name
        if self.profile_type_code is not None:
            # Assuming you have a ProfileType class defined with a 'name' attribute
            profile_type = (
                session.query(ProfileType)
                .filter_by(code=self.profile_type_code)
                .first()
            )
            self._profile_type_name = profile_type.name if profile_type else None
            return self._profile_type_name
        return None

    def to_dict(self, full=False):
        if full:
            return {}
        return {
            "id": self.id,
            "profile_type_code": self.profile_type_code,
            "name": self.name,
        }

    # @property
    # def profileType(self):
    #     return self.profile_type.name if self.profile_type else None


class AssetType(PyEnum):
    PASS = "pass"
    TROPHY = "trophy"
    BADGE = "badge"
    POINT = "point"

    @classmethod
    def from_string(cls, value: str) -> "AssetType":
        try:
            return cls(value.lower())
        except ValueError:
            raise ValueError(f"Invalid AssetType value: {value}")

    def __str__(self) -> str:
        return self.value


class NFTTransaction(Base):
    __tablename__ = "nft_transaction"

    id: Mapped[int] = mapped_column(primary_key=True)
    nft_id: Mapped[int] = mapped_column(ForeignKey("asset_nft.id"), nullable=False)
    sender_id: Mapped[int] = mapped_column(nullable=False)
    receiver_id: Mapped[int] = mapped_column(nullable=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class AssetNFT(Base, SerializableMixin):
    __tablename__ = "asset_nft"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    desc: Mapped[str] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"), nullable=False)
    profile_id: Mapped[int] = mapped_column(ForeignKey("profile.id"), nullable=False)
    profile: Mapped["Profile"] = relationship(back_populates="asset_nfts")
    unique_id: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, default=str(uuid.uuid4())
    )
    asset_type: Mapped[str] = Column(Enum(AssetType, length=10), nullable=False)
    image: Mapped[bytes] = mapped_column(LargeBinary)
    created_at = Column(DateTime, default=datetime.now)
    modified_at = Column(DateTime, onupdate=datetime.now)
    expiration_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Add relationship to NFTTransaction
    # transactions: Mapped[list[NFTTransaction]] = relationship(
    #     "NFTTransaction", back_populates="nft"
    # )

    def is_expired(self):
        if self.expiration_date:
            return datetime.now() > self.expiration_date
        return False

    def can_be_renewed_by(self, user_id: int) -> bool:
        return self.user_id == user_id

    def renew(self, user_id: int, additional_time: timedelta):
        if self.can_be_renewed_by(user_id):
            self.expiration_date = datetime.now() + additional_time
        else:
            raise PermissionError("You do not have permission to renew this NFT.")

    def can_be_destroyed_by(self, user_id: int) -> bool:
        return self.user_id == user_id

    def destroy(self, user_id: int, session):
        if self.can_be_destroyed_by(user_id):
            transaction = NFTTransaction(
                nft_id=self.id, sender_id=self.user_id, action="destroy"
            )
            session.add(transaction)
            session.delete(self)
        else:
            raise PermissionError("You do not have permission to destroy this NFT.")

    def transfer(self, current_user_id: int, new_user_id: int, session):
        if self.user_id == current_user_id:
            transaction = NFTTransaction(
                nft_id=self.id,
                sender_id=current_user_id,
                receiver_id=new_user_id,
                action="transfer",
            )
            self.user_id = new_user_id
            session.add(transaction)
        else:
            raise PermissionError("You do not have permission to transfer this NFT.")

    def to_dict(self, full=False):
        if full:
            return {}
        return {
            "id": self.id,
            "name": self.name,
        }

    def to_dict(self, full=False):
        if full:
            return {}
        return {
            "id": self.id,
            "name": self.name,
        }


class SessionModel(Base):
    __tablename__ = "sessions"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(256), unique=True, nullable=False)
    data: Mapped[PickleType] = mapped_column(PickleType, nullable=False)
    expiry: Mapped[DateTime] = mapped_column(DateTime)
