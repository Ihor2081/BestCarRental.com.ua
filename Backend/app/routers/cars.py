from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.car import Car

router = APIRouter()

@router.post("/")
def create_car(brand: str, model: str, price: float, db: Session = Depends(get_db)):
    car = Car(brand=brand, model=model, price_per_day=price)
    db.add(car)
    db.commit()
    return {"message": "Car added"}

@router.get("/")
def get_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()