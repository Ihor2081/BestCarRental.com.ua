from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_, or_, desc
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import decimal

from database import get_db
from models import User, Car, Deal, RoleEnum, DealStatusEnum, CarStatusEnum, TransmissionEnum, FuelTypeEnum, AvailableDiscount, AdditionalService
from auth import get_admin_user, get_password_hash, verify_password

router = APIRouter(prefix="/api/admin", tags=["admin"])

# --- Pydantic Schemas ---

class DashboardStats(BaseModel):
    monthly_revenue: float
    total_bookings: int
    available_cars: int
    active_customers: int
    revenue_trend: List[dict]
    bookings_trend: List[dict]
    fleet_by_category: List[dict]

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    license_plate: str
    color: Optional[str] = None
    passengers: int = 5
    luggage: int = 2
    transmission: TransmissionEnum
    fuel_type: FuelTypeEnum
    features: Optional[str] = None
    description: Optional[str] = None
    images: Optional[str] = None
    price_per_day: float
    status: CarStatusEnum = CarStatusEnum.available

class CarCreate(CarBase):
    pass

class CarUpdate(CarBase):
    pass

class CarResponse(CarBase):
    id: int
    bookings_count: int

    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    id: int
    customer_name: str
    car_name: str
    start_date: datetime
    end_date: datetime
    status: DealStatusEnum
    total_price: float

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    bookings_count: int
    total_spent: float
    member_since: datetime

class CustomerDetailResponse(CustomerResponse):
    phone: Optional[str]
    address: Optional[str]
    drivers_license: Optional[str]
    booking_history: List[BookingResponse]

class SettingsUpdate(BaseModel):
    business_name: str
    business_email: EmailStr
    business_phone: str
    business_address: str

class DiscountBase(BaseModel):
    min_days: int
    max_days: int
    discount_percent: float

class DiscountCreate(DiscountBase):
    pass

class DiscountResponse(DiscountBase):
    id: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    icon: str
    name: str
    desc: Optional[str] = None
    price: float

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str

# --- Dashboard Endpoints ---

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    # Monthly Revenue (Confirmed/Active/Completed deals in the last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    revenue_result = await db.execute(
        select(func.sum(Deal.total_price)).where(
            and_(
                Deal.created_at >= thirty_days_ago,
                Deal.status.in_([DealStatusEnum.confirmed, DealStatusEnum.active, DealStatusEnum.completed])
            )
        )
    )
    monthly_revenue = float(revenue_result.scalar() or 0)

    # Total Bookings
    bookings_count_result = await db.execute(select(func.count(Deal.id)))
    total_bookings = bookings_count_result.scalar() or 0

    # Available Cars
    available_cars_result = await db.execute(
        select(func.count(Car.id)).where(Car.status == CarStatusEnum.available)
    )
    available_cars = available_cars_result.scalar() or 0

    # Active Customers (Users with at least one booking)
    active_customers_result = await db.execute(
        select(func.count(func.distinct(Deal.user_id)))
    )
    active_customers = active_customers_result.scalar() or 0

    # Revenue & Bookings Trend (Last 7 days)
    revenue_trend = []
    bookings_trend = []
    for i in range(6, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).date()
        next_day = day + timedelta(days=1)
        
        day_rev_result = await db.execute(
            select(func.sum(Deal.total_price)).where(
                and_(
                    Deal.created_at >= day,
                    Deal.created_at < next_day,
                    Deal.status.in_([DealStatusEnum.confirmed, DealStatusEnum.active, DealStatusEnum.completed])
                )
            )
        )
        day_bookings_result = await db.execute(
            select(func.count(Deal.id)).where(
                and_(
                    Deal.created_at >= day,
                    Deal.created_at < next_day
                )
            )
        )
        
        revenue_trend.append({"date": day.strftime("%Y-%m-%d"), "value": float(day_rev_result.scalar() or 0)})
        bookings_trend.append({"date": day.strftime("%Y-%m-%d"), "value": day_bookings_result.scalar() or 0})

    # Fleet by Category (Mocking categories as they are not in the model, using brand as proxy or just static for now)
    # Actually, let's just group by transmission or fuel_type as categories
    fleet_by_cat_result = await db.execute(
        select(Car.fuel_type, func.count(Car.id)).group_by(Car.fuel_type)
    )
    fleet_by_category = [{"category": row[0].value, "count": row[1]} for row in fleet_by_cat_result.all()]

    return {
        "monthly_revenue": monthly_revenue,
        "total_bookings": total_bookings,
        "available_cars": available_cars,
        "active_customers": active_customers,
        "revenue_trend": revenue_trend,
        "bookings_trend": bookings_trend,
        "fleet_by_category": fleet_by_category
    }

# --- Fleet Endpoints ---

@router.get("/cars", response_model=List[CarResponse])
async def get_admin_cars(db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(Car))
    cars = result.scalars().all()
    
    response = []
    for car in cars:
        bookings_count_result = await db.execute(
            select(func.count(Deal.id)).where(Deal.car_id == car.id)
        )
        bookings_count = bookings_count_result.scalar() or 0
        
        car_dict = {
            "id": car.id,
            "brand": car.brand,
            "model": car.model,
            "year": car.year,
            "license_plate": car.license_plate,
            "color": car.color,
            "passengers": car.passengers,
            "luggage": car.luggage,
            "transmission": car.transmission,
            "fuel_type": car.fuel_type,
            "features": car.features,
            "description": car.description,
            "images": car.images,
            "price_per_day": float(car.price_per_day),
            "status": car.status,
            "bookings_count": bookings_count
        }
        response.append(car_dict)
    
    return response

@router.post("/cars", response_model=CarResponse)
async def create_car(car_data: CarCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    new_car = Car(**car_data.dict())
    db.add(new_car)
    await db.commit()
    await db.refresh(new_car)
    
    return {**car_data.dict(), "id": new_car.id, "bookings_count": 0}

@router.put("/cars/{car_id}", response_model=CarResponse)
async def update_car(car_id: int, car_data: CarUpdate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalars().first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    for key, value in car_data.dict().items():
        setattr(car, key, value)
    
    await db.commit()
    await db.refresh(car)
    
    bookings_count_result = await db.execute(
        select(func.count(Deal.id)).where(Deal.car_id == car.id)
    )
    bookings_count = bookings_count_result.scalar() or 0
    
    return {**car_data.dict(), "id": car.id, "bookings_count": bookings_count}

@router.delete("/cars/{car_id}")
async def delete_car(car_id: int, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    # Check for active bookings
    active_bookings_result = await db.execute(
        select(func.count(Deal.id)).where(
            and_(
                Deal.car_id == car_id,
                Deal.status.in_([DealStatusEnum.confirmed, DealStatusEnum.active])
            )
        )
    )
    if active_bookings_result.scalar() > 0:
        raise HTTPException(status_code=400, detail="Cannot delete car with active bookings")
    
    result = await db.execute(select(Car).where(Car.id == car_id))
    car = result.scalars().first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    await db.delete(car)
    await db.commit()
    return {"status": "success", "message": "Car deleted successfully"}

# --- Bookings Endpoints ---

@router.get("/bookings", response_model=List[BookingResponse])
async def get_admin_bookings(
    status: Optional[DealStatusEnum] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = select(Deal).join(User).join(Car)
    
    if status:
        query = query.where(Deal.status == status)
    
    if search:
        query = query.where(
            or_(
                User.name.ilike(f"%{search}%"),
                func.cast(Deal.id, func.String).ilike(f"%{search}%")
            )
        )
    
    query = query.order_by(desc(Deal.created_at))
    
    result = await db.execute(query)
    deals = result.scalars().all()
    
    response = []
    for deal in deals:
        response.append({
            "id": deal.id,
            "customer_name": deal.user.name,
            "car_name": f"{deal.car.brand} {deal.car.model}",
            "start_date": deal.start_time,
            "end_date": deal.end_time,
            "status": deal.status,
            "total_price": float(deal.total_price)
        })
    
    return response

# --- Customers Endpoints ---

@router.get("/users", response_model=List[CustomerResponse])
async def get_admin_users(
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    query = select(User).where(User.role == RoleEnum.client)
    
    if search:
        query = query.where(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    response = []
    for user in users:
        bookings_count_result = await db.execute(
            select(func.count(Deal.id)).where(Deal.user_id == user.id)
        )
        total_spent_result = await db.execute(
            select(func.sum(Deal.total_price)).where(
                and_(
                    Deal.user_id == user.id,
                    Deal.status == DealStatusEnum.completed
                )
            )
        )
        
        response.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "bookings_count": bookings_count_result.scalar() or 0,
            "total_spent": float(total_spent_result.scalar() or 0),
            "member_since": user.created_at
        })
    
    return response

@router.get("/users/{user_id}", response_model=CustomerDetailResponse)
async def get_customer_detail(user_id: int, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    bookings_count_result = await db.execute(
        select(func.count(Deal.id)).where(Deal.user_id == user.id)
    )
    total_spent_result = await db.execute(
        select(func.sum(Deal.total_price)).where(
            and_(
                Deal.user_id == user.id,
                Deal.status == DealStatusEnum.completed
            )
        )
    )
    
    # Booking history
    bookings_result = await db.execute(
        select(Deal).where(Deal.user_id == user.id).order_by(desc(Deal.created_at))
    )
    bookings = bookings_result.scalars().all()
    booking_history = []
    for deal in bookings:
        booking_history.append({
            "id": deal.id,
            "customer_name": user.name,
            "car_name": f"{deal.car.brand} {deal.car.model}",
            "start_date": deal.start_time,
            "end_date": deal.end_time,
            "status": deal.status,
            "total_price": float(deal.total_price)
        })
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "drivers_license": user.drivers_license,
        "bookings_count": bookings_count_result.scalar() or 0,
        "total_spent": float(total_spent_result.scalar() or 0),
        "member_since": user.created_at,
        "booking_history": booking_history
    }

# --- Settings Endpoints ---

@router.get("/settings")
async def get_settings(db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    return {
        "business_name": admin.name,
        "business_email": admin.email,
        "business_phone": admin.phone or "",
        "business_address": admin.address or ""
    }

@router.put("/settings")
async def update_settings(settings_data: SettingsUpdate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    admin.name = settings_data.business_name
    admin.email = settings_data.business_email
    admin.phone = settings_data.business_phone
    admin.address = settings_data.business_address
    
    await db.commit()
    await db.refresh(admin)
    
    return {
        "business_name": admin.name,
        "business_email": admin.email,
        "business_phone": admin.phone or "",
        "business_address": admin.address or ""
    }

@router.post("/change-password")
async def change_password(data: ChangePasswordRequest, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    if not verify_password(data.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    if data.new_password != data.confirm_new_password:
        raise HTTPException(status_code=400, detail="New passwords do not match")
    
    admin.password_hash = get_password_hash(data.new_password)
    await db.commit()
    return {"status": "success", "message": "Password changed successfully"}

# --- Discounts Endpoints ---

@router.get("/discounts", response_model=List[DiscountResponse])
async def get_discounts(db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AvailableDiscount).order_by(AvailableDiscount.min_days))
    return result.scalars().all()

@router.post("/discounts", response_model=DiscountResponse)
async def create_discount(data: DiscountCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    new_discount = AvailableDiscount(**data.dict())
    db.add(new_discount)
    await db.commit()
    await db.refresh(new_discount)
    return new_discount

@router.put("/discounts/{discount_id}", response_model=DiscountResponse)
async def update_discount(discount_id: int, data: DiscountCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AvailableDiscount).where(AvailableDiscount.id == discount_id))
    discount = result.scalars().first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    for key, value in data.dict().items():
        setattr(discount, key, value)
    await db.commit()
    await db.refresh(discount)
    return discount

@router.delete("/discounts/{discount_id}")
async def delete_discount(discount_id: int, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AvailableDiscount).where(AvailableDiscount.id == discount_id))
    discount = result.scalars().first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    await db.delete(discount)
    await db.commit()
    return {"status": "success"}

# --- Services Endpoints ---

@router.get("/services", response_model=List[ServiceResponse])
async def get_services(db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AdditionalService).order_by(AdditionalService.name))
    return result.scalars().all()

@router.post("/services", response_model=ServiceResponse)
async def create_service(data: ServiceCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    new_service = AdditionalService(**data.dict())
    db.add(new_service)
    await db.commit()
    await db.refresh(new_service)
    return new_service

@router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: int, data: ServiceCreate, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AdditionalService).where(AdditionalService.id == service_id))
    service = result.scalars().first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in data.dict().items():
        setattr(service, key, value)
    await db.commit()
    await db.refresh(service)
    return service

@router.delete("/services/{service_id}")
async def delete_service(service_id: int, db: AsyncSession = Depends(get_db), admin: User = Depends(get_admin_user)):
    result = await db.execute(select(AdditionalService).where(AdditionalService.id == service_id))
    service = result.scalars().first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.delete(service)
    await db.commit()
    return {"status": "success"}
