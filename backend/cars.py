from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models import Car

router = APIRouter(tags=["cars"])


def serialize_car(car: Car) -> dict:
    return {
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
        "bookings_count": 0,
    }


@router.get("/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    """Fetch cars from the MySQL database using SQLAlchemy."""
    try:
        result = await db.execute(select(Car))
        cars = result.scalars().all()
        return [serialize_car(car) for car in cars]
    except Exception as e:
        print(f"Error fetching cars: {e}")
        raise HTTPException(status_code=500, detail="Error fetching cars from database")


@router.get("/cars/{car_id}")
async def get_car_by_id(car_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch a single car by ID."""
    try:
        result = await db.execute(select(Car).where(Car.id == car_id))
        car = result.scalars().first()
        if car is None:
            raise HTTPException(status_code=404, detail="Car not found")

        return serialize_car(car)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching car {car_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching car from database")