import requests
import time
import json
import sys
import asyncio
from sqlalchemy import select

# Add project root to sys.path
import os
sys.path.append(os.getcwd())

from app.core.database import AsyncSessionLocal
from app.core.models import Merchant

BASE_URL = "http://localhost:8002"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

async def get_valid_merchant_id():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Merchant))
        merchant = result.scalars().first()
        if merchant:
            return str(merchant.id)
    return None

def check_health():
    try:
        r = requests.get(f"{BASE_URL}/health/ready")
        if r.status_code == 200:
            log("Health check passed", "PASS")
            return True
        else:
            log(f"Health check failed: {r.status_code}", "FAIL")
            return False
    except Exception as e:
        log(f"Health check error: {e}", "FAIL")
        return False

def create_ticket(merchant_id):
    ticket_payload = {
        "raw_text": "SSL Handshake Failing: Our legacy system is getting SSL handshake failures when trying to hit the new webhook endpoint. It started happening at 2 PM.",
        "merchant_id": merchant_id,
        "severity": 8,
        "channel": "api"
    }
    
    try:
        log(f"Sending Ticket Payload with Merchant {merchant_id}", "INFO")
        r = requests.post(f"{BASE_URL}/api/v1/tickets/", json=ticket_payload)
        if r.status_code in [200, 201]:
            data = r.json()
            ticket_id = data.get("id")
            log(f"Ticket created: {ticket_id}", "PASS")
            return ticket_id
        else:
            log(f"Ticket creation failed: {r.text}", "FAIL")
            return None
    except Exception as e:
        log(f"Ticket creation error: {e}", "FAIL")
        return None

def verify_diagnosis(ticket_id):
    max_retries = 30
    for i in range(max_retries):
        log(f"Polling diagnosis for ticket {ticket_id} (Attempt {i+1}/{max_retries})...", "WAIT")
        try:
            r = requests.get(f"{BASE_URL}/api/v1/tickets/{ticket_id}/diagnosis")
            if r.status_code == 200:
                data = r.json()
                if "hypotheses" in data and isinstance(data["hypotheses"], list) and len(data["hypotheses"]) > 0:
                    log("Diagnosis retrieved successfully", "PASS")
                    
                    hypotheses = data["hypotheses"]
                    confidence_sum = sum(h.get("confidence", 0) for h in hypotheses)
                    
                    log(f"Hypotheses count: {len(hypotheses)}", "CHECK")
                    log(f"Total Confidence: {confidence_sum}", "CHECK")
                    
                    return True
                else:
                    status_msg = data.get("message", "Processing...")
                    log(f"Diagnosis pending: {status_msg}", "WAIT")
            elif r.status_code == 404:
                log("Diagnosis not ready yet (404)", "WAIT")
            else:
                 log(f"Diagnosis fetch error: {r.status_code}", "FAIL")
        except Exception as e:
            log(f"Polling error: {e}", "FAIL")
        
        time.sleep(2)
        
    log("Diagnosis verification timed out", "FAIL")
    return False

def run_suite():
    print("=== STARTING FULL SYSTEM VERIFICATION ===")
    
    # 0. Get Merchant ID
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    merchant_id = loop.run_until_complete(get_valid_merchant_id())
    if not merchant_id:
        log("No merchant found in DB. Run init_db.py first.", "FAIL")
        sys.exit(1)
        
    # 1. Health
    if not check_health():
        sys.exit(1)
        
    # 2. Create Ticket
    ticket_id = create_ticket(merchant_id)
    if not ticket_id:
        sys.exit(1)
        
    # 3. Verify Diagnosis
    success = verify_diagnosis(ticket_id)
    
    if success:
        print("\n=== VERIFICATION SUCCESSFUL ===")
        print("Phase 1 (API/DB): OK")
        print("Phase 2 (Agents/Reasoning): OK")
        print("Phase 3 (Data Flow): OK")
        print("System is ready for Phase 4 (Resilience)")
    else:
        print("\n=== VERIFICATION FAILED ===")
        sys.exit(1)

if __name__ == "__main__":
    run_suite()
