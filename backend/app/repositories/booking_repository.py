from typing import Optional, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_, or_, desc
from sqlalchemy.orm import joinedload
from app.models.booking import Deal, DealStatusEnum
from app.models.car import Car
from app.models.user import User
from app.repositories.base_repository import BaseRepository

class BookingRepository(BaseRepository[Deal]):
    def __init__(self, db: AsyncSession):
        super().__init__(Deal, db)

    async def get_user_bookings(self, user_id: int) -> List[Deal]:
        result = await self.db.execute(
            select(Deal)
            .where(Deal.user_id == user_id)
            .options(joinedload(Deal.car))
            .order_by(Deal.created_at.desc())
        )
        return result.scalars().all()

    async def get_admin_bookings(self, status: Optional[DealStatusEnum] = None, search: Optional[str] = None) -> List[Deal]:
        query = select(Deal).join(Deal.user).join(Deal.car).options(joinedload(Deal.user), joinedload(Deal.car))
        
        if status:
            query = query.where(Deal.status == status)
        
        if search:
            from sqlalchemy import String
            query = query.where(
                or_(
                    User.name.ilike(f"%{search}%"),
                    func.cast(Deal.id, String).ilike(f"%{search}%")
                )
            )
        
        query = query.order_by(desc(Deal.created_at))
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_stats_for_user(self, user_id: int):
        total_deals_res = await self.db.execute(select(func.count(Deal.id)).where(Deal.user_id == user_id))
        total_deals = total_deals_res.scalar() or 0

        active_deals_res = await self.db.execute(select(func.count(Deal.id)).where(
            Deal.user_id == user_id,
            Deal.status == DealStatusEnum.active
        ))
        active_deals = active_deals_res.scalar() or 0

        total_spent_res = await self.db.execute(select(func.sum(Deal.total_price)).where(
            Deal.user_id == user_id,
            Deal.status.in_([DealStatusEnum.confirmed, DealStatusEnum.active, DealStatusEnum.completed])
        ))
        total_spent = total_spent_res.scalar() or 0
        
        return total_deals, active_deals, total_spent
