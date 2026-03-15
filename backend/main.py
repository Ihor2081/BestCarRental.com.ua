from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
from dotenv import load_dotenv

from database import get_db
from models import Car
from auth import router as auth_router
from admin import router as admin_router
import sample_data

load_dotenv()

app = FastAPI(title="Car Sharing API")

# Include routers
app.include_router(auth_router)
app.include_router(admin_router)

# --- Car Endpoints ---


@app.get("/api/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    """Fetch cars from the MySQL database using SQLAlchemy"""
    try:
        result = await db.execute(select(Car))
        cars = result.scalars().all()

        if not cars:
            return sample_data.cars_list()

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
                    "price_per_day": float(getattr(car, "price_per_day")),
                    "status": car.status,
                    "bookings_count": 0,  # This is a simplified view
                }
            )
        return formatted_cars
    except Exception as e:
        print(f"Error fetching cars: {e}")
        return sample_data.cars_list()


@app.get("/api/cars/{car_id}")
async def get_car_by_id(car_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch a single car by ID from the MySQL database"""
    try:
        result = await db.execute(select(Car).where(Car.id == car_id))
        car = result.scalar_one_or_none()

        if not car:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Car with ID {car_id} not found"
            )

        formatted_car = {
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
            "price_per_day": float(getattr(car, "price_per_day")),
            "status": car.status,
            "bookings_count": 0,
        }
        return formatted_car
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching car with ID {car_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch car details"
        )


@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        row = result.fetchone()
        if row and row[0] == 1:
            return {
                "status": "success",
                "message": "Database connection is healthy",
                "db": "MySQL",
            }
        raise HTTPException(status_code=500, detail="Database test query failed")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
