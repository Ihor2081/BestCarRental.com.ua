from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models import Car

router = APIRouter(prefix="/api", tags=["cars"])


@router.get("/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    """Fetch cars from the MySQL database using SQLAlchemy."""
    try:
        result = await db.execute(select(Car))
        cars = result.scalars().all()

        formatted_cars = []
        for car in cars:
            formatted_cars.append(
                {
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
                    "images": car.images or "https://picsum.photos/seed/car/800/600",
                    "price_per_day": float(car.price_per_day),
                    "status": car.status,
                    "bookings_count": 0,
                }
            )
        return formatted_cars
    except Exception as e:
        print(f"Error fetching cars: {e}")
        raise HTTPException(status_code=500, detail="Error fetching cars from database")
