from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from database import get_db
from models import AdditionalService
from pydantic import BaseModel
from typing import Optional


class ServiceBase(BaseModel):
    icon: str
    name: str
    desc: Optional[str] = None
    price: float


class ServiceResponse(ServiceBase):
    id: int


router = APIRouter(tags=["services"])


@router.get("/services", response_model=List[ServiceResponse])
async def get_services(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(AdditionalService).order_by(AdditionalService.name)
        )
        services = result.scalars().all()
        return services
    except Exception as e:
        print(f"Error fetching services: {e}")
        raise HTTPException(
            status_code=500, detail="Error fetching services from database"
        )