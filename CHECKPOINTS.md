# Hackathon Checkpoints

> **Time-based discipline enforcement. Review at each checkpoint.**

## Hour 6 — Foundation Check

**Required:**
- [ ] All specs locked (context, tech-spec, tasks, design)
- [ ] Foundation tasks ≥50% complete
- [ ] Dev environment running
- [ ] First component renders

**If behind:**
- Cut nice-to-have tasks
- Simplify data models
- Use mock data earlier

**Git Tag:**
```bash
git tag hour-6 -m "Foundation checkpoint"
git push --tags
```

---

## Hour 12 — Scope Freeze

**Required:**
- [ ] Core user flow works end-to-end
- [ ] All "Must Work" items functional
- [ ] Demo data prepared

**SCOPE FREEZE:**
- ❌ No new features
- ❌ No new tasks
- ✅ Integration only
- ✅ Bug fixes only

**Action:**
- Open `SCOPE.md`
- Cut all "Nice-to-Have" items
- Delete corresponding task files
- Commit: `git commit -am "SCOPE FREEZE: Cut non-critical features"`

**Git Tag:**
```bash
git tag hour-12 -m "Scope freeze"
git push --tags
```

---

## Hour 18 — Polish Only

**Required:**
- [ ] Demo flow rehearsed
- [ ] Fallbacks tested
- [ ] Known issues documented

**CODE FREEZE:**
- ❌ No logic changes
- ❌ No refactoring
- ✅ CSS tweaks only
- ✅ Error messages only
- ✅ Demo script only

**Action:**
- Practice demo 3x
- Document fallback triggers in `DEMO.md`
- Prepare 2-minute pitch

**Git Tag:**
```bash
git tag hour-18 -m "Polish checkpoint"
git push --tags
```

---

## Hour 22 — Final Lockdown

**Required:**
- [ ] Demo works reliably (tested 5x)
- [ ] Pitch ready
- [ ] Screenshots captured

**ABSOLUTE FREEZE:**
- ❌ No code changes
- ✅ Demo practice only
- ✅ Pitch refinement only

**Git Tag:**
```bash
git tag final -m "Demo ready"
git push --tags
```

---

## Emergency Rollback

If something breaks:

```bash
# See all checkpoints
git tag

# Rollback to last stable checkpoint
git reset --hard hour-18
git push --force

# Log in DECISIONS.md
```

---

## Checkpoint Discipline

**Why this matters:**

At Hour 14, you're tired.
You'll want to add "just one more feature."
These checkpoints say **NO**.

**The checkpoints protect you from yourself.**
