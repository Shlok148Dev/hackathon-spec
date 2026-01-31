# Hackathon Spec Kit

> **Boring name. Winning execution.**

## What This Is

Spec Kit is a **constraint-based planning system** for 24-hour hackathons that:
- Prevents agent hallucination
- Enforces atomic scope
- Provides rollback points
- Enables tool orchestration

## Repository Structure

```
hackathon-spec/
├── spec/
│   ├── context.md       # Problem statement & constraints
│   ├── tech-spec.md     # Stack & agent rules
│   ├── design.md        # UX intent (feeds Stitch)
│   └── tasks/           # 8-12 atomic tasks MAX
├── frontend/
│   └── src/
│       └── components/  # Stitch-generated UI
├── backend/             # API implementation
├── demo/                # Demo assets
├── docs/                # Integration guides
├── SCOPE.md             # Must Work vs Nice-to-Have
├── CHECKPOINTS.md       # Time-based discipline
├── DEMO.md              # Demo flow & fallbacks
├── DECISIONS.md         # Decision log
└── README.md            # This file
```

## Workflow

### Phase A — One-Time Setup (Do Once, Now)

1. **Create GitHub Repo**
   ```bash
   # Already done! This repo is your source of truth.
   ```

2. **Initialize Spec Kit**
   ```bash
   # Already done! Spec structure is in place.
   ```

3. **Lock Structure**
   ```bash
   git add .
   git commit -m "Initialize Spec Kit"
   ```

### Phase B — Planning (When Problem Drops)

**Follow this exact order. No skipping.**

1. **context.md** (10-15 min MAX)
   - Paste problem statement
   - Define target users
   - List constraints
   - Define non-goals
   - Commit: `git commit -am "Lock problem context"`

2. **tech-spec.md** (15-20 min)
   - Choose stack
   - Define architecture rules
   - List data models (minimal fields)
   - Define API contracts
   - Set agent rules
   - Commit: `git commit -am "Lock technical constraints"`

3. **tasks/** (MOST IMPORTANT)
   - Create 8-12 task files MAX
   - Each task: Input → Output → Success Criteria
   - If >12 tasks → you already lost
   - Commit: `git commit -am "Lock execution tasks"`

4. **design.md** (UX intent only)
   - Core user flow
   - Screen purposes
   - Design principles
   - NO colors, layouts, or components
   - Commit: `git commit -am "Lock UX intent"`

### Phase C — Tool Integration

**Spec Kit → Google Stitch**
1. Copy `spec/design.md`
2. Paste into Stitch
3. Generate UI
4. Export to `frontend/src/components`
5. Commit

**Spec Kit → Google Antigravity**
1. Give agent authority: `spec/tech-spec.md` + ONE task file
2. Instruction: "Implement this task exactly. Stop when success criteria is met."
3. Agent executes with stop conditions
4. No drift

### Phase D — During Hack (Control Rules)

**You NEVER:**
- Add features outside tasks
- Change specs casually
- Redesign mid-build

**You ONLY:**
- Delete task files (scope cut)
- Tighten success criteria
- Hardcode demo data

**Log all changes in `DECISIONS.md`**

## Why This Works Under Pressure

At Hour 14:
- ✅ Written decisions
- ✅ Rollback points
- ✅ Scope kill switches
- ✅ Restart clarity

## Tool Hierarchy

```
GitHub (Source of Truth)
   ↓
Spec Kit (Constraints)
   ↓
├─→ Google Stitch (UI Generation)
└─→ Google Antigravity (Code Execution)
```

## Final Lock-In

- **Spec Kit is law**
- **GitHub is truth**
- **Antigravity executes**
- **Stitch decorates**

No tool debates. No switching.

---

**Now commit this structure and you're ready for battle.**
