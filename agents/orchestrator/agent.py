from app.core.agent_base import Agent
from .tools import TOOLS

class OrchestratorAgent(Agent):
    def __init__(self, model_client):
        super().__init__(
            model_client=model_client,
            name="orchestrator",
            system_prompt="""You are the Orchestrator. Your goal is to Triage incoming tickets.
            1. ALWAYS call classify_ticket_tool first.
            2. Based on the classification:
               - If confidence < 0.6, ESCALATE to human.
               - If category == "DOCS_CONFUSION", route to HEALER.
               - If category == "CHECKOUT_BREAK", mark HIGH PRIORITY and route to DIAGNOSTICIAN.
               - Else, route to DIAGNOSTICIAN.
            3. Output your decision as a final response.""",
            tools=TOOLS
        )
