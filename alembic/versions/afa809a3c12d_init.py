"""init

Revision ID: afa809a3c12d
Revises: 
Create Date: 2024-06-06 18:30:32.475401

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import app


# revision identifiers, used by Alembic.
revision: str = 'afa809a3c12d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('profile_type',
    sa.Column('code', sa.String(length=6), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('schema_type', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('code')
    )
    op.create_table('request_code',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=6), nullable=False),
    sa.Column('phoneNumber', sa.String(length=30), nullable=False),
    sa.Column('sessionId', sa.String(length=256), nullable=False),
    sa.Column('expires', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.String(length=256), nullable=False),
    sa.Column('data', sa.PickleType(), nullable=False),
    sa.Column('expiry', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('session_id')
    )
    op.create_table('user_account',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('phone_number', sa.String(length=30), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('email_address', sa.String(length=254), nullable=True),
    sa.Column('public_key', sa.String(length=254), nullable=True),
    sa.Column('private_key', sa.String(length=254), nullable=True),
    sa.Column('seed_phrase', sa.String(length=254), nullable=True),
    sa.Column('salt', sa.String(length=254), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('profile',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('unique_id', sa.String(length=64), nullable=False),
    sa.Column('bio', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('last_name', sa.String(length=30), nullable=False),
    sa.Column('street_address', sa.String(length=30), nullable=False),
    sa.Column('city', sa.String(length=30), nullable=False),
    sa.Column('state_province', sa.String(length=30), nullable=False),
    sa.Column('postal_code', sa.String(length=30), nullable=False),
    sa.Column('country', sa.String(length=30), nullable=False),
    sa.Column('favorite', sa.Boolean(), nullable=False),
    sa.Column('sharing_url', sa.String(length=255), nullable=False),
    sa.Column('profile_type_code', sa.String(length=6), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['profile_type_code'], ['profile_type.code'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user_account.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('unique_id')
    )
    op.create_table('asset_nft',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('desc', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('profile_id', sa.Integer(), nullable=False),
    sa.Column('unique_id', sa.String(length=64), nullable=False),
    sa.Column('asset_type', sa.Enum('PASS', 'TROPHY', 'BADGE', 'POINT', name='assettype', length=10), nullable=False),
    sa.Column('image', sa.LargeBinary(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.Column('expiration_date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['profile_id'], ['profile.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user_account.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('unique_id')
    )
    op.create_table('nft_transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nft_id', sa.Integer(), nullable=False),
    sa.Column('sender_id', sa.Integer(), nullable=False),
    sa.Column('receiver_id', sa.Integer(), nullable=True),
    sa.Column('action', sa.String(length=50), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['nft_id'], ['asset_nft.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('nft_transaction')
    op.drop_table('asset_nft')
    op.drop_table('profile')
    op.drop_table('user_account')
    op.drop_table('sessions')
    op.drop_table('request_code')
    op.drop_table('profile_type')
    # ### end Alembic commands ###
