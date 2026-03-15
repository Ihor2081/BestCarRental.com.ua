from sqlalchemy import Column, BigInteger, String, SmallInteger, Integer, Text, Numeric, Enum, TIMESTAMP, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# ---------- ENUMS ----------

class TransmissionEnum(str, enum.Enum):
    automatic = "automatic"
    mechanic = "mechanic"


class FuelTypeEnum(str, enum.Enum):
    gasoline = "gasoline"
    gas = "gas"
    electricity = "electricity"


class CarStatusEnum(str, enum.Enum):
    available = "available"
    reserved = "reserved"
    in_service = "in_service"
    inactive = "inactive"


class RoleEnum(str, enum.Enum):
    client = "client"
    admin = "admin"


class DealStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"
    disputed = "disputed"


# ---------- USER ----------

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    role = Column(Enum(RoleEnum), default=RoleEnum.client)

    phone = Column(String(30))
    drivers_license = Column(String(50))
    address = Column(String(255))

    card_number = Column(String(50))
    expires = Column(Date)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    deals = relationship(
        "Deal",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ---------- CAR ----------

class Car(Base):
    __tablename__ = "cars"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)

    year = Column(SmallInteger, nullable=False)

    license_plate = Column(String(20), unique=True, nullable=False)

    color = Column(String(50))

    passengers = Column(Integer, default=5)
    luggage = Column(Integer, default=2)

    transmission = Column(Enum(TransmissionEnum), nullable=False)

    fuel_type = Column(Enum(FuelTypeEnum), nullable=False)

    features = Column(Text)
    description = Column(Text)

    images = Column(Text)

    price_per_day = Column(Numeric(10, 2), nullable=False)

    status = Column(
        Enum(CarStatusEnum),
        default=CarStatusEnum.available
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    deals = relationship("Deal", back_populates="car")


# ---------- DEAL ----------

class Deal(Base):
    __tablename__ = "deals"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    car_id = Column(
        BigInteger,
        ForeignKey("cars.id"),
        nullable=False,
        index=True
    )

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    total_price = Column(Numeric(10, 2), nullable=False)

    pick_up_location = Column(String(255))

    additional_services = Column(Text)

    status = Column(
        Enum(DealStatusEnum),
        default=DealStatusEnum.pending
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    user = relationship("User", back_populates="deals")

    car = relationship("Car", back_populates="deals")


# ---------- DISCOUNTS ----------

class AvailableDiscount(Base):
    __tablename__ = "available_discounts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    min_days = Column(Integer, nullable=False)
    max_days = Column(Integer, nullable=False)

    discount_percent = Column(Numeric(5, 2), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )


# ---------- ADDITIONAL SERVICES ----------

class AdditionalService(Base):
    __tablename__ = "additional_services"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    icon = Column(String(50), nullable=False)

    name = Column(String(100), nullable=False)

    desc = Column(Text)

    price = Column(Numeric(10, 2), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )