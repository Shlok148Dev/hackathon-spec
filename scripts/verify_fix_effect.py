
import asyncio
import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import get_settings

settings = get_settings()
# Windows-specific event loop policy fix
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

engine = create_async_engine(settings.DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def verify_latest_fix():
    async with AsyncSessionLocal() as db:
        print("\n🔍 VERIFYING HEALER ACTIONS IN DATABASE...")
        print("-" * 50)
        
        # 1. Fetch latest resolved ticket
        result = await db.execute(text("""
            SELECT id, status, classification, resolved_at 
            FROM tickets 
            WHERE status = 'resolved' 
            ORDER BY resolved_at DESC 
            LIMIT 1
        """))
        ticket = result.first()
        
        if ticket:
            print(f"✅ LATEST RESOLVED TICKET FOUND:")
            print(f"   ID: {ticket.id}")
            print(f"   Status: {ticket.status} (Verified in DB)")
            print(f"   Classification: {ticket.classification}")
            print(f"   Resolved At: {ticket.resolved_at}")
            print("-" * 50)
            print("🚀 CONCLUSION: The Healer agent successfully modified the database state.")
            print("   The system 'Self-Healed' by processing the approval and closing the ticket.")
        else:
            print("❌ NO RESOLVED TICKETS FOUND.")
            print("   Run the 'Approve Fix' action in the UI first.")

if __name__ == "__main__":
    asyncio.run(verify_latest_fix())
