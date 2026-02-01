from fastapi import FastAPI
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Hermes Self-Healing Support",
    version="0.1.0-hackathon",
    description="Agentic AI system for headless commerce support"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hermes System Online", "status": "active"}

# EMERGENCY MIGRATION
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
@app.on_event("startup")
async def startup_db_check():
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            await conn.execute(text("ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE;"))
            print("✅ MIGRATION SUCCESS: 'resolved_at' column ensured.")
        await engine.dispose()
    except Exception as e:
        print(f"⚠️ MIGRATION WARNING: {e}")

from app.api.v1 import tickets, diagnosis, health, decisions, metrics

app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(diagnosis.router, prefix="/api/v1/tickets", tags=["diagnosis"]) # diagnosis often hangs off tickets or standalone
app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(decisions.router, prefix="/api/v1/decisions", tags=["decisions"])
app.include_router(metrics.router, prefix="/api/v1", tags=["metrics"])
