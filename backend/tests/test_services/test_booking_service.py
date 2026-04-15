import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timedelta

from fastapi import HTTPException

from app.services.booking_service import BookingService
from app.models.car import CarStatusEnum


@pytest.fixture
def booking_service():
    service = BookingService(db=MagicMock())

    service.booking_repo = AsyncMock()
    service.car_repo = AsyncMock()
    service.service_repo = AsyncMock()
    service.discount_repo = AsyncMock()

    service.calculate_services_price = MagicMock(return_value=100)
    service.calculate_total_price = MagicMock(return_value=500)

    return service


@pytest.fixture
def user():
    u = MagicMock()
    u.id = 42
    return u


@pytest.fixture
def booking_data():
    data = MagicMock()
    data.car_id = 1
    data.start_time = datetime.now()
    data.end_time = datetime.now() + timedelta(days=3)
    data.additional_services = [1, 2]

    data.dict.return_value = {
        "car_id": 1,
        "start_time": data.start_time,
        "end_time": data.end_time,
        "additional_services": data.additional_services,
    }

    return data


# ✅ 1. Success
@pytest.mark.asyncio
async def test_create_booking_success(booking_service, user, booking_data):
    car = MagicMock()
    car.status = CarStatusEnum.available
    car.price_per_day = 100

    booking_service.car_repo.get.return_value = car
    booking_service.service_repo.get_all_ordered.return_value = []
    booking_service.discount_repo.get_all_ordered.return_value = []
    booking_service.booking_repo.has_overlap.return_value = False

    created = MagicMock()
    booking_service.booking_repo.create.return_value = created

    result = await booking_service.create_booking(user, booking_data)

    assert result == created
    booking_service.booking_repo.create.assert_called_once()


# ❌ 2. Invalid date
@pytest.mark.asyncio
async def test_invalid_date_range(booking_service, user, booking_data):
    booking_data.end_time = booking_data.start_time - timedelta(days=1)

    car = MagicMock()
    car.status = CarStatusEnum.available

    booking_service.car_repo.get.return_value = car

    with pytest.raises(HTTPException) as exc:
        await booking_service.create_booking(user, booking_data)

    assert exc.value.status_code == 400
    assert "Invalid date" in exc.value.detail


# ❌ 3. Overlap
@pytest.mark.asyncio
async def test_overlapping_booking(booking_service, user, booking_data):
    car = MagicMock()
    car.status = CarStatusEnum.available

    booking_service.car_repo.get.return_value = car
    booking_service.service_repo.get_all_ordered.return_value = []
    booking_service.discount_repo.get_all_ordered.return_value = []
    booking_service.booking_repo.has_overlap.return_value = True

    with pytest.raises(HTTPException) as exc:
        await booking_service.create_booking(user, booking_data)

    assert exc.value.status_code == 400
    assert "overlap" in exc.value.detail.lower()


# ✅ 4. User linked
@pytest.mark.asyncio
async def test_user_linked(booking_service, user, booking_data):
    car = MagicMock()
    car.status = CarStatusEnum.available

    booking_service.car_repo.get.return_value = car
    booking_service.service_repo.get_all_ordered.return_value = []
    booking_service.discount_repo.get_all_ordered.return_value = []
    booking_service.booking_repo.has_overlap.return_value = False

    booking_service.booking_repo.create.return_value = MagicMock()

    await booking_service.create_booking(user, booking_data)

    args, _ = booking_service.booking_repo.create.call_args
    data = args[0]

    assert data["user_id"] == user.id