from flask import current_app as app

from app.api.models import AssetNFT, Profile, ProfileType, User
from marshmallow import Schema, fields, post_load, post_dump


class ProfileSchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = Profile
        include_relationships = True
        load_instance = True

    __model__ = Profile

    id = app.ma.auto_field()
    unique_id = app.ma.auto_field()
    name = app.ma.auto_field()
    last_name = app.ma.auto_field()
    bio = app.ma.auto_field()
    street_address = app.ma.auto_field()
    city = app.ma.auto_field()
    state_province = app.ma.auto_field()
    postal_code = app.ma.auto_field()
    country = app.ma.auto_field()
    favorite = app.ma.auto_field()
    sharing_url = app.ma.auto_field()
    created_at = app.ma.auto_field()
    modified_at = app.ma.auto_field()
    profile_type = app.ma.auto_field()
    profile_type_name = fields.Function(
        lambda obj: obj.profile_type.name if obj.profile_type else None
    )

    _links = app.ma.Hyperlinks(
        {
            "self": app.ma.URLFor("api.get_profile", values=dict(profile_id="<id>")),
            "collection": app.ma.URLFor("api.get_profiles"),
        }
    )


class TrophySchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = AssetNFT
        include_relationships = True
        load_instance = True

    __model__ = AssetNFT

    id = app.ma.auto_field()
    unique_id = app.ma.auto_field()
    name = app.ma.auto_field()
    asset_type = fields.Function(
        lambda obj: str(obj.asset_type).upper() if obj.asset_type else ""
    )
    _links = app.ma.Hyperlinks(
        {
            "self": app.ma.URLFor(
                "api.get_trophy", values=dict(trophy_id="<unique_id>")
            ),
            "asset": app.ma.URLFor(
                "api.get_trophy_asset", values=dict(trophy_id="<unique_id>")
            ),
            "collection": app.ma.URLFor("api.get_trophies"),
        }
    )


class UserSchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = app.ma.auto_field()

    _links = app.ma.Hyperlinks(
        {
            "self": app.ma.URLFor("api.get_list_users", values=dict(id="<id>")),
            "collection": app.ma.URLFor("api.get_list_users"),
        }
    )


class ProfileTypeSchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = ProfileType

    code = app.ma.auto_field()
    name = app.ma.auto_field()
    schema_type = app.ma.auto_field()
