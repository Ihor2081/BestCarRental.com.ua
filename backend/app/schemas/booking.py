from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from decimal import Decimal
from datetime import datetime

class BookingBase(BaseModel):
    car_id: int
    start_time: datetime
    end_time: datetime
    total_price: Decimal
    pick_up_location: Optional[str] = None
    additional_services: Optional[str] = None
    status: str = "pending"

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    total_price: Optional[Decimal] = None

class BookingResponse(BaseModel):
    id: int
    user_id: int
    car_id: int
    start_time: datetime
    end_time: datetime
    total_price: Decimal
    pick_up_location: Optional[str] = None
    additional_services: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AdminBookingResponse(BaseModel):
    id: int
    customer_name: str
    car_name: str
    start_date: datetime
    end_date: datetime
    status: str
    total_price: float
