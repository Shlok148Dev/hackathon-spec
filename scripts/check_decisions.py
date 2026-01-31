import sys
import os
import asyncio
sys.path.append(os.getcwd())

from app.core.models import AgentDecision
from app.core.database import AsyncSessionLocal
from sqlalchemy import select

async def check():
    print("Checking Decisions...")
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(AgentDecision))
            decisions = result.scalars().all()
            print(f"Found {len(decisions)} decisions.")
            for d in decisions:
                print(f"Decision: ticket={d.ticket_id} agent={d.agent_id}")
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
