from flask import current_app as app

from app.api.models import Profile

class ProfileSchema(app.ma.SQLAlchemySchema):
    class Meta:
        model = Profile
           
    id = app.ma.auto_field()
    name = app.ma.auto_field()
    
    _links = app.ma.Hyperlinks(
        {
            "self": app.ma.URLFor("api.list_profiles", values=dict(id="<id>")),
            "collection": app.ma.URLFor("api.list_profiles"),
        }
    )
    