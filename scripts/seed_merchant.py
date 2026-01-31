import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import get_settings
from app.core.models import Merchant

settings = get_settings()

async def seed():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if exists
        stmt = select(Merchant).where(Merchant.external_id == "ui_test_merchant")
        result = await session.execute(stmt)
        existing = result.scalars().first()
        
        mid = ""
        if existing:
            mid = str(existing.id)
        else:
            merchant_id = uuid.uuid4()
            merchant = Merchant(
                id=merchant_id,
                external_id="ui_test_merchant",
                tier="enterprise",
                migration_stage="completed",
                health_score=0.95
            )
            session.add(merchant)
            await session.commit()
            mid = str(merchant_id)
        
        with open("merchant_id.txt", "w") as f:
            f.write(mid)

if __name__ == "__main__":
    try:
        asyncio.run(seed())
    except:
        pass
