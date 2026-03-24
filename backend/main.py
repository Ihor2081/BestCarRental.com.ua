from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from dotenv import load_dotenv

from database import get_db
from auth import router as auth_router
from admin import router as admin_router
from users import router as users_router
from cars import router as cars_router

load_dotenv()

app = FastAPI(title="Car Sharing API")

# Include routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(cars_router)

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
