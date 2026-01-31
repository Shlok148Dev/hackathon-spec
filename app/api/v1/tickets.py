from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.models import Ticket, AgentDecision
from app.services.agent_runner import run_diagnostician
from sqlalchemy import select, desc

router = APIRouter()

class TicketCreate(BaseModel):
    merchant_id: UUID
    raw_text: str
    channel: str = "api"
    severity: int = 5

class TicketResponse(BaseModel):
    id: UUID
    status: str
    classification: Optional[str]
    created_at: datetime
    merchant_id: Optional[UUID] = None
    priority: Optional[int] = 0
    confidence: Optional[float] = 0.0
    raw_text: Optional[str] = None
    merchantName: Optional[str] = "Merchant" # For UI
    merchantAvatar: Optional[str] = None

    class Config:
        from_attributes = True

@router.post("/", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # 1. Create Request ID / Ticket ID
    new_ticket = Ticket(
        merchant_id=ticket.merchant_id,
        raw_text=ticket.raw_text,
        channel=ticket.channel,
        status="analyzing",
        priority=ticket.severity
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
         await run_diagnostician(new_ticket.id, cat)

    return new_ticket

@router.get("/", response_model=List[TicketResponse])
async def list_tickets(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Ticket).offset(skip).limit(limit).order_by(Ticket.created_at.desc()))
    tickets = result.scalars().all()
    # Map to schema if needed, but Pydantic should handle if fields match
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

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
        "recommended_action": decision.reasoning_chain.get("recommended_action"),
        "root_cause": decision.reasoning_chain.get("root_cause"),
        "raw_reasoning": decision.reasoning_chain
    }
