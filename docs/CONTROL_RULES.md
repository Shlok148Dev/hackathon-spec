# During-Hack Control Rules

## The Iron Law

**At Hour 14, when you're tired and agents misbehave:**

Spec Kit gives you:
- ✅ Written decisions
- ✅ Rollback points
- ✅ Scope kill switches
- ✅ Restart clarity

## What You NEVER Do

### ❌ Add Features Outside Tasks
**Problem:** Feature creep kills demos.

**Rule:** If it's not in `spec/tasks/`, it doesn't exist.

**If you want a feature:**
1. Stop coding
2. Open `DECISIONS.md`
3. Log the feature idea
4. Decide: Is it demo-critical?
5. If NO → reject and log why
6. If YES → create task file, commit, then implement

### ❌ Change Specs Casually
**Problem:** Spec drift causes agent confusion.

**Rule:** Specs are locked after Phase B.

**If you must change:**
1. Stop all agents
2. Update spec file
3. Log change in `DECISIONS.md`
4. Commit: `git commit -am "SPEC CHANGE: [reason]"`
5. Restart affected tasks

### ❌ Redesign Mid-Build
**Problem:** UI churn wastes time.

**Rule:** Design is locked after Stitch generation.

**If UI is broken:**
1. Fix with CSS tweaks only
2. Do NOT regenerate in Stitch
3. Do NOT change component structure
4. Log fix in `DECISIONS.md`

## What You ONLY Do

### ✅ Delete Task Files (Scope Cut)
**When:** Task is taking too long or blocking demo.

**Process:**
1. Open `spec/tasks/`
2. Delete task file (e.g., `rm 07-advanced-feature.md`)
3. Update `DECISIONS.md`:
   ```
   [2026-01-31 18:30] - Cut Task 07
   Context: Hour 18, feature not demo-critical
   Decision: Remove advanced feature
   Rationale: Demo stability > completeness
   Impact: Demo still works, scope reduced
   ```
4. Commit: `git commit -am "CUT SCOPE: Remove task 07"`
5. Continue with remaining tasks

### ✅ Tighten Success Criteria
**When:** Task success criteria too vague, agent drifting.

**Process:**
1. Open task file
2. Make success criteria more specific
3. Example:
   ```diff
   - API returns data
   + API returns { success: true, id: "123" } in <100ms
   ```
4. Commit: `git commit -am "Tighten task X criteria"`
5. Restart task with clearer criteria

### ✅ Hardcode Demo Data
**When:** API integration failing, time running out.

**Process:**
1. Open `DEMO.md`
2. Add hardcoded data:
   ```javascript
   const DEMO_DATA = {
     user: { id: "1", name: "Demo User" },
     results: [...]
   };
   ```
3. Update component to use demo data
4. Log in `DECISIONS.md`:
   ```
   [2026-01-31 20:00] - Hardcode Demo Data
   Context: API flaky, 4 hours left
   Decision: Use static demo data
   Rationale: Demo stability > real API
   Impact: Demo works reliably
   ```
5. Commit: `git commit -am "Add demo data fallback"`

## Emergency Rollback

**When:** Everything is broken, need to restart.

**Process:**
1. Check commit history:
   ```bash
   git log --oneline
   ```
2. Find last working commit
3. Rollback:
   ```bash
   git reset --hard <commit-hash>
   ```
4. Log in `DECISIONS.md`:
   ```
   [Time] - Emergency Rollback
   Context: [what broke]
   Decision: Rollback to commit [hash]
   Rationale: [why]
   Impact: [what was lost]
   ```
5. Restart from stable point

## Scope Management

### Hour 0-8: Build
- Execute tasks sequentially
- Follow specs strictly
- No scope changes

### Hour 8-16: Integrate
- Connect components
- Test end-to-end
- Start cutting non-critical tasks

### Hour 16-20: Stabilize
- **STOP adding features**
- Fix critical bugs only
- Hardcode flaky parts
- Polish demo flow

### Hour 20-24: Demo Prep
- **CODE FREEZE**
- Practice demo
- Prepare fallbacks
- Document known issues

## Decision Log Format

Every change must be logged in `DECISIONS.md`:

```markdown
[YYYY-MM-DD HH:MM] - Decision Title
Context: Why this decision was needed
Decision: What was decided
Rationale: Why this choice
Impact: What this affects
```

**Example:**
```markdown
[2026-01-31 19:15] - Switch to Mock Authentication
Context: OAuth integration failing, 5 hours left
Decision: Use hardcoded user session
Rationale: Demo needs working login, OAuth not critical
Impact: Tasks 08-09 scope reduced, demo stable
```

## Red Flags

### 🚩 Agent Inventing Features
**Action:** Stop agent, review `spec/tech-spec.md`, tighten agent rules.

### 🚩 >12 Tasks in spec/tasks/
**Action:** Merge or delete tasks immediately.

### 🚩 Changing Specs Without Logging
**Action:** Rollback, log decision, then change.

### 🚩 UI Redesign After Hour 12
**Action:** Stop. Fix with CSS only.

### 🚩 No Working Demo by Hour 16
**Action:** Emergency scope cut. Delete 50% of tasks.

## The Mantra

```
Spec Kit is law
GitHub is truth
Antigravity executes
Stitch decorates

No tool debates.
No switching.
No surprises.
```

---

**Remember:** At Hour 14, this file saves you.
