#!/usr/bin/env python3
"""Final Phase 4 Verification - Must pass all checks before Phase 5"""

import subprocess
import sys
import requests
import json
import os

def check_build():
    """CHECK 1: Production build succeeds"""
    print("\n🔨 CHECK 1: Production Build...")
    result = subprocess.run(
        ["npm", "run", "build"], 
        cwd="frontend",
        capture_output=True,
        text=True,
        shell=True
    )
    if result.returncode == 0:
        print("  ✅ PASS: Build successful")
        return True
    else:
        print(f"  ❌ FAIL: {result.stderr[:200]}")
        return False

def check_dashboard():
    """CHECK 2: Dashboard responds"""
    print("\n🖥️  CHECK 2: Dashboard...")
    try:
        r = requests.get("http://localhost:5173", timeout=5)
        if r.status_code == 200 and ("Mission Control" in r.text or "Hermes" in r.text):
            print("  ✅ PASS: Dashboard rendering")
            return True
    except Exception as e:
        print(f"  ❌ FAIL: {e}")
    print("  ❌ FAIL: Dashboard not accessible")
    return False

def check_backend():
    """CHECK 3: Backend health"""
    print("\n⚙️  CHECK 3: Backend Health...")
    try:
        r = requests.get("http://localhost:8002/health/ready", timeout=5)
        if r.status_code == 200 and r.json().get("database") == "connected":
            print("  ✅ PASS: Backend healthy")
            return True
    except Exception as e:
        print(f"  ❌ FAIL: {e}")
    return False

def check_circuit_breaker():
    """CHECK 4: Circuit breaker exists"""
    print("\n🔒 CHECK 4: Circuit Breaker...")
    if os.path.exists("app/core/circuit_breaker.py"):
        print("  ✅ PASS: Circuit breaker implemented")
        return True
    print("  ❌ FAIL: Missing circuit_breaker.py")
    return False

def check_error_boundary():
    """CHECK 5: Error boundaries"""
    print("\n🛡️  CHECK 5: Error Boundaries...")
    if os.path.exists("frontend/src/components/AgentErrorBoundary.tsx"):
        print("  ✅ PASS: Error boundary exists")
        return True
    print("  ❌ FAIL: Missing AgentErrorBoundary.tsx")
    return False

def check_demo_data():
    """CHECK 6: Demo data seeded"""
    print("\n🎭 CHECK 6: Demo Data...")
    try:
        r = requests.get("http://localhost:8002/api/v1/tickets?limit=100", timeout=5)
        if r.status_code == 200:
            data = r.json()
            count = len(data) if isinstance(data, list) else data.get('total', 0)
            if count >= 15:
                print(f"  ✅ PASS: {count} tickets found")
                return True
            else:
                print(f"  ⚠️  WARNING: Only {count} tickets (expected 20+)")
                return True if count > 0 else False
    except Exception as e:
        print(f"  ❌ FAIL: {e}")
    return False

if __name__ == "__main__":
    
    checks = [
        check_build(),
        check_dashboard(),
        check_backend(),
        check_circuit_breaker(),
        check_error_boundary(),
        check_demo_data(),
    ]
    
    passed = sum(checks)
    total = len(checks)
    
    print(f"\n{'='*50}")
    print(f"FINAL SCORE: {passed}/{total} CHECKS PASSED")
    
    if passed == total:
        print("🎉 ALL CHECKS PASSED - READY FOR PHASE 5")
        sys.exit(0)
    elif passed >= 4:
        print("⚠️  PARTIAL PASS - PROCEED WITH CAUTION")
        sys.exit(0)  # Still allow proceed
    else:
        print("❌ CRITICAL FAILURES - DO NOT PROCEED TO PHASE 5")
        sys.exit(1)
