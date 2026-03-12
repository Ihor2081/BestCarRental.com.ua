from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Car
from auth import router as auth_router
from admin import router as admin_router

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
            return [
                {"id": 1, "brand": "Mercedes-Benz", "model": "E-Class", "year": 2023, "license_plate": "MB-001", "transmission": "automatic", "fuel_type": "gasoline", "price_per_day": 120, "images": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 5, "luggage": 2, "bookings_count": 0},
                {"id": 2, "brand": "Land Rover", "model": "Range Rover Sport", "year": 2022, "license_plate": "RR-002", "transmission": "automatic", "fuel_type": "gasoline", "price_per_day": 180, "images": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 5, "luggage": 3, "bookings_count": 0},
                {"id": 3, "brand": "Porsche", "model": "911 Carrera", "year": 2023, "license_plate": "P-911", "transmission": "automatic", "fuel_type": "gasoline", "price_per_day": 350, "images": "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 2, "luggage": 1, "bookings_count": 0},
                {"id": 4, "brand": "Tesla", "model": "Model 3", "year": 2023, "license_plate": "T-003", "transmission": "automatic", "fuel_type": "electricity", "price_per_day": 95, "images": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 5, "luggage": 2, "bookings_count": 0}
            ]
            
        formatted_cars = []
        for car in cars:
            formatted_cars.append({
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
                "bookings_count": 0 # This is a simplified view
            })
        return formatted_cars
    except Exception as e:
        print(f"Error fetching cars: {e}")
        return [
            {"id": 1, "brand": "Mercedes-Benz", "model": "E-Class", "year": 2023, "license_plate": "MB-001", "transmission": "automatic", "fuel_type": "gasoline", "price_per_day": 120, "images": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 5, "luggage": 2, "bookings_count": 0},
            {"id": 2, "brand": "Land Rover", "model": "Range Rover Sport", "year": 2022, "license_plate": "RR-002", "transmission": "automatic", "fuel_type": "gasoline", "price_per_day": 180, "images": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop", "status": "available", "passengers": 5, "luggage": 3, "bookings_count": 0}
        ]

@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        row = result.fetchone()
        if row and row[0] == 1:
            return {"status": "success", "message": "Database connection is healthy", "db": "MySQL"}
        raise HTTPException(status_code=500, detail="Database test query failed")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
