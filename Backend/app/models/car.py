from sqlalchemy import Column, Integer, String, Decimal
from app.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True)
    brand = Column(String(100))
    model = Column(String(100))
    price_per_day = Column(Decimal(10,2))
    status = Column(String(50), default="available")