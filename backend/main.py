from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from sqlalchemy.future import select
import os

from database import get_db, engine, Base
from models import Car

app = FastAPI(title="Car Sharing API")

# Ensure the frontend directories exist to avoid mounting errors
os.makedirs("frontend/static", exist_ok=True)
# Mount static files (CSS, JS, Images) if they exist
if os.path.exists("frontend/static"):
    app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

templates = Jinja2Templates(directory="frontend") if os.path.exists("frontend/index.html") else None

def render_template(request: Request, template_name: str):
    if templates:
        return templates.TemplateResponse(template_name, {"request": request})
    return HTMLResponse(f"Template {template_name} not found. Please place it in the frontend folder.")

@app.get("/", response_class=HTMLResponse)
async def read_home(request: Request):
    return render_template(request, "index.html")

@app.get("/product", response_class=HTMLResponse)
async def read_product(request: Request):
    return render_template(request, "product.html")

@app.get("/profile", response_class=HTMLResponse)
async def read_profile(request: Request):
    return render_template(request, "profile.html")

@app.get("/about", response_class=HTMLResponse)
async def read_about(request: Request):
    return render_template(request, "about.html")

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request):
    return render_template(request, "admin.html")

# --- API Endpoints ---

@app.get("/api/cars")
async def get_cars(db: AsyncSession = Depends(get_db)):
    """Fetch cars from the MySQL database using SQLAlchemy"""
    result = await db.execute(select(Car))
    cars = result.scalars().all()
    
    # If DB is empty, return the mock data for testing as fallback
    if not cars:
        return [
            {"id": 1, "name": "Mercedes-Benz E-Class", "price": 120},
            {"id": 2, "name": "Range Rover Sport", "price": 180},
        ]
        
    return cars

@app.get("/db-status")
async def db_status(db: AsyncSession = Depends(get_db)):
    """Health check endpoint to verify database connection"""
    try:
        # Execute a simple test query
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