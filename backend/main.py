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
async def get_cars(db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Car).where(Car.status == "available")
    )

    cars = result.scalars().all()

    return [
        {
            "id": car.id,
            "brand": car.brand,
            "model": car.model,
            "category": car.category,
            "price_per_day": float(car.price_per_day),
            "image": car.images,
            "passengers": car.passengers
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