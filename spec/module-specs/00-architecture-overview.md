# System Architecture Diagram

## Data Flow
Merchant Issue
↓
Webhook/API Endpoint
↓
Signal Ingestion (FastAPI)
↓
Redis Stream (Queue)
↓
Orchestrator Agent (ADK Sequential)
├─ Classification (Gemini 1.5)
└─ Routing
↓
Diagnostician Agent (ADK Parallel)
├─ Log Analysis
├─ RAG Retrieval (pgvector)
└─ Pattern Matching
↓
Healer Agent (ADK Loop)
├─ Action Proposal
├─ Human Approval (if high risk)
└─ Execution + Verification
↓
Feedback Loop (Learner Agent)
↓
Database (Supabase)
↓
SSE Stream (Real-time UI)
↓
React Mission Control

## Service Boundaries
- **Stateless**: FastAPI (can scale horizontally)
- **Stateful**: ADK Agents (session memory), Redis (queue)
- **Persistent**: PostgreSQL (source of truth)
