# Google Antigravity Integration Guide

## Purpose
Google Antigravity executes atomic tasks with strict constraints to prevent drift and hallucination.

## Workflow

### Step 1: Prepare Task
1. Ensure `spec/tech-spec.md` is complete with:
   - Stack definition
   - Architecture rules
   - Agent rules
2. Select ONE task from `spec/tasks/` (e.g., `02-core-api.md`)
3. Verify task has:
   - Input (what exists)
   - Output (what must exist)
   - Success criteria (how to verify)

### Step 2: Spawn Antigravity Agent
1. Open Google Antigravity
2. Provide agent with TWO files:
   - `spec/tech-spec.md` (authority)
   - `spec/tasks/XX-task-name.md` (single task)

### Step 3: Give Instruction
Use this exact prompt template:

```
You are implementing a hackathon project under strict constraints.

AUTHORITY:
[Paste entire contents of spec/tech-spec.md]

TASK:
[Paste entire contents of spec/tasks/XX-task-name.md]

INSTRUCTION:
Implement this task exactly as specified.
Stop when all success criteria are met.
Do not invent features.
Do not proceed to other tasks.
If anything is unclear, stop and ask.

Report when complete with:
1. What was implemented
2. How success criteria were verified
3. Any blockers or questions
```

### Step 4: Monitor Execution
- ✅ Agent follows tech-spec constraints
- ✅ Agent stops at success criteria
- ✅ Agent asks when unclear
- ❌ Agent does NOT invent features
- ❌ Agent does NOT drift to other tasks

### Step 5: Verify and Commit
1. Review agent output against success criteria
2. Test implementation
3. If successful:
   ```bash
   git add .
   git commit -m "Complete task XX: [task name]"
   git push
   ```
4. Mark task as complete in `spec/tasks/README.md`

### Step 6: Next Task
1. Select next task from `spec/tasks/`
2. Repeat process
3. **One task at a time**

## Agent Rules (From tech-spec.md)
These rules constrain Antigravity behavior:

- ✅ Do not invent features
- ✅ If unclear, stop
- ✅ Demo stability > correctness
- ✅ Hardcode data when needed
- ✅ One task at a time

## Task Atomicity
Each task must be:
- **Independent:** Can be executed without other tasks
- **Verifiable:** Has clear success criteria
- **Bounded:** Has defined input and output
- **Demo-focused:** Contributes to working demo

## Handling Issues

### Agent Invents Features
1. Stop agent
2. Review `spec/tech-spec.md` agent rules
3. Make rules more explicit
4. Restart task

### Agent Gets Stuck
1. Review task success criteria
2. If criteria unclear, update task file
3. Commit updated task
4. Restart with clearer criteria

### Task Too Large
1. Stop agent
2. Split task into 2-3 smaller tasks
3. Update `spec/tasks/` directory
4. Commit changes
5. Execute smaller tasks sequentially

## Example Task Execution

**Task:** `spec/tasks/02-core-api.md`

```markdown
## Task 2 — Core API

### Input
- Git repo initialized
- Backend folder exists

### Output
- Express server running on port 3001
- POST /api/submit endpoint
- Returns { success: true, id: string }

### Success Criteria
- Server starts without errors
- curl POST returns expected JSON
- Response time < 100ms
```

**Antigravity Execution:**
1. Agent reads tech-spec.md (Node.js, Express)
2. Agent implements Express server
3. Agent creates POST endpoint
4. Agent tests with curl
5. Agent reports success with proof
6. You verify and commit

---

**Remember:** Antigravity executes. Spec Kit constrains. GitHub is truth.
