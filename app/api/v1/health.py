from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

@router.get("/live")
async def liveness_check():
    return {"status": "ok", "service": "hermes-api"}

@router.get("/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    try:
        # Try a simple query
        await db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
