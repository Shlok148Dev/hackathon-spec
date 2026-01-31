from app.services.rag_engine import retrieve_context, ingest_docs
import asyncio
from agents.diagnostician.agent import DiagnosticianAgent

async def run_tests():
    print(">>> TESTING RAG ENGINE <<<")
    
    # Test 1: Basic retrieval
    print("\nTest 1: Direct Retrieval")
    try:
        results = await retrieve_context("webhook ssl error", top_k=3)
        print(f"Found {len(results)} chunks")
        for r in results:
            print(f"- {r['id']}: {r['content'][:100]}... (score: {r['score']:.2f})")
    except Exception as e:
        print(f"FAIL Direct Retrieval: {e}")

    # Test 2: Verify hypothesis generation uses RAG
    print("\nTest 2: Diagnostician Integration")
    try:
        agent = DiagnosticianAgent()
        result = await agent.diagnose(
            ticket_text="Checkout webhook failing with SSL error",
            classification="WEBHOOK_FAIL",
            merchant_context={"tier": "growth"}
        )

        print(f"Hypotheses generated: {len(result.get('hypotheses', []))}")
        for h in result['hypotheses'][:2]:
            print(f"  - {h['description'][:80]}...")
            print(f"    Evidence: {h.get('evidence', [])}")
            
    except Exception as e:
        print(f"FAIL Agent Integration: {e}")

if __name__ == "__main__":
    asyncio.run(run_tests())
