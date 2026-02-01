
import sys
import os
sys.path.append(os.getcwd())
import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings
from app.core.models import Merchant

settings = get_settings()
engine = create_async_engine(settings.DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

TEST_MERCHANT_ID = "123e4567-e89b-12d3-a456-426614174000"

async def seed():
    async with AsyncSessionLocal() as db:
        try:
            # Check if exists
            m = await db.get(Merchant, uuid.UUID(TEST_MERCHANT_ID))
            if not m:
                print(f"Seeding merchant {TEST_MERCHANT_ID}...")
                new_merchant = Merchant(
                    id=uuid.UUID(TEST_MERCHANT_ID),
                    external_id="test-merchant-001",
                    tier="enterprise",
                    migration_stage="in_progress",
                    config_json={"platform": "shopify"},
                    health_score=0.95
                )
                db.add(new_merchant)
                await db.commit()
                print("✅ Merchant seeded.")
            else:
                print("ℹ️ Merchant already exists.")
        except Exception as e:
            print(f"❌ Seed failed: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(seed())
