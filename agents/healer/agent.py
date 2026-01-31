from google.adk.core import Agent
from .tools import TOOLS

class HealerAgent(Agent):
    def __init__(self, model_client):
        super().__init__(
            model_client=model_client,
            name="healer",
            system_prompt="You are the Healer. Propose and execute fixes safely.",
            tools=TOOLS
        )
