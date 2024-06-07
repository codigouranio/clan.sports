"""Populate data

Revision ID: 74855b7f2607
Revises: afa809a3c12d
Create Date: 2024-06-06 18:30:38.707638

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import app


# revision identifiers, used by Alembic.
revision: str = "74855b7f2607"
down_revision: Union[str, None] = "afa809a3c12d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


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
    op.execute(
        "INSERT INTO user_account (id, phone_number, is_active, email_address) VALUES (1, '+19089083333', True, 'codigouranio@gmail.com')"
    )
    op.execute(
        """ INSERT INTO profile (user_id, unique_id, bio, name, last_name, street_address, city, state_province, postal_code, country, favorite, sharing_url, profile_type_code) 
            VALUES (1, '2db6fd19-227f-42c6-a4bb-456676d21dfe', 'test user for testing purposes', 'Tester', 'Quality', '10 Western St', 'San Diego', 'CA', '90090', 'USA', True, '/234234-3423-34', 'ADMIN')
        """
    )
    op.execute(
        """ INSERT INTO profile (user_id, unique_id, bio, name, last_name, street_address, city, state_province, postal_code, country, favorite, sharing_url, profile_type_code) 
            VALUES (1, '3f59307d-a327-4ce3-ae75-0116f3271087', 'test user for testing purposes', 'Agent', 'Players', '10 Western St', 'San Diego', 'CA', '90090', 'USA', False, '/234234-3423-35', 'AGENT')
        """
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
    op.execute("DELETE FROM user_account WHERE id=1")
    op.execute("DELETE FROM profile WHERE user_id=1")
