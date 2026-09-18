"""Initial schema for users, leads, services, and projects

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-18 03:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(255), unique=True, nullable=False, index=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), server_default='admin'),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Leads table
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, index=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('company', sa.String(255), nullable=True),
        sa.Column('service_interest', sa.String(100), server_default='Custom Software Development'),
        sa.Column('budget', sa.String(50), nullable=True),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(50), server_default='NEW', index=True),
        sa.Column('source', sa.String(50), server_default='WEBSITE'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), index=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Services table
    op.create_table(
        'services',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), unique=True, nullable=False),
        sa.Column('short_description', sa.Text(), nullable=False),
        sa.Column('full_description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(100), server_default='Code'),
        sa.Column('starting_price', sa.String(100), nullable=True),
        sa.Column('delivery_time', sa.String(100), nullable=True),
        sa.Column('features', sa.JSON(), server_default='[]'),
        sa.Column('is_active', sa.Boolean(), server_default='true', index=True),
        sa.Column('display_order', sa.Integer(), server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # Projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), unique=True, nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('client', sa.String(255), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('live_url', sa.Text(), nullable=True),
        sa.Column('github_url', sa.Text(), nullable=True),
        sa.Column('tech_stack', sa.JSON(), server_default='[]'),
        sa.Column('is_featured', sa.Boolean(), server_default='false', index=True),
        sa.Column('completion_date', sa.String(50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

    # WhatsApp logs
    op.create_table(
        'whatsapp_logs',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('from_number', sa.String(50), nullable=False),
        sa.Column('message_body', sa.Text(), nullable=True),
        sa.Column('response_sent', sa.Text(), nullable=True),
        sa.Column('status', sa.String(50), server_default='RECEIVED'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )


def downgrade() -> None:
    op.drop_table('whatsapp_logs')
    op.drop_table('projects')
    op.drop_table('services')
    op.drop_table('leads')
    op.drop_table('users')
