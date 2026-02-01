from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from app.core.database import get_db
from app.core.models import AgentDecision

router = APIRouter()

class ApprovalRequest(BaseModel):
    approved: bool
    approver_id: str
    justification: str

@router.post("/{ticket_id}/approve")
async def approve_decision(ticket_id: UUID, approval: ApprovalRequest, db: AsyncSession = Depends(get_db)):
    try:
        from app.core.models import Ticket
        from datetime import datetime
        
        # Use UUID directly - FastAPI parses it
        ticket = await db.get(Ticket, ticket_id)
        
        if not ticket:
             raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
        
        # Simple update
        ticket.status = "resolved" if approval.approved else "escalated"
        ticket.resolved_at = datetime.utcnow()
        
        await db.commit()
        return {"status": ticket.status, "ticket_id": str(ticket_id)}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

import uuid as import_uuid
