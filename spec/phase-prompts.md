# THE PHASE PROMPTS: AUTONOMOUS EXECUTION PROTOCOL
## Warning: These prompts unleash Antigravity. Use with caution.

---

## 🔥 PHASE 1: FOUNDATION (Hour 0-3)
**Objective**: Genesis of the system - database, API skeleton, agent stubs

```text
ROLE: You are ANTIGRAVITY-PRIME, Principal Architect.
PHASE: 1 (Foundation)
AUTHORITY: You may create infrastructure only. NO business logic.

CONSTITUTIONAL BOUNDS:
- Allowed: Database schemas, FastAPI routes, ADK agent configs, environment setup
- Forbidden: Agent reasoning, classification logic, UI components, ML models
- Deadline: 3 hours from now. Speed > perfection.

TECHNICAL MANDATE:
1. DATABASE GENESIS:
   - Connect to Supabase using DATABASE_URL from env
   - Execute SQL from spec/tech-spec.md Section 3 (Database Schema)
   - Verify: Run SELECT count(*) FROM merchants → should work
   - Insert 5 mock merchants with realistic data (use Faker if available)

2. API SCAFFOLDING:
   - FastAPI app with structure:
     /app
       /api
         /v1
           /tickets.py (POST, GET endpoints)
           /decisions.py (approval endpoints)
           /health.py (liveness/readiness)
       /core
         /database.py (SQLAlchemy models from spec)
         /config.py (Pydantic settings)
       /agents (empty __init__.py files for now)
   - All endpoints return 200 OK with mock data initially

3. ADK INITIALIZATION:
   - Create agents/ directory with:
     - orchestrator/
       - __init__.py
       - agent.py (class definition, empty run method)
       - tools.py (stubs that return "not implemented")
     - diagnostician/ (same structure)
     - healer/ (same structure)
   - Create tool definitions in ADK format (YAML or Python decorators)

4. HEALTH CHECKS:
   - /health/live → returns 200 if server up
   - /health/ready → returns 200 if DB connected

VERIFICATION GATE:
Before claiming complete, run these commands and verify output:
$ python -c "import requests; print(requests.get('http://localhost:8000/health/ready').json())"
Expected: {"status": "ok", "database": "connected"}

$ adk dev --agent orchestrator
Expected: Agent initializes without ImportError

DELIVERABLE:
- Git commit with message: "PHASE 1: Infrastructure locked"
- Database has tables and mock data
- API responds on localhost:8000
- ADK agents exist as skeletons

DO NOT PROCEED TO PHASE 2 UNTIL I SAY "PHASE 2 GO".
```
🧠 PHASE 2: INTELLIGENCE (Hour 3-9)
Objective: ML components, agent reasoning, diagnosis engine
```text
ROLE: You are the ML Engineer + Agent Logic Specialist.
PHASE: 2 (Intelligence)
DEPENDENCIES: Phase 1 must be complete (DB and API running).

MISSION CRITICAL:
Implement the Brain of Hermes. This is where the money is.

1. TICKET CLASSIFIER (ML Component 1):
   - Use Gemini 1.5 Pro (NOT Flash) for this - needs reasoning
   - Prompt engineering:
     * Create 10-shot examples (2 per category)
     * Include few-shot examples in system prompt
   - Function classify_ticket(ticket_text: str) → dict:
     * category: enum (API_ERROR, CONFIG_ERROR, etc.)
     * confidence: float (0-1)
     * urgency: int (1-10)
   - Store results in tickets.classification column
   - Test on 20 synthetic tickets, target >80% accuracy

2. DOCUMENTATION RAG (ML Component 2):
   - Chunking: Split /data/docs/*.md by H2 headers
   - Embeddings: text-embedding-004 (768 dimensions)
   - Vector store: pgvector (already set up in Phase 1)
   - Retrieval function: get_relevant_docs(query: str, top_k=3) → list
   - Test: "webhook ssl error" should return webhook troubleshooting doc

3. DIAGNOSTICIAN AGENT LOGIC:
   - Implement the OODA loop:
     * Observe: Read ticket + merchant context
     * Orient: Call classifier + RAG + pattern matcher
     * Decide: Generate 3 hypotheses with confidence scores
     * Evidence: Cite specific log lines and doc sections
   - Tools to implement:
     * log_analyzer(query_params) → relevant_logs
     * config_validator(merchant_id) → config_errors
     * pattern_matcher(error_signature) → similar_cases
   - Output format: Structured JSON matching spec/module-specs/03-diagnostician-agent.md

4. ORCHESTRATOR LOGIC:
   - Route tickets based on classification:
     * API_ERROR → Diagnostician
     * DOCS_CONFUSION → Healer (skip diagnosis, direct doc suggestion)
     * CHECKOUT_BREAK → High priority queue
   - Priority calculation algorithm from spec
   - Escalation: If confidence < 0.6, mark for human

5. ANOMALY DETECTION (ML Component 3 - Bonus):
   - IsolationForest from sklearn
   - Features: error_rate_1h, ticket_velocity, merchant_health_avg
   - Trigger: If anomaly_score < -0.35, create synthetic ticket "System Anomaly Detected"

6. PATTERN LIBRARY:
   - Seed with 5 hardcoded patterns from spec
   - Update function: Increment success_rate when pattern leads to resolution
   - Query: Diagnostician checks this before LLM call (faster + cheaper)

INTEGRATION TEST:
Run this flow end-to-end:
1. POST /v1/tickets with test data
2. Orchestrator classifies
3. Diagnostician analyzes
4. Result stored in DB with reasoning chain
5. GET /v1/tickets/{id}/diagnosis returns full JSON

METRICS TO HIT:
- Classification latency < 1s
- Diagnosis latency < 5s
- Accuracy > 80% on test suite

DELIVERABLE:
- Git commit: "PHASE 2: Intelligence online"
- Demo: Show me one ticket being classified and diagnosed automatically

WAIT FOR HUMAN VERIFICATION BEFORE PHASE 3.
```
🎨 PHASE 3: INTERFACE (Hour 9-13)
Objective: React UI, Stitch integration, real-time connection
```text
ROLE: You are the Frontend Architect and UI Engineer.
PHASE: 3 (Interface)
DEPENDENCIES: Phase 2 API endpoints working (/v1/tickets, /v1/decisions)

VISUAL MANDATE:
Create the Mission Control Dashboard from spec/design.md.
This sells the idea to judges.

1. STITCH INTEGRATION:
   - Go to labs.google.com/stitch
   - Use prompts from spec/stitch-prompts.md
   - Generate components:
     * WarRoomShell (dashboard layout)
     * TicketCard (signal stream items)
     * ReasoningTree (agent thought visualization)
     * RiskAssessmentCard (approval UI)
   - Export as React components
   - Place in /frontend/src/components/stitch/

2. REACT APP SETUP:
   - Vite + React + TypeScript
   - TanStack Query (React Query) for data fetching
   - Tailwind configured with design tokens from spec/design.md
   - React Router for navigation (3 routes: /dashboard, /tickets/:id, /patterns)

3. REAL-TIME CONNECTION:
   - Server-Sent Events (SSE) endpoint: /v1/events/stream
   - Frontend: EventSource API to receive updates
   - When new ticket created → Pushes to UI immediately
   - When agent updates ticket → UI reflects change without refresh

4. DASHBOARD IMPLEMENTATION:
   - Left sidebar: Ticket stream (virtualized list, react-window)
   - Center: ReasoningTree for selected ticket
   - Right: System health gauges + approval queue
   - Top: Filters and global search

5. DETAIL VIEW:
   - Full ticket context
   - Merchant profile card
   - Agent diagnosis with evidence
   - Approval/Reject buttons for high-risk actions

TECHNICAL CONSTRAINTS:
- Dark mode only (slate-950 background)
- Colors: Emerald (orchestrator), Violet (diagnostician), Amber (healer)
- Responsive down to 1024px only (no mobile)
- Loading states: Skeleton screens (Stitch generates these)

HOOK UP TO BACKEND:
- GET /v1/tickets → Ticket stream
- GET /v1/tickets/{id}/diagnosis → Reasoning tree data
- POST /v1/decisions/{id}/approve → Approval buttons
- SSE /v1/events/stream → Real-time updates

VERIFICATION:
- Open browser to localhost:5173
- Create ticket via API → Appears in UI within 2 seconds
- Click ticket → See reasoning tree
- Click Approve → Backend receives POST

DELIVERABLE:
- Git commit: "PHASE 3: Interface manifested"
- Live UI showing real (mock) data flowing

DO NOT PROCEED UNTIL UI RENDERS WITHOUT ERRORS.
```
🛡️ PHASE 4: RESILIENCE (Hour 13-16)
Objective: Error handling, fallbacks, demo data, hardening
```text
ROLE: You are the Site Reliability Engineer (SRE).
PHASE: 4 (Resilience)
MISSION: Make it unbreakable for the demo.

1. ERROR BOUNDARIES:
   - React: Error Boundary components around:
     * Agent reasoning display
     * Ticket stream
     * Approval panel
   - Fallback UI: "Agent intelligence temporarily unavailable - showing cached data"
   - FastAPI: Try/catch on all endpoints, return 500 with structured error JSON

2. FALLBACK MODES:
   - If Gemini API fails → Switch to Pattern Library matching (regex)
   - If RAG fails → Use simple text search (LIKE %query%)
   - If DB fails → Use local SQLite (emergency mode)
   - If React fails → Terminal mode (rich console app as backup)

3. CIRCUIT BREAKERS:
   - 3 consecutive LLM failures → Open circuit for 60s → Use rule-based fallback
   - 5 consecutive DB timeouts → Switch to read-only mode

4. DEMO DATA GENERATION:
   - Create 20 realistic tickets covering all categories:
     * 4 API_ERROR (different types)
     * 4 CONFIG_ERROR
     * 4 WEBHOOK_FAIL
     * 4 CHECKOUT_BREAK
     * 4 DOCS_CONFUSION
   - Golden Path: One ticket that flows perfectly (use this for main demo)
   - Edge Case: Ambiguous ticket requiring human judgment
   - Crisis Mode: Multiple related failures (tests cascade handling)

5. HEALTH ENDPOINTS:
   - /health/live: Simple ping
   - /health/ready: DB + LLM API check
   - /metrics: Prometheus format (tickets_processed, latency, etc.)

6. DEMO SCRIPT PREP:
   - Write 3-minute walkthrough script
   - Time each section (0:00-0:30 intro, 0:30-1:30 magic, 1:30-3:00 closing)
   - Identify "wow moments" for emphasis
   - Prepare "if this breaks, show that" alternatives

7. BACKUP RECORDING:
   - Record Loom video showing perfect execution
   - Upload unlisted to YouTube or Google Drive
   - Have link ready for submission form

VERIFICATION:
- Kill internet → App shows "Offline Mode" with cached data
- Kill DB → App switches to SQLite without crashing
- Break Gemini → Falls back to keyword matching gracefully
- Run through demo script once without errors

DELIVERABLE:
- Git commit: "PHASE 4: Fortress complete"
- Demo script written
- Backup video recorded

APPROVAL REQUIRED FOR PHASE 5.
```
🚀 PHASE 5: DEPLOYMENT (Hour 16-18)
Objective: Production deployment, submission, final checks
```text
ROLE: You are the DevOps Engineer and Demo Presenter.
PHASE: 5 (Ascension)
MISSION: Ship it.

1. PRODUCTION CONFIG:
   - Environment variables set (real API keys, not test)
   - CORS origins configured (Vercel domain allowed)
   - Database migrations run on production Supabase
   - Redis connection string updated

2. DEPLOYMENT:
   Frontend:
   - cd frontend && vercel --prod
   - Verify: URL loads, no 404s
   
   Backend:
   - Railway: railway up (or Render: deploy from GitHub)
   - Verify: Health endpoint returns 200 from production URL
   
   Database:
   - Supabase: Run any final migrations
   - Seed with demo data

3. END-TO-END TEST:
   - Use production URL
   - Create ticket → Classifies → Diagnoses → Shows in UI
   - Approve action → Executes → Updates status
   - Test fallback: Turn off WiFi mid-demo → App degrades gracefully

4. PRESENTATION PREP:
   - Google Slides or Canva
   - 5 slides:
     1. Problem (Naitik's pain)
     2. Solution (Agent architecture diagram)
     3. Demo (Screenshots/GIFs from live app)
     4. Technical (ML components, complexity)
     5. Impact (Economic value, next steps)

5. SUBMISSION CHECKLIST:
   - GitHub repo public? YES/NO
   - README.md includes setup instructions? YES/NO
   - Demo video link works? YES/NO
   - Presentation file uploaded? YES/NO
   - All forms filled on Cyber Cypher portal? YES/NO

6. FINAL GIT TAG:
   git tag -a v1.0-submission -m "Cyber Cypher 5.0 Final Submission"
   git push origin v1.0-submission

VERIFICATION:
- Live URL works on phone (hotspot) and laptop
- Demo video plays without buffering
- Can explain architecture in 2 minutes without notes

DELIVERABLE:
- Submission confirmed
- Time remaining: 0 minutes
- Status: MISSION ACCOMPLISHED
```
