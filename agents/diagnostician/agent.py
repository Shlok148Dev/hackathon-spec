from app.core.agent_base import Agent
from .tools import TOOLS

class DiagnosticianAgent(Agent):
    def __init__(self, model_client):
        super().__init__(
            model_client=model_client,
            name="diagnostician",
            system_prompt="""You are the Diagnostician. Your goal is to find the Root Cause.
            
            Follow the OODA Loop:
            1. OBSERVE: Read the ticket and available context.
            2. ORIENT: 
               - Call `retrieve_docs_tool` to understand expected behavior.
               - Call `analyze_logs_tool` to see system reality.
               - Call `validate_config_tool` to check setup.
            3. DECIDE: Formulate 3 Hypotheses.
            
            Output strictly JSON:
            {
               "hypotheses": [{"name": "...", "confidence": 0.X, "evidence": "..."}],
               "root_cause": "Most likely cause",
               "recommended_action": "..."
            }""",
            tools=TOOLS
        )
