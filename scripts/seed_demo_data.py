import requests
import asyncio
import sys
import os
import random

# Add project root to sys.path for DB access
sys.path.append(os.getcwd())
from app.core.database import AsyncSessionLocal
from app.core.models import Merchant
from sqlalchemy import select

BASE_URL = "http://localhost:8002"

async def get_valid_merchant_id():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Merchant))
        merchant = result.scalars().first()
        if merchant:
            return str(merchant.id)
    return None

def create_ticket(merchant_id, text, severity=5, channel="api"):
    payload = {
        "merchant_id": merchant_id,
        "raw_text": text,
        "severity": severity,
        "channel": channel
    }
    try:
        r = requests.post(f"{BASE_URL}/api/v1/tickets/", json=payload)
        if r.status_code in [200, 201]:
            print(f"✅ Created: {text[:40]}...")
            return True
        else:
            print(f"❌ Failed ({r.status_code}): {text[:40]}... - {r.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

async def seed():
    print("=== SEEDING DEMO DATA ===")
    
    # 1. Get Merchant
    merchant_id = await get_valid_merchant_id()
    if not merchant_id:
        print("❌ No merchant found (run init_db.py first)")
        return

    print(f"Using Merchant: {merchant_id}")

    # 2. Define Tickets
    tickets = [
        # CHECKOUT_BREAK (Critical)
        {"text": "URGENT: Checkout button disappeared after migration!", "severity": 10},
        {"text": "Payment failing with Error 500, customers can't buy", "severity": 10},
        {"text": "Cart shows $0 total after headless switch", "severity": 9},
        {"text": "Stripe integration broken, getting 'No such payment intent'", "severity": 10},

        # API_ERROR (High)
        {"text": "GraphQL endpoint returning 401 Unauthorized", "severity": 8},
        {"text": "Product API rate limited, storefront not loading", "severity": 7},
        {"text": "REST API CORS errors in browser console", "severity": 6},
        {"text": "Admin API returning null for inventory counts", "severity": 7},

        # WEBHOOK_FAIL (High)
        {"text": "Webhook endpoint SSL certificate expired", "severity": 8},
        {"text": "Not receiving order notifications to Zapier", "severity": 6},
        {"text": "Webhook signature verification failing", "severity": 7},
        {"text": "Timeout errors on webhook callback URL", "severity": 8},

        # CONFIG_ERROR (Medium)
        {"text": "Environment variables not loading in production", "severity": 5},
        {"text": "Missing API key for shipping calculator", "severity": 5},
        {"text": "Storefront URL misconfigured in admin", "severity": 4},
        {"text": "Database connection pooling misconfigured", "severity": 6},

        # DOCS_CONFUSION (Low)
        {"text": "Documentation unclear how to setup headless auth", "severity": 3},
        {"text": "Can't find migration guide for product variants", "severity": 3},
        {"text": "Webhook setup instructions outdated", "severity": 2},
        {"text": "GraphQL query examples don't work with new schema", "severity": 2},
        
        # GOLDEN PATH
        {"text": "Checkout failing with SSL handshake error after migration to headless", "severity": 9},
        
        # EDGE CASE
        {"text": "Sometimes inventory updates but sometimes they don't, only on Tuesdays", "severity": 4},
    ]

    # 3. Create
    count = 0
    for t in tickets:
        if create_ticket(merchant_id, t["text"], t["severity"]):
            count += 1
            # Rate limit simulation
            await asyncio.sleep(0.5) 

    print(f"=== SEEDING COMPLETE: {count}/{len(tickets)} tickets created ===")

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed())
