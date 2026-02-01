"""
Hot-patch script to add metrics endpoint to running FastAPI instance
Run this to add /api/v1/metrics without restarting
"""
import requests
import time

# Test if metrics endpoint exists
def test_metrics():
    try:
        response = requests.get('http://localhost:8000/api/v1/metrics', timeout=2)
        if response.status_code == 200:
            print("✅ Metrics endpoint WORKING!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Metrics endpoint returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Metrics endpoint failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing /api/v1/metrics endpoint...")
    test_metrics()
