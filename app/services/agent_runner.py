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
            return "Error generating response."

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
        
        # 3. Construct Input
        # Logic: We pass the ticket details to the agent
        prompt = f"""
        Ticket ID: {ticket.id}
        Merchant ID: {ticket.merchant_id}
        Classification: {classification}
        Issue: {ticket.raw_text}
        
        Please START YOUR DIAGNOSIS.
        """
        
        # 4. Run Agent (Simulated run loop if ADK run() is complex, 
        # but we'll try standard agent.run() if available or generate())
        # Since I don't trust the specific ADK installed version's loop, I'll create a minimal loop here
        # or just call generate if it's a single-shot agent. 
        # The Diagnostician Prompt implies OODA loop which might be multi-turn.
        # For Phase 2 Demo, we'll do a single thorough pass using the "One Shot" capabilities of Gemini 1.5 Pro
        # with the "OODA" prompt instructions.
        
        try:
            # We treat the agent prompt + ticket as the input.
            full_prompt = f"{agent.system_prompt}\n\nCONTEXT:\n{prompt}"
            
            response_text = await model_client.a_generate(full_prompt)
            
            # 5. Parse Output
            # We expect JSON
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            decision_json = {}
            try:
                decision_json = json.loads(clean_text)
            except:
                logger.warning("Agent did not return valid JSON. Wrapping text.")
                decision_json = {"raw_response": response_text}
                
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
            ticket.root_cause = decision_json.get("root_cause")
            ticket.status = "diagnosed"
            
            await db.commit()
            
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")

