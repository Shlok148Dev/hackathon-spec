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

from app.api.v1 import health, tickets, decisions

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(decisions.router, prefix="/api/v1/decisions", tags=["decisions"])

from app.api.v1 import diagnosis
app.include_router(diagnosis.router, prefix="/api/v1", tags=["diagnosis"])
