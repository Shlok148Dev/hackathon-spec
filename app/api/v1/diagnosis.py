from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.models import Ticket, AgentDecision
from agents.diagnostician.agent import DiagnosticianAgent
import json
import uuid

router = APIRouter()
agent = DiagnosticianAgent()

@router.get("/tickets/{ticket_id}/diagnosis")
async def get_diagnosis(ticket_id: str, db: AsyncSession = Depends(get_db)):
    """Get reasoning chain and hypotheses for a ticket"""
    
    try:
        uuid_obj = uuid.UUID(ticket_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    # Async Query to Ticket
    result = await db.execute(select(Ticket).where(Ticket.id == uuid_obj))
    ticket = result.scalars().first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Check for existing decision
    d_result = await db.execute(select(AgentDecision).where(
        AgentDecision.ticket_id == uuid_obj,
        AgentDecision.agent_id == "diagnostician"
    ))
    decision = d_result.scalars().first()
    
    if decision and decision.reasoning_chain:
        return decision.reasoning_chain
    
    # Generate new diagnosis
    merchant_context = {
        "tier": "growth",  # Fetch from DB in real implementation
        "migration_stage": "week_2"
    }
    
    diagnosis = await agent.diagnose(
        ticket_text=ticket.raw_text,
        classification=ticket.classification or "UNKNOWN",
        merchant_context=merchant_context
    )
    
    # Store in DB
    new_decision = AgentDecision(
        ticket_id=uuid_obj,
        agent_id="diagnostician",
        reasoning_chain=diagnosis,
        proposed_action={"action": diagnosis.get("recommended_action", "Review")},
        action_type="human_approved", 
        risk_level="medium", 
        executed_by="agent"
    )
    db.add(new_decision)
    await db.commit()
    
    return diagnosis
