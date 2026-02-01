
import asyncio
import httpx
import sys
import json
import uuid
from typing import Dict, Any

# Configurations
BASE_URL = "http://localhost:8000/api/v1"
TEST_TICKET_ID = None

async def run_test():
    global TEST_TICKET_ID
    print("🚀 STARTING FULLSCALE SYSTEM VERIFICATION")
    print("========================================")

    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        # 1. VERIFY SYSTEM METRICS (Confirm dynamic values)
        print("\n[1] Checking System Telemetry...")
        try:
            resp = await client.get(f"{BASE_URL}/metrics")
            if resp.status_code != 200:
                print(f"   ❌ Metrics Failed: {resp.status_code} - {resp.text}")
                return
            metrics = resp.json()
        except Exception as e:
            print(f"   ❌ Metrics Error: {e}")
            return
            
        print(f"   ✅ Metrics Active: Agents={metrics['agents_active']}, Queue={metrics['queue_depth']}")
        # 1.5 CREATE MERCHANT (Foreign Key Dependency) - Done via seed script
        TEST_MERCHANT_ID = "123e4567-e89b-12d3-a456-426614174000"
        
        print("\n[2] Creating Test Ticket (Triggering Orchestrator)...")
        new_ticket = {
            "merchant_id": TEST_MERCHANT_ID,
            "raw_text": "The checkout page is throwing a 500 error when users try to pay with credit card.",
            "channel": "email",
            "severity": 1
        }
        resp = await client.post(f"{BASE_URL}/tickets", json=new_ticket)
        if resp.status_code != 200:
             print(f"   ❌ Create Failed: {resp.status_code} - {resp.text}")
             return
        ticket_data = resp.json()
        TEST_TICKET_ID = ticket_data["id"]
        print(f"   ✅ Ticket Created: {TEST_TICKET_ID}")
        print(f"   ✅ Classification Status: {ticket_data['status']}") 
        # Note: Status might be 'open' initially, Orchestrator runs async or on read

        # 3. VERIFY ORCHESTRATOR & DIAGNOSTICIAN (Wait for Analysis)
        print("\n[3] Waiting for Agent Analysis (Orchestrator -> Diagnostician)...")
        max_retries = 10
        analyzed = False
        for i in range(max_retries):
            resp = await client.get(f"{BASE_URL}/tickets/{TEST_TICKET_ID}")
            t_data = resp.json()
            status = t_data['status']
            print(f"   ... Status: {status} (Attempt {i+1}/{max_retries})")
            
            if status in ['analyzed', 'diagnosed', 'open', 'analyzing']: 
                # check if diagnosis exists
                diag_resp = await client.get(f"{BASE_URL}/tickets/{TEST_TICKET_ID}/diagnosis")
                if diag_resp.status_code == 200:
                    diag = diag_resp.json()
                    if diag.get('hypotheses'):
                        print(f"   ✅ Diagnosis Generated!")
                        print(f"      - Hypotheses: {len(diag['hypotheses'])}")
                        print(f"      - Top Hypothesis: {diag['hypotheses'][0]['description']}")
                        analyzed = True
                        break
            
            await asyncio.sleep(2)
        
        if not analyzed:
            print("   ❌ Analysis timed out or failed to generate hypotheses.")
            return

        # 4. HEALER ACTION (Approve Fix)
        print("\n[4] Testing Healer Agent (Approve Fix)...")
        approve_payload = {
            "approved": True,
            "approver_id": str(uuid.uuid4()), # Valid UUID
            "justification": "Fullscale test verification"
        }
        resp = await client.post(f"{BASE_URL}/decisions/{TEST_TICKET_ID}/approve", json=approve_payload)
        
        if resp.status_code == 422:
             print(f"   ❌ Validation Error: {resp.json()}")
             return
        
        assert resp.status_code == 200, f"Approval failed: {resp.text}"
        res_data = resp.json()
        print(f"   ✅ Approval Accepted: {res_data['message']}")
        print(f"   ✅ New Status: {res_data['status']}")
        
        # 5. FINAL VERIFICATION (Persistence)
        print("\n[5] Verifying DB Persistence...")
        resp = await client.get(f"{BASE_URL}/tickets/{TEST_TICKET_ID}")
        final_ticket = resp.json()
        if final_ticket['status'] == 'resolved':
             print(f"   ✅ SUCCESS: Ticket {TEST_TICKET_ID} is fully RESOLVED in Database.")
        else:
             print(f"   ❌ FAILURE: Ticket status mismatch. Expected 'resolved', got '{final_ticket['status']}'")

if __name__ == "__main__":
    asyncio.run(run_test())
