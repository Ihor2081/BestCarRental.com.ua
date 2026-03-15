from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import Car
from database import get_db
from routes import auth  # <- наш новий auth.py
import math
from fastapi import Query, Depends

app = FastAPI(title="Car Sharing API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # змінити на фронтенд-домен у продакшені
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Include Auth Router ---
app.include_router(auth.router, prefix="/api/auth")

# --- Car Endpoint ---
@app.get("/cars")
async def get_cars(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(6, ge=1),
    sort: str = Query("recommended"),
    min_price: float = Query(0),
    max_price: float = Query(1000),
    transmission: str = Query(None),
    fuel_type: str = Query(None),
    passengers: str = Query(None),
    luggage: str = Query(None),
    features: str = Query(None),
    location: str = Query(None),
    pickup_date: str = Query(None),
    return_date: str = Query(None)
):
    try:
        query = select(Car).where(Car.status == "available")

        # --- Filters ---
        if min_price is not None:
            query = query.where(Car.price_per_day >= min_price)
        if max_price is not None:
            query = query.where(Car.price_per_day <= max_price)
        if transmission:
            query = query.where(Car.transmission.in_(transmission.split(",")))
        if fuel_type:
            query = query.where(Car.fuel_type.in_(fuel_type.split(",")))
        if passengers:
            query = query.where(Car.passengers.in_([int(p) for p in passengers.split(",")]))
        if luggage:
            query = query.where(Car.luggage.in_([int(l) for l in luggage.split(",")]))
        if features:
            for f in features.split(","):
                query = query.where(Car.features.ilike(f"%{f}%"))
        if location:
            query = query.where(Car.description.ilike(f"%{location}%"))  # приклад пошуку по локації

        # --- Sorting ---
        if sort == "price_low":
            query = query.order_by(Car.price_per_day.asc())
        elif sort == "price_high":
            query = query.order_by(Car.price_per_day.desc())
        else:
            query = query.order_by(Car.id.asc())

        # --- Pagination ---
        total_result = await db.execute(query)
        total_items = len(total_result.scalars().all())
        total_pages = max(math.ceil(total_items / page_size), 1)

        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(query)
        cars = result.scalars().all()

        # --- Format response ---
        items = []
        for car in cars:
            items.append({
                "id": car.id,
                "brand": car.brand,
                "model": car.model,
                "category": car.category,
                "price_per_day": float(car.price_per_day),
                "images": car.images or "https://picsum.photos/seed/car/800/600",
                "passengers": car.passengers,
                "luggage": car.luggage,
                "transmission": car.transmission,
                "fuel_type": car.fuel_type,
                "features": car.features.split(",") if car.features else [],
            })

        return {"items": items, "total_pages": total_pages}

    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))

# --- DB Status ---
@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute("SELECT 1")
        row = result.fetchone()
        if row and row[0] == 1:
            return {"status": "success"}
        raise Exception("DB error")
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=str(e))