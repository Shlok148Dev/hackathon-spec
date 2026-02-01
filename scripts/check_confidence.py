import asyncio
import sys
sys.path.append('.')

from app.core.database import AsyncSessionLocal
from app.core.models import Ticket
from sqlalchemy import select

async def check_confidence():
    print("TICKET CONFIDENCE CHECK:")
    print("=" * 60)
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(
                Ticket.id,
                Ticket.classification,
                Ticket.classification_confidence
).limit(10)
        )
        tickets = result.all()
        
        for tid, cls, conf in tickets:
            conf_display = f"{conf}" if conf is not None else "NULL"
            print(f"{str(tid)[:8]}... | {cls:20} | {conf_display}")
        
        # Count problematic tickets
        result2 = await session.execute(
            select(Ticket).where(
                (Ticket.classification_confidence == None) | 
                (Ticket.classification_confidence == 0)
            )
        )
        problematic = result2.all()
        print(f"\n⚠️  CRITICAL: {len(problematic)} tickets with 0% or NULL confidence")

if __name__ == "__main__":
    asyncio.run(check_confidence())
