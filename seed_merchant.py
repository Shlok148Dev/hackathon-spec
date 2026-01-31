import asyncio
from app.core.database import AsyncSessionLocal
from app.core.models import Merchant
from sqlalchemy import select
import uuid

async def seed_merchant():
    async with AsyncSessionLocal() as db:
        # Check if test merchant exists
        stmt = select(Merchant).limit(1)
        result = await db.execute(stmt)
        merchant = result.scalars().first()
        
        if not merchant:
            print("Creating new merchant...")
            merchant = Merchant(
                external_id="test_merchant_001",
                tier="growth",
                migration_stage="in_progress"
            )
            db.add(merchant)
            await db.commit()
            await db.refresh(merchant)
        
        with open("merchant_id.txt", "w") as f:
            f.write(str(merchant.id))
        print(f"MERCHANT_ID={merchant.id}")

if __name__ == "__main__":
    try:
        asyncio.run(seed_merchant())
    except Exception as e:
        pass # Ignore loop close errors if logic worked

