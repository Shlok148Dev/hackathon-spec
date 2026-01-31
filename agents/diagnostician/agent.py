import json
from typing import Dict, List, Any
import google.generativeai as genai
import sys
import os
import re

# Use existing project infrastructure
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from app.services.rag_engine import retrieve_context

async def analyze_logs(ticket_id: str, error_keywords: List[str]) -> Dict:
    """Search logs for error patterns"""
    # Mock log analysis - in production query logging service
    logs = [
        f"2026-01-31 Error: SSLHandshakeError for ticket {ticket_id}",
        f"2026-01-31 Warning: Rate limit approaching for merchant",
        f"2026-01-31 Info: Migration stage 2 initiated"
    ]
    # Simple keyword match
    relevant = [log for log in logs if any(kw in log for kw in error_keywords)]
    return {"logs_found": len(relevant), "relevant_logs": relevant[:3]}

async def check_patterns(error_signature: str) -> Dict:
    """Check pattern library for similar issues"""
    # Inline import
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    from app.core.database import SessionLocal
    
    db = SessionLocal()
    try:
        # Simple regex matching for hackathon
        patterns = [
            {
                "id": "pat_001",
                "signature": "SSL.*webhook",
                "solution": "Renew SSL certificate for webhook endpoint",
                "success_rate": 0.94
            },
            {
                "id": "pat_002", 
                "signature": "checkout.*500",
                "solution": "Check payment processor configuration",
                "success_rate": 0.89
            },
            {
                "id": "pat_003",
                "signature": "api.*401",
                "solution": "Rotate API keys",
                "success_rate": 0.92
            }
        ]
        
        matches = []
        for p in patterns:
            if re.search(p["signature"], error_signature, re.IGNORECASE):
                matches.append(p)
        
        return {
            "matches_found": len(matches),
            "top_match": matches[0] if matches else None,
            "all_matches": matches
        }
    finally:
        db.close()

class DiagnosticianAgent:
    def __init__(self, **kwargs):
        # Compatibility shim for agent_runner.py
        self.system_prompt = "Emergency Diagnostics" 
        
        # Use existing project infrastructure
        sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        from app.core.llm import get_model
        
        try:
            self.model = get_model("gemini-2.0-flash-001")
        except:
            self.model = get_model("gemini-1.5-flash") # Fallback
        
    async def diagnose(self, ticket_text: str, classification: str, merchant_context: Dict) -> Dict:
        """
        Generate 3 hypotheses with evidence
        Returns structured reasoning chain
        """
        try:
            # Inline import removed, assuming top-level works now
            
            # 1. Gather Evidence
            try:
                rag_results = await retrieve_context(ticket_text, top_k=3)
            except Exception as e:
                # Log usage but continue
                rag_results = []

            log_results = await analyze_logs(ticket_id="temp", error_keywords=[classification, "error", "fail"])
            pattern_results = await check_patterns(ticket_text)
            
            # 2. Construct Few-Shot Prompt for Gemini
            prompt = f"""
    You are a senior Site Reliability Engineer diagnosing an e-commerce platform issue.
            
    TICKET: {ticket_text}
    CLASSIFICATION: {classification}
    MERCHANT CONTEXT: {json.dumps(merchant_context)}
            
    EVIDENCE FROM SYSTEM:
    - Documentation Retrieved: {json.dumps([r['content'][:200] for r in rag_results]) if rag_results else "None"}
    - Recent Logs: {json.dumps(log_results['relevant_logs'])}
    - Historical Patterns: {json.dumps(pattern_results['top_match'] if pattern_results['top_match'] else 'None')}
            
    Generate exactly 3 hypotheses for the root cause. Be specific and technical.
            
    HYOTHESIS 1 (Most Likely): Platform or configuration issue with specific technical detail
    HYOTHESIS 2 (Alternative): Different technical root cause  
    HYOTHESIS 3 (Edge Case): User error, documentation gap, or rare edge case
            
    FORMAT AS VALID JSON:
    {{
      "hypotheses": [
        {{
          "id": 1,
          "description": "Specific technical explanation with error codes if applicable",
          "confidence": 0.75,
          "category": "CONFIG_ERROR",
          "evidence": ["Reference to log line or doc section"]
        }},
        {{
          "id": 2,
          "description": "Alternative explanation",
          "confidence": 0.15,
          "category": "PLATFORM_BUG", 
          "evidence": ["Pattern match from historical data"]
        }},
        {{
          "id": 3,
          "description": "Edge case explanation",
          "confidence": 0.10,
          "category": "DOCS_GAP",
          "evidence": ["Documentation gap reference"]
        }}
      ],
      "recommended_action": "Specific fix recommendation",
      "uncertainty_note": "What we're unsure about"
    }}
            
    Requirements:
    - Confidence scores must sum to 1.0 (100%)
    - Each hypothesis must cite specific evidence from the provided logs/docs
    - Categories must be one of: PLATFORM_BUG, MIGRATION_ERROR, CONFIG_ERROR, DOCS_GAP
    - Be specific, not generic. "SSL certificate expired" not "Something is wrong"
    """
            
            # 3. Call Gemini
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        temperature=0.2,
                        response_mime_type="application/json"
                    )
                )
                
                result = json.loads(response.text)
                
                # Validate structure
                if "hypotheses" not in result or len(result["hypotheses"]) != 3:
                    # raise ValueError("Invalid hypothesis structure")
                    pass
                else:
                    # Ensure confidence sums to ~1.0
                    total_conf = sum(h["confidence"] for h in result["hypotheses"])
                    if abs(total_conf - 1.0) > 0.1:
                        # Normalize
                        for h in result["hypotheses"]:
                            h["confidence"] = round(h["confidence"] / total_conf, 2)
                    return result
                
            except Exception as e:
                raise e # Fallback below
                
        except Exception as outer_e:
            # Fallback if anything fails
            return {
                "hypotheses": [
                    {
                        "id": 1,
                        "description": f"Configuration error related to {classification} [FALLBACK]",
                        "confidence": 0.85,
                        "category": "CONFIG_ERROR",
                        "evidence": [f"Ticket classification indicates config issue. Error: {str(outer_e)}"]
                    },
                    {
                        "id": 2,
                        "description": "Platform regression in recent deployment [FALLBACK]",
                        "confidence": 0.10,
                        "category": "PLATFORM_BUG",
                        "evidence": ["No evidence in logs, speculative"]
                    },
                    {
                        "id": 3,
                        "description": "Documentation misunderstanding by merchant [FALLBACK]",
                        "confidence": 0.05,
                        "category": "DOCS_GAP",
                        "evidence": ["Migration stage indicates learning curve"]
                    }
                ],
                "recommended_action": "Check configuration settings",
                "error": str(outer_e)
            }
