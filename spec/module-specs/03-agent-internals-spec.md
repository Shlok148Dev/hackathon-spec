# ADK Agent Internal Specification

## Orchestrator Agent Config (orchestrator_agent.yaml)
```yaml
name: orchestrator
model: gemini-2.0-flash
description: "Triage and route support tickets"
tools:
  - name: classify_ticket
    description: "Classify ticket into category with confidence"
    parameters:
      ticket_text: string
      merchant_tier: enum
    returns:
      category: enum
      confidence: float
      urgency: int
  
  - name: calculate_priority
    description: "Calculate priority score 1-10"
    # ... full tool spec
  
instruction: |
  You are the Orchestrator. Your job is to:
  1. Ingest incoming tickets
  2. Call classify_ticket to understand the issue
  3. Calculate priority based on merchant tier and issue severity
  4. Route to appropriate downstream agent
  
  RULES:
  - Always check confidence score. If <0.6, escalate to human.
  - Never try to solve the issue yourself (that's Diagnostician's job)
  - Log all decisions to agent_decisions table
```
Tool Implementation Pattern
All tools must follow this interface:
```python
from google.adk.tools import tool

@tool
async def classify_ticket(ticket_text: str, merchant_tier: str) -> dict:
    """
    Classify support ticket using Gemini 1.5 Pro few-shot.
    """
    prompt = f"""
    Classify this ticket into one of: API_ERROR, CONFIG_ERROR, WEBHOOK_FAIL, CHECKOUT_BREAK, DOCS_CONFUSION
    
    Examples:
    Ticket: "My checkout button disappeared" → CHECKOUT_BREAK
    Ticket: "Getting 401 when trying to fetch products" → API_ERROR
    
    Ticket: {ticket_text}
    Category:
    """
    
    response = await gemini.generate(prompt)
    category = parse_category(response.text)
    confidence = calculate_confidence(response.logprobs)
    
    return {
        "category": category,
        "confidence": confidence,
        "urgency": map_to_urgency(category, merchant_tier)
    }
```
