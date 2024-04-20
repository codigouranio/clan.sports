"""Populate data

Revision ID: 537af3351549
Revises: 7e1d143436d5
Create Date: 2024-03-23 00:46:40.193580

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "537af3351549"
down_revision: Union[str, None] = "7e1d143436d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from alembic import op


def upgrade():
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('USER', 'User', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('COACH', 'Coach', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('ATHLETE', 'Athlete', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('FAN', 'Fan', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('OFFICIAL', 'Official', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('CLUB', 'Club', 2);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('ORG', 'Organization', 2);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('TEAM', 'Team', 2);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('STAFF', 'Staff', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('VOLUNTEER', 'Volunteer', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('SPONSOR', 'Sponsor', 2);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('MEDIA', 'Media', 2);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('AGENT', 'Agent', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('SCOUT', 'Scout', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('ADMIN', 'Administrator', 0);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('SUPPORTER', 'Supporter', 1);"
    )
    op.execute(
        "INSERT INTO profile_type (code, name, schema_type) VALUES ('PARTICIPANT', 'Participant', 1);"
    )


def downgrade():
    op.execute("DELETE FROM profile_type WHERE code='USER';")
    op.execute("DELETE FROM profile_type WHERE code='COACH';")
    op.execute("DELETE FROM profile_type WHERE code='ATHLETE';")
    op.execute("DELETE FROM profile_type WHERE code='FAN';")
    op.execute("DELETE FROM profile_type WHERE code='OFFICIAL';")
    op.execute("DELETE FROM profile_type WHERE code='CLUB';")
    op.execute("DELETE FROM profile_type WHERE code='ORG';")
    op.execute("DELETE FROM profile_type WHERE code='TEAM';")
    op.execute("DELETE FROM profile_type WHERE code='STAFF';")
    op.execute("DELETE FROM profile_type WHERE code='VOLUNTEER';")
    op.execute("DELETE FROM profile_type WHERE code='SPONSOR';")
    op.execute("DELETE FROM profile_type WHERE code='MEDIA';")
    op.execute("DELETE FROM profile_type WHERE code='AGENT';")
    op.execute("DELETE FROM profile_type WHERE code='SCOUT';")
    op.execute("DELETE FROM profile_type WHERE code='ADMIN';")
    op.execute("DELETE FROM profile_type WHERE code='SUPPORTER';")
    op.execute("DELETE FROM profile_type WHERE code='PARTICIPANT';")
