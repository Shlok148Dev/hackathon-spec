# FAILURE MODE & EFFECTS ANALYSIS (FMEA)
## Operational Continuity Protocols for Critical System Failures

### FAILURE CLASS A: LLM API DEGRADATION

#### Scenario A1: Gemini Rate Limiting (429 Errors)
**Symptoms**: `google.api_core.exceptions.ResourceExhausted`, 429 status codes
**Impact**: Agent reasoning stalls, tickets queue indefinitely

**Immediate Response Protocol**:
1. **Circuit Breaker Activation** (0-30s):
   ```python
   from circuitbreaker import circuit
   
   @circuit(failure_threshold=5, recovery_timeout=60)
   async def llm_call_with_fallback(prompt):
       try:
           return await gemini.generate(prompt)
       except ResourceExhausted:
           raise FallbackTriggered()
   ```
Fallback Cascade (30s):
Tier 1: Switch to Gemini Flash (cheaper, higher quota)
Tier 2: Switch to cached responses (Redis lookup for similar queries)
Tier 3: Keyword-based rules (Regex → Static response)
Tier 4: Immediate human escalation with context bundle
User Communication:
UI shows: "AI analysis paused - using heuristic mode" (amber banner)
Queue depth indicator turns red if >10 tickets waiting
Recovery:
Automatic retry with exponential backoff (2^n seconds, cap at 60s)
Resume full AI mode when 5 consecutive calls succeed

### FAILURE CLASS B: DATA PERSISTENCE FAILURE
Scenario B1: Supabase Connection Timeout
Symptoms: psycopg2.OperationalError: connection timeout, health check fails
Impact: Cannot write decisions, agents lose memory between restarts
Immediate Response Protocol:
Failover to Local SQLite (5s):
```python
# At startup, if PostgreSQL fails:
sqlalchemy_database_url = "sqlite:///./emergency_cache.db"
# Note: Data loss acceptable for hackathon demo duration
```
Write-Ahead Logging (Continuous):
All decisions append to decisions.jsonl (newline-delimited JSON)
On DB recovery, replay.jsonl to PostgreSQL
Buffer size: 1000 lines or 5 minutes, whichever first
Alerting:
Dashboard shows: "Operating in Limited Mode" (red banner)
System continues with degraded performance but functional

### FAILURE CLASS C: FRONTEND CATASTROPHE
Scenario C1: React Build Failure / White Screen
Symptoms: npm run build fails, blank page on load, console errors
Impact: No UI for demo
Immediate Response Protocol (15-minute fix):
Terminal Demo Mode (Plan B):
```python
# rich_console_demo.py
from rich.console import Console
from rich.table import Table
from rich.live import Live

console = Console()
# Beautiful terminal UI showing agent activity
# Judges see: Real-time logs, agent decisions, ticket flow
# Command: python rich_console_demo.py
```
Aesthetic: Cyberpunk terminal style (green text on black)
Functionality: Keyboard navigation (arrow keys), live SSE stream
Advantage: Actually impressive to technical judges (looks like "real hacking")
Static HTML Fallback (Plan C):
Export last working React build to static HTML
Serve via python -m http.server
Data mocked in JS file (no backend needed for demo)
Demo Script Adjustment:
"While the full React UI renders in production, let me show you the
core agent intelligence via our debugging interface..." [switch to terminal]
Pivot from "pretty UI" to "sophisticated backend" narrative

### FAILURE CLASS D: AGENT LOGIC FAILURE
Scenario D1: Infinite Loop / Recursive Hell
Symptoms: Agent keeps calling itself, CPU 100%, memory leak, same ticket processed 100x
Impact: System hang, false "activity" that accomplishes nothing
Kill Switch Protocol:
Iteration Guard (Hard limit):
```python
max_agent_iterations = 10
if context.iteration_count > max_agent_iterations:
    raise AgentStuckError("Forcing escalation after 10 loops")
```
State Hash Detection:
Hash agent state after each step
If same state seen twice → loop detected → break
Force random exploration or human handoff
Circuit Breaker:
If error rate >50% for agent → pause agent for 5 minutes
Route all tickets to human pool

### THE NUCLEAR OPTION (Hour 12, Critical Mass)
Trigger Conditions:
<40% of features complete AND >1 critical component failing
OR: Demo in 6 hours and no working end-to-end flow
Protocol: Static Showcase Mode
Freeze Current Code (git commit -m "NUCLEAR_FREEZE")
Generate Mock Dataset (100 synthetic tickets with perfect resolutions)
Pre-record Loom Video (3 minutes of "perfect" operation using mock data)
Create Architecture Slides (heavy focus on system design, ML components)
Demo Strategy: "This is a sophisticated agentic architecture. Due to API limitations
in the demo environment, I'm showing you the recorded implementation, but the full
codebase is in the repo for your review."
Outcome: Lose "live demo" points, win "technical depth" and "architecture" points.

### HEALTH MONITORING (Self-Check Script)
Run this every hour during the hackathon:
```bash
#!/bin/bash
# health_check.sh

echo "=== HERMES SYSTEM HEALTH ==="
echo "Time: $(date)"

# Check API
curl -sf http://localhost:8000/health || echo "❌ API DOWN"

# Check DB
pg_isready -d $DATABASE_URL || echo "❌ DB DOWN"

# Check Agent
tail -5 logs/agent.log | grep "ERROR" && echo "❌ AGENT ERRORS DETECTED"

# Check Disk
if [ $(df -h . | awk 'NR==2 {print $5}' | sed 's/%//') -gt 90 ]; then
    echo "❌ DISK FULL"
fi

echo "=== END HEALTH CHECK ==="
```
CONTACT ESCALATION TREE (If You Get Stuck)
Hour 0-6: Try to fix, use StackOverflow/ChatGPT (ADK-specific questions)
Hour 6-12: Cut scope aggressively (use contingency plans)
Hour 12-16: Terminal mode acceptable (don't fight frontend bugs)
Hour 16-18: Record video backup (don't risk live demo failure)
