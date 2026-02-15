from fastapi import FastAPI
from app.routers import auth, cars, bookings, payments

app = FastAPI(title="BestCarRental API")

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(cars.router, prefix="/api/cars", tags=["Cars"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

