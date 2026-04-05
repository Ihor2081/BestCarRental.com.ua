from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class CardBase(BaseModel):
    card_number: str
    expires: Optional[str] = None # MM/YY

class CardCreate(CardBase):
    pass

class CardResponse(CardBase):
    id: int
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    drivers_license: Optional[str] = None
    address: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class UserStats(BaseModel):
    total_deals: int
    active_deals: int
    total_spent: float
    reward_points: int

class UserMeResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    drivers_license: Optional[str]
    address: Optional[str]
    created_at: datetime
    cards: List[CardResponse]
    stats: UserStats
    booking_history: List[dict]

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserResponse(UserBase):
    id: int
    role: str
    is_verified: int
    created_at: datetime

    class Config:
        from_attributes = True
