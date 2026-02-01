
import asyncio
import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import get_settings

# Fix for Windows Event Loop
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def force_schema_update():
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL)
    
    print(f"🔌 Connecting to DB: {settings.DATABASE_URL.split('@')[1]}") # Hide credentials
    
    async with engine.begin() as conn:
        print("🔨 Checking schema...")
        # Check if column exists
        try:
            await conn.execute(text("SELECT resolved_at FROM tickets LIMIT 1"))
            print("✅ Column 'resolved_at' ALREADY EXISTS.")
        except Exception:
            print("⚠️ Column 'resolved_at' missing. Adding it now...")
            try:
                await conn.execute(text("ALTER TABLE tickets ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE"))
                print("✅ SUCCESSFULLY ADDED 'resolved_at'.")
            except Exception as e:
                print(f"❌ FAILED to add column: {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(force_schema_update())
