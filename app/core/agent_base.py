class Agent:
    def __init__(self, model_client, name, system_prompt, tools=None):
        self.model_client = model_client
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []
