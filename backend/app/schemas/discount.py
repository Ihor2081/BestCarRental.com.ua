from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime

class DiscountBase(BaseModel):
    min_days: int
    max_days: int
    discount_percent: Decimal

class DiscountCreate(DiscountBase):
    pass

class DiscountResponse(DiscountBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
