"""Populate data

Revision ID: 537af3351549
Revises: 7e1d143436d5
Create Date: 2024-03-23 00:46:40.193580

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import app


# revision identifiers, used by Alembic.
revision: str = "537af3351549"
down_revision: Union[str, None] = "7e1d143436d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from alembic import op


def upgrade():
    op.execute("INSERT INTO profile_type (code, name) VALUES ('USER', 'User');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('COACH', 'Coach');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('ATHLETE', 'Athlete');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('FAN', 'Fan');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('OFFICIAL', 'Official');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('CLUB', 'Club');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('ORG', 'Organization');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('TEAM', 'Team');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('STAFF', 'Staff');")
    op.execute(
        "INSERT INTO profile_type (code, name) VALUES ('VOLUNTEER', 'Volunteer');"
    )
    op.execute("INSERT INTO profile_type (code, name) VALUES ('SPONSOR', 'Sponsor');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('MEDIA', 'Media');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('AGENT', 'Agent');")
    op.execute("INSERT INTO profile_type (code, name) VALUES ('SCOUT', 'Scout');")
    op.execute(
        "INSERT INTO profile_type (code, name) VALUES ('ADMIN', 'Administrator');"
    )
    op.execute(
        "INSERT INTO profile_type (code, name) VALUES ('SUPPORTER', 'Supporter');"
    )
    op.execute(
        "INSERT INTO profile_type (code, name) VALUES ('PARTICIPANT', 'Participant');"
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
