from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.future import select
from typing import List, Optional
from database import get_db
from models import Car
import math

app = FastAPI(title="Car Sharing API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для розробки, можна змінити на фронтенд домен
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Car Endpoint з фільтрами, сортуванням та пагінацією ---
@app.get("/cars")
async def get_cars(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(6, ge=1),
    sort: str = Query("recommended"),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    transmission: Optional[str] = None,  # comma-separated
    fuel_type: Optional[str] = None,     # comma-separated
    passengers: Optional[str] = None,   # comma-separated
    luggage: Optional[str] = None,      # comma-separated
    features: Optional[str] = None      # comma-separated
):
    try:
        query = select(Car).where(Car.status == "available")

        # --- Filters ---
        if min_price is not None:
            query = query.where(Car.price_per_day >= min_price)
        if max_price is not None:
            query = query.where(Car.price_per_day <= max_price)
        if transmission:
            transmission_list = transmission.split(",")
            query = query.where(Car.transmission.in_(transmission_list))
        if fuel_type:
            fuel_list = fuel_type.split(",")
            query = query.where(Car.fuel_type.in_(fuel_list))
        if passengers:
            passengers_list = [int(p) for p in passengers.split(",")]
            query = query.where(Car.passengers.in_(passengers_list))
        if luggage:
            luggage_list = [int(l) for l in luggage.split(",")]
            query = query.where(Car.luggage.in_(luggage_list))
        if features:
            features_list = features.split(",")
            # припускаємо, що Car.features - comma-separated string
            for feature in features_list:
                query = query.where(Car.features.ilike(f"%{feature}%"))

        # --- Sorting ---
        if sort == "price_low":
            query = query.order_by(Car.price_per_day.asc())
        elif sort == "price_high":
            query = query.order_by(Car.price_per_day.desc())
        else:
            query = query.order_by(Car.id.asc())  # recommended default

        # --- Pagination ---
        total_result = await db.execute(query)
        total_items = len(total_result.scalars().all())
        total_pages = max(math.ceil(total_items / page_size), 1)

        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(query)
        cars = result.scalars().all()

        # --- Форматуємо відповідь ---
        items = []
        for car in cars:
            items.append({
                "id": car.id,
                "brand": car.brand,
                "model": car.model,
                "category": car.category,
                "price_per_day": float(car.price_per_day),
                "image": car.images or "https://picsum.photos/seed/car/800/600",
                "passengers": car.passengers,
                "luggage": car.luggage,
                "transmission": car.transmission,
                "fuel_type": car.fuel_type,
                "features": car.features.split(",") if car.features else [],
            })

        return {"items": items, "total_pages": total_pages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cars: {str(e)}")


# --- DB Status Endpoint ---
@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        row = result.fetchone()
        if row and row[0] == 1:
            return {"status": "success"}
        raise HTTPException(status_code=500, detail="DB error")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))