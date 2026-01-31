import asyncio
from app.core.models import Merchant
from app.core.database import AsyncSessionLocal
from sqlalchemy import select
import sys
import logging

# Silence SqlAlchemy
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

async def check():
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Merchant))
            merchants = result.scalars().all()
            if merchants:
                print(f"UUID:{merchants[0].id}")
            else:
                print("UUID:NONE")
    except Exception as e:
        print(f"ERROR:{e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check())
