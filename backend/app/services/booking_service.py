from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.booking_repository import BookingRepository
from app.repositories.car_repository import CarRepository
from app.models.booking import DealStatusEnum
from app.schemas.booking import BookingCreate, BookingResponse
from app.models.user import User
from typing import List

class BookingService:
    def __init__(self, db: AsyncSession):
        self.booking_repo = BookingRepository(db)
        self.car_repo = CarRepository(db)
        self.db = db

    async def create_booking(self, user: User, booking_data: BookingCreate):
        car = await self.car_repo.get(booking_data.car_id)
        if not car:
            raise HTTPException(status_code=404, detail="Car not found")
        
        # Check for overlapping bookings
        # (Simplified for now, in a real app you'd check dates)
        
        booking_dict = booking_data.dict()
        booking_dict["user_id"] = user.id
        booking_dict["status"] = DealStatusEnum.pending
        
        booking = await self.booking_repo.create(booking_dict)
        return booking

    async def get_user_bookings(self, user_id: int):
        return await self.booking_repo.get_user_bookings(user_id)

    async def get_booking_by_id(self, booking_id: int, user_id: int):
        booking = await self.booking_repo.get(booking_id)
        if not booking or booking.user_id != user_id:
            raise HTTPException(status_code=404, detail="Booking not found")
        return booking

    async def cancel_booking(self, booking_id: int, user_id: int):
        booking = await self.booking_repo.get(booking_id)
        if not booking or booking.user_id != user_id:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        if booking.status not in [DealStatusEnum.pending, DealStatusEnum.confirmed]:
            raise HTTPException(status_code=400, detail="Cannot cancel booking in current status")
        
        return await self.booking_repo.update(booking, {"status": DealStatusEnum.cancelled})
