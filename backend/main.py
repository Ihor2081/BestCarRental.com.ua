from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from typing import Optional
from database import get_db
from models import Car, TransmissionEnum, FuelTypeEnum, CarStatusEnum
import math

app = FastAPI(title="Car Sharing API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для dev, у production вказати домен фронтенду
    allow_methods=["*"],
    allow_headers=["*"]
)


# --- Cars Endpoint ---
@app.get("/cars")
async def get_cars(
    db: AsyncSession = Depends(get_db),

    page: int = Query(1, ge=1),
    page_size: int = Query(6, ge=1),

    sort: str = Query("recommended"),

    min_price: Optional[float] = None,
    max_price: Optional[float] = None,

    transmission: Optional[str] = None,
    fuel_type: Optional[str] = None,

    passengers: Optional[str] = None,
    luggage: Optional[str] = None,

    features: Optional[str] = None
):

    try:

        query = select(Car).where(Car.status == CarStatusEnum.available)

        # ---------- FILTERS ----------

        if min_price is not None:
            query = query.where(Car.price_per_day >= min_price)

        if max_price is not None:
            query = query.where(Car.price_per_day <= max_price)

        if transmission:
            transmission_list = [TransmissionEnum(t) for t in transmission.split(",")]
            query = query.where(Car.transmission.in_(transmission_list))

        if fuel_type:
            fuel_list = [FuelTypeEnum(f) for f in fuel_type.split(",")]
            query = query.where(Car.fuel_type.in_(fuel_list))

        if passengers:
            passengers_list = [int(p) for p in passengers.split(",")]
            query = query.where(Car.passengers.in_(passengers_list))

        if luggage:
            luggage_list = [int(l) for l in luggage.split(",")]
            query = query.where(Car.luggage.in_(luggage_list))

        if features:
            features_list = features.split(",")
            for feature in features_list:
                query = query.where(Car.features.ilike(f"%{feature}%"))

        # ---------- SORTING ----------

        if sort == "price_low":
            query = query.order_by(Car.price_per_day.asc())

        elif sort == "price_high":
            query = query.order_by(Car.price_per_day.desc())

        else:
            query = query.order_by(Car.id.asc())

        # ---------- COUNT (швидка pagination) ----------

        count_query = select(func.count()).select_from(query.subquery())
        total_items = (await db.execute(count_query)).scalar()

        total_pages = max(math.ceil(total_items / page_size), 1)

        # ---------- PAGINATION ----------

        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await db.execute(query)
        cars = result.scalars().all()

        # ---------- FORMAT RESPONSE ----------

        items = []

        for car in cars:

            features_list = []

            if car.features:
                features_list = [f.strip() for f in car.features.split(",")]

            items.append({
                "id": car.id,
                "brand": car.brand,
                "model": car.model,
                "category": car.category if hasattr(car, "category") else None,
                "price_per_day": float(car.price_per_day),
                "image": car.images or "https://picsum.photos/seed/car/800/600",
                "passengers": car.passengers,
                "luggage": car.luggage,
                "transmission": car.transmission.value,
                "fuel_type": car.fuel_type.value,
                "features": features_list
            })

        return {
            "items": items,
            "total_pages": total_pages
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Error fetching cars: {str(e)}"
        )


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

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )