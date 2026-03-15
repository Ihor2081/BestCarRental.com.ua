from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, date

from database import get_db
from models import User, Deal, DealStatusEnum
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["users"])

# --- Pydantic Schemas ---

class CardBase(BaseModel):
    card_number: str
    expires: Optional[str] = None # We'll handle MM/YY string conversion

class CardCreate(CardBase):
    pass

class CardResponse(CardBase):
    id: int # We'll use user id as card id for frontend compatibility
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    drivers_license: Optional[str] = None
    address: Optional[str] = None
    card_number: Optional[str] = None
    expires: Optional[str] = None # MM/YY

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

# --- Endpoints ---

@router.get("/users/me", response_model=UserMeResponse)
async def get_me(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Prepare card info
    cards = []
    if user.card_number:
        expires_str = ""
        if user.expires:
            expires_str = user.expires.strftime("%m/%y")
        cards.append({
            "id": user.id,
            "card_number": user.card_number,
            "expires": expires_str
        })

    # Fetch booking history
    from models import Car
    bookings_res = await db.execute(
        select(Deal, Car)
        .join(Car, Deal.car_id == Car.id)
        .where(Deal.user_id == user.id)
        .order_by(Deal.created_at.desc())
    )
    bookings = []
    for deal, car in bookings_res.all():
        bookings.append({
            "id": f"DRV-{deal.id}",
            "car": f"{car.brand} {car.model}",
            "date": f"{deal.start_time.strftime('%b %d')} - {deal.end_time.strftime('%b %d, %Y')}",
            "status": deal.status,
            "price": f"${deal.total_price:,.0f}"
        })

    # Calculate stats
    # Total deals
    total_deals_res = await db.execute(select(func.count(Deal.id)).where(Deal.user_id == user.id))
    total_deals = total_deals_res.scalar() or 0

    # Active deals
    active_deals_res = await db.execute(select(func.count(Deal.id)).where(
        Deal.user_id == user.id,
        Deal.status == DealStatusEnum.active
    ))
    active_deals = active_deals_res.scalar() or 0

    # Total spent
    total_spent_res = await db.execute(select(func.sum(Deal.total_price)).where(
        Deal.user_id == user.id,
        Deal.status.in_([DealStatusEnum.confirmed, DealStatusEnum.active, DealStatusEnum.completed])
    ))
    total_spent = float(total_spent_res.scalar() or 0)

    # Reward points: 1 point per $10 spent
    reward_points = int(total_spent // 10)

    stats = UserStats(
        total_deals=total_deals,
        active_deals=active_deals,
        total_spent=total_spent,
        reward_points=reward_points
    )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "drivers_license": user.drivers_license,
        "address": user.address,
        "created_at": user.created_at,
        "cards": cards,
        "stats": stats,
        "booking_history": bookings
    }

@router.put("/users/me", response_model=UserUpdate)
async def update_me(data: UserUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    if data.name is not None:
        user.name = data.name
    if data.email is not None:
        # Check if email is already taken
        if data.email != user.email:
            email_check = await db.execute(select(User).where(User.email == data.email))
            if email_check.scalars().first():
                raise HTTPException(status_code=400, detail="Email already taken")
        user.email = data.email
    if data.phone is not None:
        user.phone = data.phone
    if data.drivers_license is not None:
        user.drivers_license = data.drivers_license
    if data.address is not None:
        user.address = data.address
    if data.card_number is not None:
        # Validation: 16 digits only
        import re
        if not re.match(r"^\d{16}$", data.card_number):
            raise HTTPException(status_code=400, detail="Card number must be exactly 16 digits and contain only numbers")
        user.card_number = data.card_number
    if data.expires is not None:
        try:
            # Convert MM/YY to date (first day of month)
            month, year = data.expires.split('/')
            year = int("20" + year)
            month = int(month)
            expiry_date = date(year, month, 1)
            
            # Validation: cannot be earlier than now (current month)
            today = date.today()
            current_month_start = date(today.year, today.month, 1)
            if expiry_date < current_month_start:
                raise HTTPException(status_code=400, detail="Card expiration date cannot be in the past")
                
            user.expires = expiry_date
        except HTTPException as he:
            raise he
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid expiration date format. Use MM/YY")
    
    await db.commit()
    await db.refresh(user)
    
    # Return formatted data
    res = {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "drivers_license": user.drivers_license,
        "address": user.address,
        "card_number": user.card_number,
        "expires": user.expires.strftime("%m/%y") if user.expires else None
    }
    return res

@router.post("/cards", response_model=CardResponse)
async def add_card(data: CardCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Validation: 16 digits only
    import re
    if not re.match(r"^\d{16}$", data.card_number):
        raise HTTPException(status_code=400, detail="Card number must be exactly 16 digits and contain only numbers")
            
    user.card_number = data.card_number
    try:
        month, year = data.expires.split('/')
        year = int("20" + year)
        month = int(month)
        expiry_date = date(year, month, 1)
        
        # Validation: cannot be earlier than now (current month)
        today = date.today()
        current_month_start = date(today.year, today.month, 1)
        if expiry_date < current_month_start:
            raise HTTPException(status_code=400, detail="Card expiration date cannot be in the past")
            
        user.expires = expiry_date
    except HTTPException as he:
        raise he
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid expiration date format. Use MM/YY")
    
    await db.commit()
    await db.refresh(user)
    return {
        "id": user.id,
        "card_number": user.card_number,
        "expires": data.expires
    }

@router.post("/users/change-password")
async def change_password(data: PasswordChange, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    from auth import verify_password, get_password_hash
    
    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    user.password_hash = get_password_hash(data.new_password)
    await db.commit()
    return {"status": "success", "message": "Password updated successfully"}

@router.delete("/cards/{card_id}")
async def delete_card(card_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # In this simplified model, we just clear the card info
    user.card_number = None
    user.expires = None
    await db.commit()
    return {"status": "success", "message": "Card info cleared"}
