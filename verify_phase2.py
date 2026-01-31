import requests
import time
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8009/v1"

def verify_phase2():
    try:
        # 1. Create Ticket
        logger.info("Creating Ticket...")
        payload = {
            "merchant_id": "e0f3e602-0069-4076-97bb-c334b6bcaaf9",
            "raw_text": "The checkout page is throwing a 500 error for all customers since the migration started.",
            "channel": "api"
        }
        resp = requests.post(f"{BASE_URL}/tickets/", json=payload)
        resp.raise_for_status()
        data = resp.json()
        ticket_id = data["id"]
        logger.info(f"Ticket Created: {ticket_id}")
        logger.info(f"Initial Classification: {data['classification']}")
        
        if data['classification'] != "CHECKOUT_BREAK":
            logger.warning(f"Classification Mismatch! Expected CHECKOUT_BREAK, got {data['classification']}")

        # 2. Wait for Diagnosis
        logger.info("Waiting for Diagnostician (5s)...")
        time.sleep(8) # Generous wait for API + Gemini
        
        # 3. Get Diagnosis
        logger.info("Fetching Diagnosis...")
        resp = requests.get(f"{BASE_URL}/tickets/{ticket_id}/diagnosis")
        resp.raise_for_status()
        diag = resp.json()
        
        logger.info("Diagnosis Result:")
        logger.info(json.dumps(diag, indent=2))
        
        if diag.get("status") == "processing":
             logger.error("Diagnosis still processing!")
             return False
             
        return True
        
    except Exception as e:
        logger.error(f"Verification Failed: {e}")
        return False

if __name__ == "__main__":
    if verify_phase2():
        print("PHASE 2 SUCCESS")
    else:
        print("PHASE 2 FAILED")
