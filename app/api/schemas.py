from flask import current_app as app

from app.api.models import Profile, ProfileType, User


class ProfileSchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = Profile

    id = app.ma.auto_field()
    name = app.ma.auto_field()

    _links = app.ma.Hyperlinks(
        {
            "self": app.ma.URLFor("api.get_profile", values=dict(profile_id="<id>")),
            "collection": app.ma.URLFor("api.get_profiles"),
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
