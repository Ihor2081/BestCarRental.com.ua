from sqlalchemy import Column, Integer, ForeignKey, Decimal, String
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    amount = Column(Decimal(10,2))
    status = Column(String(50))