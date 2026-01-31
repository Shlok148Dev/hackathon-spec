from fastapi import APIRouter
from pydantic import BaseModel
from uuid import UUID

router = APIRouter()

class ApprovalRequest(BaseModel):
    approved: bool
    approver_id: UUID
    justification: str

@router.post("/{decision_id}/approve")
async def approve_decision(decision_id: UUID, approval: ApprovalRequest):
    return {"status": "processed", "decision_id": decision_id, "approved": approval.approved}
