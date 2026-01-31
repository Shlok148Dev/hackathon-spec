import asyncio
from sqlalchemy import text
from app.core.database import engine
from app.core.models import Base, Merchant
from app.core.database import AsyncSessionLocal
import uuid

async def init_db():
    print("Initializing Database...")
    async with engine.begin() as conn:
        print("Creating extensions...")
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        
        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created.")

    # Seed a merchant for testing
    async with AsyncSessionLocal() as session:
        # Check if merchant exists
        from sqlalchemy import select
        result = await session.execute(select(Merchant).limit(1))
        merchant = result.scalars().first()
        
        if not merchant:
            print("Seeding test merchant...")
            new_merchant = Merchant(
                id=uuid.UUID("12345678-1234-5678-1234-567812345678"),
                external_id="merch_123",
                tier="growth",
                migration_stage="in_progress",
                config_json={"api_version": "v2"}
            )
            session.add(new_merchant)
            await session.commit()
            print(f"Seeded merchant: {new_merchant.id}")
        else:
            print(f"Merchant already exists: {merchant.id}")

if __name__ == "__main__":
    asyncio.run(init_db())
