from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date
from app.database import get_db
from app.models.booking import Booking

router = APIRouter()

@router.post("/")
def create_booking(car_id: int, user_id: int, start: date, end: date, db: Session = Depends(get_db)):

    conflict = db.query(Booking).filter(
        Booking.car_id == car_id,
        Booking.status == "confirmed",
        and_(
            Booking.start_date < end,
            Booking.end_date > start
        )
    ).first()

    if conflict:
        raise HTTPException(status_code=400, detail="Car already booked")

    booking = Booking(
        car_id=car_id,
        user_id=user_id,
        start_date=start,
        end_date=end,
        status="confirmed"
    )

    db.add(booking)
    db.commit()
    return {"message": "Booking created"}