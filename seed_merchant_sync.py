import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def seed_sync():
    print("Connecting to DB...")
    # Get URL and fix for sync
    url = os.getenv("DATABASE_URL")
    if "+asyncpg" in url:
        url = url.replace("+asyncpg", "")
    
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        
        # Check if merchant exists
        cur.execute("SELECT id FROM merchants LIMIT 1")
        row = cur.fetchone()
        
        if row:
            mid = row[0]
            print(f"EXISTING_MERCHANT_ID={mid}")
        else:
            print("Inserting New Merchant...")
            cur.execute("""
                INSERT INTO merchants (external_id, tier, migration_stage)
                VALUES ('test_merchant_sync', 'growth', 'in_progress')
                RETURNING id
            """)
            mid = cur.fetchone()[0]
            conn.commit()
            print(f"NEW_MERCHANT_ID={mid}")
            
        with open("merchant_id.txt", "w") as f:
            f.write(str(mid))
            
        cur.close()
        conn.close()
        print("Done.")
        
    except Exception as e:
        print(f"Sync Seed Failed: {e}")

if __name__ == "__main__":
    seed_sync()
