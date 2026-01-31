# OPERATION HERMES: 18-HOUR TEMPORAL BATTLE PLAN
## Timeline: 31 Jan 2026 18:00 → 01 Feb 2026 12:00 (18 hours)
## Phase Structure: 5 Gates with Kill Conditions

---

# PHASE 0: THE CALM BEFORE (Pre-18:00)
**Status**: ✅ COMPLETE (You should be here now)
**Deliverable**: Infrastructure scaffold, tool verification

**Checklist**:
- [_] ADK installed `pip list | grep google-adk`
- [_] Supabase project created with tables schema loaded
- [_] GitHub repo pushed with README
- [_] Google Stitch accessible (labs.google.com)
- [ ] Deployment targets accounts created (Vercel, Railway)

---

# PHASE 1: FOUNDATION (Hour 0-3) [18:00-21:00]
**Codename**: GROUNDWORK
**Objective**: Agents exist, database lives, API breathes
**Kill Condition**: If not complete by 21:30, proceed to NUCLEAR OPTION

### Hour 0.0-0.5 (18:00-18:30): The Genesis Commit
- Commit the 9 Spec Files to `main` (if not done)
- Create `.env.example` with all required variables (empty values)
- Run `adk create app hermes` to scaffold agent structure
- **Verification**: `git status` shows clean working tree

### Hour 0.5-1.5 (18:30-19:30): Database Genesis
**SQL to Execute**:
```sql
-- Run this in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;

-- (Full schema from tech-spec.md)
-- Note: Copy-paste the CREATE TABLE statements from spec/tech-spec.md Section 3
Create tables: merchants, tickets, agent_decisions, documentation_chunks (with pgvector), patterns
Insert 5 mock merchants with realistic data
Verification: SELECT count(*) FROM merchants returns 5
```
### Hour 1.5-2.5 (19:30-20:30): FastAPI Skeleton
Initialize FastAPI app with /health endpoint
Configure SQLAlchemy models matching spec
Set up Pydantic schemas for request/response validation
Verification: curl localhost:8000/health returns {"status":"ok"}

### Hour 2.5-3.0 (20:30-21:00): Agent Embryos
Create agent definitions in ADK (YAML configs)
Stub out tool functions (pass/return mock data)
Verification: adk dev starts without ImportError

### Gate 1 Checkpoint (21:00)
Pass Criteria:
[ ] Database has tables with mock data
[ ] API responds to health check
[ ] ADK agents initialize without crashing
[ ] Git commit: git commit -m "GATE 1: Foundation complete"
Failure Protocol:
If DB fails → Switch to SQLite file (local only)
If ADK fails → Switch to pure Python classes (no ADK framework)
DO NOT PROCEED TO PHASE 2 until Gate 1 passes

PHASE 2: INTELLIGENCE (Hour 3-9) [21:00-03:00]
Codename: AWAKENING
Objective: Agents think, ML components classify, RAG retrieves
Kill Condition: If <60% complete by 03:00, cut Healer agent (reduce scope)
Hour 3-4 (21:00-22:00): The Classifier Brain
Implement ticket classification using Gemini 1.5 Pro
Create few-shot prompt with 10 examples (5 per class)
Test on 20 synthetic tickets
Target: >80% accuracy
ML Bonus: First ML component complete
Hour 4-5 (22:00-23:00): The Memory Palace (RAG)
Chunk documentation (use markdown headers)
Generate embeddings using text-embedding-004
Store in pgvector
Implement similarity search endpoint
Verification: Query "webhook ssl error" returns relevant doc chunks
Hour 5-7 (23:00-01:00): The Diagnostician
Build parallel investigation logic (3 hypotheses)
Integrate classifier + RAG + log analyzer tools
Create reasoning chain formatter (JSON for UI)
Verification: Input ticket → Output diagnosis with evidence citations
Hour 7-8 (01:00-02:00): The Pattern Learner
Implement pattern extraction from resolved tickets
Create feedback ingestion loop (success/failure updates)
Build anomaly detector (Isolation Forest)
ML Bonus: Second ML component (anomaly detection)
Hour 8-9 (02:00-03:00): Orchestrator Wiring
Connect all components: Ingestion → Classify → Diagnose → Store
Create the /v1/tickets endpoint (full flow)
Verification: POST ticket → See it classified and diagnosed automatically
Gate 2 Checkpoint (03:00)
Pass Criteria:
[ ] Classification accuracy >80% on test suite
[ ] Diagnosis generates 3 hypotheses with evidence
[ ] Anomaly detection flags synthetic spike
[ ] Git commit: git commit -m "GATE 2: Intelligence online"
Scope Cut Triggers:
If classification <60% → Use rule-based fallback (keywords)
If RAG fails → Use simple text search (LIKE queries)
If anomaly detection fails → Hardcode thresholds
PHASE 3: INTERFACE (Hour 9-13) [03:00-07:00]
Codename: MANIFESTATION
Objective: Mission Control UI exists and connects to brain
Kill Condition: If UI not rendering by 07:00, switch to Terminal Demo Mode
Hour 9-10 (03:00-04:00): Stitch Harvest
Copy prompts from spec/stitch-prompts.md
Generate components in Stitch (Dashboard shell, Ticket cards, Agent nodes)
Export to React
Verification: Components render in isolation (Storybook or simple import)
Hour 10-11 (04:00-05:00): React Integration
Set up Vite project with TanStack Query
Connect to FastAPI backend (CORS configured)
Implement SSE for real-time updates
Verification: UI shows mock ticket data from API
Hour 11-12 (05:00-06:00): The Cognitive Visualization
Build reasoning tree component (react-flow or custom SVG)
Connect to /v1/tickets/{id}/diagnosis endpoint
Show live agent thinking (stream reasoning chain)
Verification: Create ticket → Watch reasoning appear in real-time
Hour 12-13 (06:00-07:00): Approval Workflows
Build approval buttons for high-risk actions
Implement human-in-the-loop UI (queue of pending actions)
Add risk indicators (color-coded borders)
Verification: Healer proposes action → appears in UI → Click Approve → Executes
Gate 3 Checkpoint (07:00)
Pass Criteria:
[ ] Dashboard renders without white screen
[ ] Real-time ticket stream updates
[ ] Can approve/reject actions via UI
[ ] Git commit: git commit -m "GATE 3: Interface manifested"
Fallback:
If React fails → Use rich terminal UI (Python Rich library) - surprisingly impressive for technical judges
If Tailwind breaks → Use plain CSS with dark mode classes only
PHASE 4: RESILIENCE (Hour 13-16) [07:00-10:00]
Codename: FORTRESS
Objective: It won't break during demo; demo data prepared
Hour 13-14 (07:00-08:00): The Safety Net
Implement error boundaries (React Error Boundary)
Add circuit breakers for LLM API (fail fast if rate limited)
Create fallback modes (keyword search if RAG fails)
Verification: Disconnect internet → App shows "Offline Mode" gracefully
Hour 14-15 (08:00-09:00): Demo Data Curation
Generate 20 realistic synthetic tickets (varied scenarios)
Create "Golden Path" ticket (perfect resolution flow)
Create "Edge Case" ticket (ambiguous, requires human judgment)
Create "Crisis Mode" ticket (multiple failures, tests cascade handling)
Verification: Can walk through all 4 scenarios in UI
Hour 15-16 (09:00-10:00): Theatrical Polish
Add loading skeletons (Stitch has these)
Add success animations (checkmarks, confetti for resolved tickets)
Optimize Lighthouse score (target >70)
Verification: Demo flows feel "magical" not "technical"
Gate 4 Checkpoint (10:00)
Pass Criteria:
[ ] App works without internet (cached/localhost)
[ ] 4 demo scenarios tested and documented
[ ] No console errors during golden path
[ ] Git commit: git commit -m "GATE 4: Resilience hardened"
PHASE 5: DEPLOYMENT (Hour 16-18) [10:00-12:00]
Codename: ASCENSION
Objective: Living URL, recorded backup, submission complete
Hour 16-17 (10:00-11:00): Production Deployment
Frontend: vercel --prod (from frontend directory)
Backend: railway up or deploy to Render
Database: Ensure production Supabase has schema
Environment variables: Set production keys (not .env.local)
Verification: Live URL loads, creates ticket, resolves it
Hour 17-17.5 (11:00-11:30): Demo Recording
Record 3-minute screen capture (OBS or Loom)
Narrate the Golden Path scenario
Save to demo-final.mp4
Backup: Upload to Google Drive (unlisted link)
Hour 17.5-18 (11:30-12:00): Submission
Final git push with tags: git tag v1.0-submission && git push origin v1.0-submission
Submit GitHub repo to Cyber Cypher form
Submit Presentation (Google Slides/PDF)
Submit Demo Video link
Verification: Confirmation email received
Gate 5 (12:00 PM Feb 1)
Status: MISSION COMPLETE 🎉
Post-Mortem: Document what worked, what didn't, technical debt accrued
CONTINGENCY TIMELINE (If Behind Schedule)
At Hour 6 (Midnight): The Midnight Cut
If Phase 2 <50% complete:
Cut Anomaly Detection (hardcode thresholds instead)
Cut Pattern Learning (use static patterns only)
Focus only on Classification + RAG
At Hour 9 (03:00): The Witching Hour Cut
If Phase 2 incomplete:
Cut RAG (use simple keyword search: SELECT * FROM docs WHERE content LIKE '%error%')
Cut Healer autonomy (all actions require human approval - simplifies logic)
At Hour 12 (06:00): The Dawn Cut
If UI not working:
NUCLEAR OPTION: Terminal-based demo (Python Rich library)
Show logs streaming, agent reasoning in terminal (very "hacker aesthetic")
Explain: "Full React UI in repo, demonstrating agent intelligence via CLI"
At Hour 16 (10:00): The Final Stand
If deployment fails:
Submit localhost version with instructions
Provide Loom video showing it working locally
Accept that you lose "live demo" points but keep "technical sophistication" points
THE GOLDEN PATH (The Perfect Demo Flow)
Timestamp 0:00 - "This is merchant Sarah. Her checkout is broken."
Timestamp 0:30 - "Watch as our agent swarm detects the issue from multiple signals."
Timestamp 1:00 - "The Diagnostician correlates 3 separate error sources."
Timestamp 1:30 - "With 94% confidence, it identifies the root cause: SSL certificate expired."
Timestamp 2:00 - "Proposed fix: Auto-renew certificate. Human approves."
Timestamp 2:30 - "Fixed verified. Merchant notified. Knowledge learned for next time."
Timestamp 3:00 - "The system just saved Sarah $40,000 in lost revenue. Autonomously."
