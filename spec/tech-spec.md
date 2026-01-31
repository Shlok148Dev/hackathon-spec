# Technical Specification

## Stack
**Frontend:**
- Framework:
- Key Libraries:

**Backend:**
- Runtime:
- Framework:

**Database:**
- Type:

## Architecture Rules
- Single backend
- No microservices
- Prefer mock data
- (add more constraints)

## Data Models
(list minimal fields only)

### Example Model
```
User:
  - id
  - name
  - email
```

## API Contracts

| Endpoint | Input | Output |
|----------|-------|--------|
| POST /api/example | { field: string } | { result: string } |

## Agent Rules (IMPORTANT)
- ✅ Do not invent features
- ✅ If unclear, stop
- ✅ Demo stability > correctness
- ✅ Hardcode data when needed
- ✅ One task at a time

---

**Purpose:** This file controls how agents are allowed to behave. It constrains, not describes.
