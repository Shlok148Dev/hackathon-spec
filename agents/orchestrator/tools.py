from app.services.classifier import TicketClassifier

classifier = TicketClassifier()

async def classify_ticket_tool(ticket_text: str):
    """
    Classifies a support ticket into technical categories like API_ERROR, CONFIG_ERROR, etc.
    Returns category, confidence, urgency, and reasoning.
    """
    return await classifier.classify(ticket_text)

TOOLS = [classify_ticket_tool]
