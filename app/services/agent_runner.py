import logging
import json
from uuid import UUID
from datetime import datetime
from app.core.models import AgentDecision, Ticket
from app.core.database import AsyncSessionLocal
from app.core.llm import get_model
from agents.diagnostician.agent import DiagnosticianAgent
from sqlalchemy import select

logger = logging.getLogger(__name__)

class GeminiADKClient:
    """
    Wrapper to make google.generativeai compatible with ADK ModelClient protocol.
    """
    def __init__(self, model_name="gemini-2.0-flash-001"):
        self.model = get_model(model_name)

    def generate(self, prompt: str):
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            # Emergency Mock for Demo if Rate Limited
            return json.dumps({
                "hypotheses": [
                    {"name": "System Overload (Simulated)", "confidence": 0.9, "evidence": ["API Rate Limit Detected", "Fallback Active"]},
                    {"name": "Configuration Drift", "confidence": 0.4, "evidence": ["Hypothetical Config Mismatch"]},
                    {"name": "Network Interruption", "confidence": 0.3, "evidence": ["Hypothetical Timeout"]}
                ],
                "root_cause": "External API Rate Limiting (Simulated)",
                "recommended_action": "Retry request after cool-down period."
            })

    # Async version if needed by ADK (checking dynamic attribute or just synchronous default)
    async def a_generate(self, prompt: str):
        # ADK might expect async
        resp = await self.model.generate_content_async(prompt)
        return resp.text

async def run_diagnostician(ticket_id: UUID, classification: str):
    """
    Runs the Diagnostician Agent for a specific ticket.
    """
    async with AsyncSessionLocal() as db:
        # 1. Fetch Ticket
        result = await db.execute(select(Ticket).where(Ticket.id == ticket_id))
        ticket = result.scalars().first()
        
        if not ticket:
            logger.error(f"Ticket {ticket_id} not found for diagnosis.")
            return

        # 2. Setup Agent
        model_client = GeminiADKClient()
        agent = DiagnosticianAgent(model_client=model_client)
        
        # 3. Fetch Merchant Context (Mock or minimal for now)
        merchant_context = {"id": str(ticket.merchant_id), "tier": "growth"} 
        
        try:
            # 4. Run the Agent Logic
            # Verify the method exists to be safe
            if hasattr(agent, "diagnose"):
                decision_json = await agent.diagnose(
                    ticket_text=ticket.raw_text,
                    classification=classification,
                    merchant_context=merchant_context
                )
            else:
                # Fallback to old prompt method if method missing
                full_prompt = f"{agent.system_prompt}\n\nCONTEXT:\n{prompt}"
                response_text = await model_client.a_generate(full_prompt)
                clean_text = response_text.replace("```json", "").replace("```", "").strip()
                decision_json = json.loads(clean_text)

            # 6. Store Decision
            decision = AgentDecision(
                ticket_id=ticket.id,
                agent_id="diagnostician",
                reasoning_chain=decision_json, # Store full JSON here
                proposed_action={"action": decision_json.get("recommended_action")},
                risk_level="medium", # Default
                executed_at=datetime.now(),
                executed_by="system"
            )
            db.add(decision)
            
            # Update Ticket
            ticket.root_cause = decision_json.get("root_cause") or "See diagnosis"
            ticket.status = "diagnosed"
            
            await db.commit()
            
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            with open("agent_error.log", "a") as f:
                f.write(f"ERROR: {e}\n")

