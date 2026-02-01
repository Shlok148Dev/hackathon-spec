import asyncio
import sys
import os
from sqlalchemy import select, func

# Add project root to sys.path
sys.path.append(os.getcwd())

from app.core.database import AsyncSessionLocal
from app.core.models import Ticket

async def verify():
    print("=== VERIFYING DEMO DATA ===")
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Ticket.classification, func.count(Ticket.id))
            .group_by(Ticket.classification)
        )
        rows = result.all()
        
        counts = {r[0]: r[1] for r in rows}
        print(f"Ticket Counts by Classification: {counts}")
        
        required = ['CHECKOUT_BREAK', 'API_ERROR', 'WEBHOOK_FAIL', 'CONFIG_ERROR', 'DOCS_CONFUSION']
        missing = [cat for cat in required if counts.get(cat, 0) < 4]
        
        if missing:
            print(f"❌ FAIL: Missing or insufficient tickets for: {missing}")
            sys.exit(1)
        else:
            print("✅ PASS: All categories have 4+ tickets.")
            sys.exit(0)

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(verify())
