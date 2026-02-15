from sqlalchemy import Column, Integer, String, Decimal
from app.database import Base

class AdditionalService(Base):
    __tablename__ = "additional_services"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    price = Column(Decimal(10,2))