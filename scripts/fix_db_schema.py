
import asyncio
import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import get_settings

settings = get_settings()
# Windows fix
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def fix_schema():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        print("🔧 Attempting to fix DB schema...")
        try:
            # Try adding resolved_at column if missing
            await conn.execute(text("ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;"))
            print("✅ 'resolved_at' column ensure.")
        except Exception as e:
            print(f"⚠️ Error adding resolved_at: {e}")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix_schema())
