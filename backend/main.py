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

@app.get("/cars")
async def get_cars(
    db: AsyncSession = Depends(get_db),

    # sorting
    sort: str | None = None,

    # price filter
    price_min: float | None = None,
    price_max: float | None = None,

    # specs filters
    transmission: str | None = None,
    fuel_type: str | None = None,
    passengers: int | None = None,
    luggage: int | None = None,

    # features
    gps: bool | None = None,
    bluetooth: bool | None = None,
    leather: bool | None = None
):

    query = select(Car).where(Car.status == "available")

    # ---- FILTERS ----

    if price_min is not None:
        query = query.where(Car.price_per_day >= price_min)

    if price_max is not None:
        query = query.where(Car.price_per_day <= price_max)

    if transmission:
        query = query.where(Car.transmission == transmission)

    if fuel_type:
        query = query.where(Car.fuel_type == fuel_type)

    if passengers:
        query = query.where(Car.passengers >= passengers)

    if luggage:
        query = query.where(Car.luggage >= luggage)

    # ---- FEATURES ----

    if gps:
        query = query.where(Car.features.contains(["GPS"]))

    if bluetooth:
        query = query.where(Car.features.contains(["Bluetooth"]))

    if leather:
        query = query.where(Car.features.contains(["Leather Seats"]))

    # ---- SORTING ----

    if sort == "price_low":
        query = query.order_by(Car.price_per_day.asc())

    elif sort == "price_high":
        query = query.order_by(Car.price_per_day.desc())

    elif sort == "recommended":
        query = query.order_by(Car.bookings_count.desc())

    # ---- EXECUTE QUERY ----

    result = await db.execute(query)
    cars = result.scalars().all()

    return [
        {
            "id": car.id,
            "brand": car.brand,
            "model": car.model,
            "category": car.category,
            "price_per_day": float(car.price_per_day),
            "image": car.images,
            "passengers": car.passengers,
            "luggage": car.luggage,
            "transmission": car.transmission,
            "fuel_type": car.fuel_type,
            "features": car.features
        }
        for car in cars
    ]


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)