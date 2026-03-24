from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
from models import Car
from auth import router as auth_router
from admin import router as admin_router
from users import router as users_router
from catalog import router as catalog_router

load_dotenv()

app = FastAPI(title="Car Sharing API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(catalog_router, prefix="/api/catalog")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(admin_router, prefix="/api/admin")
app.include_router(users_router, prefix="/api/users")

@app.get("/api/debug")
async def debug_info():
    return {
        "env_loaded": os.getenv("DB_NAME") is not None,
        "db_host": os.getenv("DB_HOST"),
        "db_name": os.getenv("DB_NAME"),
        "cwd": os.getcwd(),
        "files_in_backend": os.listdir("backend") if os.path.exists("backend") else "backend dir not found"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend is reachable"}

@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response status: {response.status_code}")
    return response

@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        row = result.fetchone()
        if row and row[0] == 1:
            return {"status": "success", "message": "Database connection is healthy", "db": "MySQL"}
        raise HTTPException(status_code=500, detail="Database test query failed")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
