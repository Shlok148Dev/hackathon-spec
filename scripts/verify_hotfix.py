import requests
import json
import time

API_URL = "http://localhost:8020"

def run_test():
    print(f"Checking {API_URL}/health")
    try:
        r = requests.get(f"{API_URL}/api/v1/health") # Note: Router mounted at /api/v1 prefix in main.py, but health is usually at root /health
        # Wait, app.include_router(health.router, prefix="/health", tags=["health"]) on line 18
        # app.include_router(tickets.router, prefix="/v1/tickets", tags=["tickets"]) on line 19
        # app.include_router(diagnosis.router, prefix="/api/v1", tags=["diagnosis"]) on line 22
        
        # So ticket creation is at /v1/tickets
        # And diagnosis is at /api/v1/tickets/{id}/diagnosis
        pass
    except:
        pass

    # 1. Create Ticket
    print("Creating Ticket...")
    payload = {
        "merchant_id": "e0f3e602-0069-4076-97bb-c334b6bcaaf9", # Use existing valid merchant
        "raw_text": "Checkout shows 500 error after migrating to headless",
        "channel": "api"
    }
    
    # Needs to match TicketCreate schema in app/api/v1/tickets.py
    # class TicketCreate(BaseModel): merchant_id: UUID, raw_text: str, channel: str
    
    r = requests.post(f"{API_URL}/v1/tickets/", json=payload)
    if r.status_code not in [200, 201]:
        print(f"Create Failed: {r.text}")
        return False
        
    ticket_id = r.json()["id"]
    print(f"Ticket ID: {ticket_id}")
    
    # 2. Call Diagnosis
    print("Requesting Diagnosis...")
    # Endpoint: /api/v1/tickets/{ticket_id}/diagnosis
    url = f"{API_URL}/api/v1/tickets/{ticket_id}/diagnosis"
    r = requests.get(url)
    
    if r.status_code != 200:
        print(f"Diagnosis Failed: {r.status_code} {r.text}")
        return False
        
    data = r.json()
    print(json.dumps(data, indent=2))
    
    # 3. Verify Criteria
    if "hypotheses" not in data:
        print("FAIL: No hypotheses field")
        return False
        
    hypos = data["hypotheses"]
    if len(hypos) != 3:
        print(f"FAIL: Expected 3 hypotheses, got {len(hypos)}")
        return False
        
    print("SUCCESS: 3 Hypotheses returned!")
    return True

if __name__ == "__main__":
    try:
        if run_test():
            print("PHASE 2 HOTFIX COMPLETE")
        else:
            print("HOTFIX FAILED")
    except Exception as e:
        print(f"Error: {e}")
