from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Car
from auth import router as auth_router

load_dotenv()

app = FastAPI(title="Car Sharing API")

# Include routers
app.include_router(auth_router)

# --- Car Endpoints ---

@app.get("/api/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    """Fetch cars from the MySQL database using SQLAlchemy"""
    try:
        result = await db.execute(select(Car))
        cars = result.scalars().all()
        
        if not cars:
            return [
                {"id": 1, "name": "Mercedes-Benz E-Class", "category": "Sedan", "price": 120, "img": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"},
                {"id": 2, "name": "Range Rover Sport", "category": "SUV", "price": 180, "img": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"},
                {"id": 3, "name": "Porsche 911 Carrera", "category": "Sports", "price": 350, "img": "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"},
                {"id": 4, "name": "Tesla Model 3", "category": "Electric", "price": 95, "img": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop"},
                {"id": 5, "name": "Toyota Corolla", "category": "Compact", "price": 65, "img": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"},
                {"id": 6, "name": "BMW Z4 Roadster", "category": "Convertible", "price": 200, "img": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2070&auto=format&fit=crop"}
            ]
            
        formatted_cars = []
        for car in cars:
            formatted_cars.append({
                "id": car.id,
                "name": f"{car.brand} {car.model}",
                "category": "Sedan",
                "price": float(car.price_per_day),
                "img": car.images or "https://picsum.photos/seed/car/800/600"
            })
        return formatted_cars
    except Exception as e:
        print(f"Error fetching cars: {e}")
        return [
            {"id": 1, "name": "Mercedes-Benz E-Class", "category": "Sedan", "price": 120, "img": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"},
            {"id": 2, "name": "Range Rover Sport", "category": "SUV", "price": 180, "img": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"},
            {"id": 3, "name": "Porsche 911 Carrera", "category": "Sports", "price": 350, "img": "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"},
            {"id": 4, "name": "Tesla Model 3", "category": "Electric", "price": 95, "img": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop"},
            {"id": 5, "name": "Toyota Corolla", "category": "Compact", "price": 65, "img": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"},
            {"id": 6, "name": "BMW Z4 Roadster", "category": "Convertible", "price": 200, "img": "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2070&auto=format&fit=crop"}
        ]

@app.get("/api/fleet")
async def get_fleet():
    return [
        {"id": 1, "name": "Mercedes-Benz E-Class", "category": "Sedan", "price": 120, "status": "available", "bookings": 45, "img": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"},
        {"id": 2, "name": "Range Rover Sport", "category": "SUV", "price": 180, "status": "rented", "bookings": 32, "img": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"},
        {"id": 3, "name": "Tesla Model 3", "category": "Electric", "price": 95, "status": "available", "bookings": 58, "img": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop"},
        {"id": 4, "name": "Porsche 911 Carrera", "category": "Sports", "price": 350, "status": "maintenance", "bookings": 12, "img": "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"}
    ]

@app.get("/api/bookings")
async def get_bookings():
    return [
        {"id": "B001", "customer": "John Anderson", "email": "john.anderson@email.com", "vehicle": "Mercedes-Benz E-Class", "dates": "Mar 15 - Mar 20", "total": "$600", "status": "upcoming"},
        {"id": "B002", "customer": "Sarah Miller", "email": "sarah.m@example.com", "vehicle": "Tesla Model 3", "dates": "Feb 10 - Feb 15", "total": "$475", "status": "completed"},
        {"id": "B003", "customer": "Robert Wilson", "email": "r.wilson@test.com", "vehicle": "Range Rover Sport", "dates": "Jan 20 - Jan 27", "total": "$1260", "status": "completed"}
    ]

@app.get("/api/customers")
async def get_customers():
    return [
        {"id": 1, "name": "John Anderson", "email": "john.anderson@email.com", "bookings": 12, "spent": "$4,250", "since": "Jan 2024"},
        {"id": 2, "name": "Sarah Miller", "email": "sarah.m@example.com", "bookings": 5, "spent": "$1,850", "since": "Mar 2024"},
        {"id": 3, "name": "Robert Wilson", "email": "r.wilson@test.com", "bookings": 8, "spent": "$3,120", "since": "Feb 2024"}
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
