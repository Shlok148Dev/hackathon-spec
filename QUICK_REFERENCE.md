# Spec Kit Quick Reference

> **Emergency cheat sheet for hackathon day**

## File Hierarchy

```
spec/
├── context.md      → Problem + Constraints (NO features)
├── tech-spec.md    → Stack + Agent Rules (constrains behavior)
├── design.md       → UX Intent (feeds Stitch)
└── tasks/          → 8-12 atomic tasks MAX

docs/
├── STITCH_INTEGRATION.md     → UI generation workflow
├── ANTIGRAVITY_INTEGRATION.md → Task execution workflow
└── CONTROL_RULES.md          → During-hack rules

DEMO.md         → Demo flow + fallbacks
DECISIONS.md    → Decision log (log ALL changes)
```

## Phase B: Planning Order (When Problem Drops)

```
1. context.md     (10-15 min) → Freeze reality
   ↓ commit
2. tech-spec.md   (15-20 min) → Lock constraints
   ↓ commit
3. tasks/         (CRITICAL)  → Define scope (8-12 MAX)
   ↓ commit
4. design.md      (UX only)   → Feed Stitch
   ↓ commit
```

## Tool Integration

### Stitch (UI)
```
1. Copy spec/design.md
2. Paste in Stitch
3. Generate UI
4. Export to frontend/src/components/
5. Commit
```

### Antigravity (Code)
```
1. Give agent: tech-spec.md + ONE task file
2. Instruction: "Implement exactly. Stop at success criteria."
3. Agent executes
4. Verify
5. Commit
6. Next task
```

## During Hack: The 3 Allowed Actions

### ✅ Delete Task (Scope Cut)
```bash
rm spec/tasks/07-feature.md
# Log in DECISIONS.md
git commit -am "CUT SCOPE: Remove task 07"
```

### ✅ Tighten Success Criteria
```bash
# Edit task file, make criteria specific
git commit -am "Tighten task X criteria"
```

### ✅ Hardcode Demo Data
```bash
# Add to DEMO.md
# Use in components
# Log in DECISIONS.md
git commit -am "Add demo data fallback"
```

## Emergency Rollback
```bash
git log --oneline
git reset --hard <commit-hash>
# Log in DECISIONS.md
```

## Timeline

| Hour | Action |
|------|--------|
| 0-8 | Build (execute tasks) |
| 8-16 | Integrate (connect components) |
| 16-20 | Stabilize (cut scope, hardcode) |
| 20-24 | Demo Prep (CODE FREEZE) |

## Red Flags 🚩

- Agent inventing features → Stop, tighten agent rules
- >12 tasks → Merge or delete immediately
- Changing specs without logging → Rollback
- UI redesign after Hour 12 → CSS only
- No demo by Hour 16 → Cut 50% of tasks

## The Mantra

```
Spec Kit is law
GitHub is truth
Antigravity executes
Stitch decorates
```

## Commit Messages

```bash
git commit -am "Lock problem context"
git commit -am "Lock technical constraints"
git commit -am "Lock execution tasks"
git commit -am "Lock UX intent"
git commit -am "Complete task XX: [name]"
git commit -am "CUT SCOPE: [reason]"
git commit -am "SPEC CHANGE: [reason]"
```

## Decision Log Template

```markdown
[YYYY-MM-DD HH:MM] - Decision Title
Context: Why needed
Decision: What decided
Rationale: Why this choice
Impact: What affected
```

---

**Print this. Keep visible. Survive Hour 14.**
