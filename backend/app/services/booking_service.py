from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.booking_repository import BookingRepository
from app.repositories.car_repository import CarRepository
from app.repositories.service_repository import ServiceRepository
from app.repositories.discount_repository import DiscountRepository
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
        self.discount_repo = DiscountRepository(db)
        self.db = db

    async def create_booking(self, user: User, booking_data: BookingCreate):
        car = await self.car_repo.get(booking_data.car_id)
        services = await self.service_repo.get_all_ordered()
        discounts = await self.discount_repo.get_all_ordered()
        booking_duration = (booking_data.end_time - booking_data.start_time).days
        services_price = self.calculate_services_price(
            services, booking_data.additional_services, booking_duration
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
            car, booking_duration, services_price, discounts
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

    def calculate_services_price(
        self, services, selected_ids, booking_duration
    ) -> float:
        total = 0.0
        for service in services:
            if service.id in selected_ids:
                total += float(service.price * booking_duration)
        return total

    # Calculate discount amount based on booking duration and applicable discounts.
    # Returns: discount amount to be subtracted from the booking price
    def calculate_discount_amount(
        self, total_price_without_discounts, booking_duration, discounts
    ) -> float:
        total_discount = 0.0

        # Filter applicable discounts based on booking duration
        for discount in discounts:
            # Check if booking duration falls within discount range
            if discount.min_days <= booking_duration and (
                discount.max_days is None or booking_duration <= discount.max_days
            ):
                # Calculate discount amount for this discount
                discount_amount = total_price_without_discounts * (
                    float(discount.discount_percent) / 100
                )
                total_discount += discount_amount

        return total_discount

    def calculate_total_price(
        self, car: Car, booking_duration: int, services_price: float, discounts: list
    ) -> float:
        total_price_without_discounts = (
            float(booking_duration * car.price_per_day) + services_price
        )
        discount_amount = self.calculate_discount_amount(
            total_price_without_discounts, booking_duration, discounts
        )
        total_price = total_price_without_discounts - discount_amount

        return total_price
