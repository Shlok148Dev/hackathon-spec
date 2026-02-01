# Hermes: Self-Healing Support System - Judge Guide

## Quick Start (Local Demo)
```bash
# Terminal 1: Backend
cd hackathon-spec
uvicorn app.main:app --reload --port 8002

# Terminal 2: Frontend  
cd frontend
npm run dev  # Dev server for demo

# Access: http://localhost:5173
```

## The Golden Path Demo (3 Minutes)

### 0:00-0:30 - The Crisis
- Show **Signal Stream** with 20+ tickets flooding in
- Point to **"Neural Brain Activity"** at 88% load
- *"This is Naitik's nightmare - 1000 tickets/hour during Stripe migration"*

### 0:30-1:30 - The Magic (Click "golden-001" ticket)
- Watch **Orchestrator** classify: `"CHECKOUT_BREAK, 94% confidence"`
- See **Diagnostician** generate 3 hypotheses in real-time
- Evidence citations appear (log snippets, doc references)
- **Healer** proposes: *"Auto-renew SSL certificate"*
- Show confidence bars animating (85%, 10%, 5%)

### 1:30-2:30 - The Resolution
- Click **"Approve"** (with 94% confidence)
- See status change: `analyzing → resolved`
- Check **"Economic Impact"** counter: *"$47,230 saved today"*
- Show Pattern Library learned this fix

### 2:30-3:00 - The Architecture
- Briefly show: **3-agent swarm** (Orchestrator/Diagnostician/Healer)
- **ML components**: Classification + Anomaly Detection + RAG
- **Safety**: Human-in-the-loop for financial actions

## Resilience Features (If Asked)

**"What if LLM fails?"**
- Show: Invalid `GEMINI_API_KEY` → Falls back to **Pattern Library** (regex matching)
- 3 consecutive failures triggers **circuit breaker**

**"What if database dies?"**
- Show: `/health/ready` returns 503, but `/health/live` returns 200
- System operates in **degraded mode**

**"What if frontend crashes?"**
- **Error boundaries** isolate failures per column
- **Terminal demo mode** available as backup

## Known Limitations (Transparency)

- ⚠️ 18-hour constraint: **Single-tenant only** (no row-level security)
- Dev server used for demo (production build tested but vite dev preferred)
- RAG uses hybrid retrieval (keyword + semantic) due to embedding rate limits

## Code Structure
```
/hermes
├── agents/           # Google ADK agents (Orchestrator, Diagnostician, Healer)
├── app/             # FastAPI backend
├── frontend/        # React Mission Control
└── spec/            # Full technical specification
```

## ML Components (Bonus Points)

1. **Ticket Classifier**: Gemini 1.5 Pro few-shot classification
2. **Anomaly Detector**: IsolationForest on error rates
3. **Documentation RAG**: text-embedding-004 + pgvector

## Technical Highlights

- **Agentic Workflows**: Google ADK multi-agent orchestration
- **Real-time UI**: React + Zustand + TanStack Query
- **Semantic Search**: Supabase pgvectorfor doc retrieval
- **Production-Grade**: Circuit breakers, error boundaries, health checks
- **Deployed**: Railway (backend) + Vercel (frontend) [if Phase 5 completed]
