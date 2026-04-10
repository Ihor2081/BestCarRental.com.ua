from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.booking_repository import BookingRepository
from app.repositories.car_repository import CarRepository
from app.repositories.service_repository import ServiceRepository
from app.models.booking import DealStatusEnum
from app.models.car import CarStatusEnum
from app.schemas.booking import BookingCreate
from app.models.user import User
from app.models.car import Car


class BookingService:
    def __init__(self, db: AsyncSession):
        self.booking_repo = BookingRepository(db)
        self.car_repo = CarRepository(db)
        self.service_repo = ServiceRepository(db)
        self.db = db

    async def create_booking(self, user: User, booking_data: BookingCreate):
        car = await self.car_repo.get(booking_data.car_id)
        services = await self.service_repo.get_all_ordered()
        services_price = self.calculate_services_price(
            services, booking_data.additional_services
        )

        if not car:
            raise HTTPException(status_code=404, detail="Car not found")

        if car.status not in [CarStatusEnum.available]:
            raise HTTPException(
                status_code=400,
                detail="Cannot create booking for a car that is not available",
            )

        # TODO: Check for overlapping bookings

        booking_dict = booking_data.dict()
        booking_dict["user_id"] = user.id
        booking_dict["additional_services"] = ", ".join(
            map(str, booking_data.additional_services)
        )
        booking_dict["total_price"] = self.calculate_total_price(
            car, booking_data.start_time, booking_data.end_time, services_price
        )

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
            raise HTTPException(
                status_code=400, detail="Cannot cancel booking in current status"
            )

        return await self.booking_repo.update(
            booking, {"status": DealStatusEnum.cancelled}
        )

    def calculate_services_price(self, services, selected_ids) -> float:
        total = 0.0
        for service in services:
            if service.id in selected_ids:
                total += float(service.price)
        return total

    def calculate_total_price(
        self, car: Car, start_time, end_time, services_price
    ) -> float:
        duration = (end_time - start_time).days
        total_price = float(duration * car.price_per_day) + services_price

        return total_price
