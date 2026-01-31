from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.models import Ticket

router = APIRouter()

class TicketCreate(BaseModel):
    merchant_id: UUID
    raw_text: str
    channel: str = "api"

class TicketResponse(BaseModel):
    id: UUID
    status: str
    classification: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.services.agent_runner import run_diagnostician
from sqlalchemy import select, desc
from app.core.models import AgentDecision

# ... (Previous imports)

@router.post("/", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # 1. Create Request ID / Ticket ID
    new_ticket = Ticket(
        merchant_id=ticket.merchant_id,
        raw_text=ticket.raw_text,
        channel=ticket.channel,
        status="analyzing"
    )
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)

    # 2. Run Classification
    from app.services.classifier import TicketClassifier
    classifier = TicketClassifier()
    classification = await classifier.classify(ticket.raw_text)
    
    # Update Ticket
    cat = classification.get("category")
    new_ticket.classification = cat
    new_ticket.classification_confidence = classification.get("confidence")
    new_ticket.priority = classification.get("urgency")
    await db.commit()
    
    # 3. Trigger Agent (Diagnostician) if technical issue
    # For Demo speed: If "API_ERROR", "WEBHOOK", "CHECKOUT", run immediately.
    if cat in ["API_ERROR", "WEBHOOK_FAIL", "CHECKOUT_BREAK", "CONFIG_ERROR"]:
         # Running as background task so API returns fast, but user might check too soon.
         # For the exact curl sequence "POST then GET", we might want to await it if it's fast.
         # Gemini 1.5 Pro is ~2-3s.
         # Let's await it for the PROOF purpose.
         await run_diagnostician(new_ticket.id, cat)

    return {
        "id": new_ticket.id,
        "status": "analyzed",
        "classification": new_ticket.classification,
        "created_at": new_ticket.created_at
    }

@router.get("/{ticket_id}/diagnosis")
async def get_ticket_diagnosis(ticket_id: UUID, db: AsyncSession = Depends(get_db)):
    # Fetch the latest decision
    stmt = select(AgentDecision).where(AgentDecision.ticket_id == ticket_id).order_by(desc(AgentDecision.executed_at))
    result = await db.execute(stmt)
    decision = result.scalars().first()
    
    if not decision:
        return {"status": "processing", "message": "Diagnosis not yet available."}
        
    # Return the structured JSON stored in reasoning_chain
    # The spec asked for specific fields: classification, hypotheses, etc.
    # Classification is in the ticket, hypotheses in decision logic.
    
    # Fetch ticket for classification
    t_result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = t_result.scalars().first()
    
    return {
        "ticket_id": ticket_id,
        "classification": ticket.classification,
        "confidence": ticket.classification_confidence,
        "hypotheses": decision.reasoning_chain.get("hypotheses", []),
        "root_cause": decision.reasoning_chain.get("root_cause"),
        "raw_reasoning": decision.reasoning_chain
    }
