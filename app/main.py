from fastapi import FastAPI
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Hermes Self-Healing Support",
    version="0.1.0-hackathon",
    description="Agentic AI system for headless commerce support"
)

@app.get("/")
async def root():
    return {"message": "Hermes System Online", "status": "active"}

from app.api.v1 import health, tickets, decisions

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(tickets.router, prefix="/v1/tickets", tags=["tickets"])
app.include_router(decisions.router, prefix="/v1/decisions", tags=["decisions"])
