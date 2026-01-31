import json
import logging
from typing import Dict, Any, Optional
from app.core.llm import get_model
from app.core.models import Ticket

logger = logging.getLogger(__name__)

# Categories defined in spec
CATEGORIES = [
    "API_ERROR", "CONFIG_ERROR", "WEBHOOK_FAIL", "CHECKOUT_BREAK", "DOCS_CONFUSION"
]

SYSTEM_PROMPT = """You are a Tier 3 Support AI for a Headless Commerce platform.
Your task is to classify incoming support tickets into specific technical categories.

Output must be valid JSON with the following schema:
{
    "category": "One of [API_ERROR, CONFIG_ERROR, WEBHOOK_FAIL, CHECKOUT_BREAK, DOCS_CONFUSION]",
    "confidence": float (0.0 to 1.0),
    "urgency": int (1 to 10),
    "reasoning": "Brief explanation of why"
}

Few-shot Examples:

Ticket: "POST /v1/cart returns 500 error when sending skus array."
Response: {"category": "API_ERROR", "confidence": 0.98, "urgency": 8, "reasoning": "Explicit 500 error on API endpoint."}

Ticket: "I can't find where to reset my secret key in the dashboard."
Response: {"category": "DOCS_CONFUSION", "confidence": 0.95, "urgency": 3, "reasoning": "User needs navigational help, not a bug."}

Ticket: "Orders are not syncing to our ERP. The webhook logs show timeout."
Response: {"category": "WEBHOOK_FAIL", "confidence": 0.90, "urgency": 7, "reasoning": "Webhook specific failure mentioned."}

Ticket: "The checkout page is blank after the latest migration!"
Response: {"category": "CHECKOUT_BREAK", "confidence": 0.99, "urgency": 10, "reasoning": "Critical blocker affecting revenue."}

Ticket: "Rate limit headers are missing from response."
Response: {"category": "CONFIG_ERROR", "confidence": 0.85, "urgency": 4, "reasoning": "Likely a gateway configuration issue."}

Now classify the following ticket:
"""

class TicketClassifier:
    def __init__(self):
        self.model = get_model()

    async def classify(self, text: str) -> Dict[str, Any]:
        """Classifies a ticket using Gemini 1.5 Pro."""
        try:
            prompt = f"{SYSTEM_PROMPT}\nTicket: \"{text}\"\nResponse:"
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Parse JSON
            result = json.loads(response.text)
            
            # Validate category
            if result.get("category") not in CATEGORIES:
                logger.warning(f"Invalid category {result.get('category')} returned. Defaulting to API_ERROR.")
                result["category"] = "API_ERROR"
                
            return result
            
        except Exception as e:
            logger.error(f"Classification failed: {e}")
            # Fallback for reliability
            return {
                "category": "API_ERROR", 
                "confidence": 0.0, 
                "urgency": 5, 
                "reasoning": f"Classifier failed: {str(e)}"
            }
