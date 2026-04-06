import pytest
from unittest.mock import AsyncMock, patch
from app.services.car_service import CarService

@pytest.mark.asyncio
async def test_get_car_by_id_success(mock_db):
    """Example test for CarService.get_car_by_id."""
    car_id = 1
    mock_car = AsyncMock()
    mock_car.id = car_id
    mock_car.brand = "Tesla"
    mock_car.model = "Model 3"
    mock_car.year = 2023
    mock_car.price_per_day = 150.0
    mock_car.status.value = "available"
    mock_car.features = "GPS, Bluetooth"
    mock_car.transmission.value = "automatic"
    mock_car.fuel_type.value = "electricity"
    
    with patch("app.services.car_service.CarRepository") as MockRepo:
        repo_instance = MockRepo.return_value
        repo_instance.get = AsyncMock(return_value=mock_car)
        
        service = CarService(mock_db)
        result = await service.get_car_by_id(car_id)
        
        assert result["id"] == car_id
        assert result["make"] == "Tesla"
        repo_instance.get.assert_called_once_with(car_id)
