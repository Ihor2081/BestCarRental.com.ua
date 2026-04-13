"""Add category to cars

Revision ID: 6eed86b9c858
Revises: a6cec37fc2b6
Create Date: 2026-04-09 16:22:35.841301

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6eed86b9c858"
down_revision = "a6cec37fc2b6"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "cars",
        sa.Column("category", sa.String(length=50), nullable=True),
        if_not_exists=True,
    )


def downgrade():
    op.drop_column("cars", "category")
