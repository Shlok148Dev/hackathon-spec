# Security Architecture

## Authentication
- Method: JWT (RS256) with 1-hour expiration
- Issuer: ClerkAuth or Supabase Auth
- Claims: {sub: user_id, role: admin|agent|readonly, iat: timestamp}

## Authorization (RBAC)
```python
class Permission(Enum):
    VIEW_TICKETS = "tickets:read"
    EXECUTE_ACTIONS = "actions:execute"
    APPROVE_HIGH_RISK = "actions:approve:critical"
    MANAGE_AGENTS = "agents:manage"

ROLE_PERMISSIONS = {
    "support_agent": [VIEW_TICKETS],
    "support_manager": [VIEW_TICKETS, EXECUTE_ACTIONS, APPROVE_HIGH_RISK],
    "system": [VIEW_TICKETS, EXECUTE_ACTIONS, MANAGE_AGENTS]  # For agents themselves
}
```
Data Protection
PII Masking: Regex to replace emails with [EMAIL], phones with [PHONE]
Encryption at Rest: Supabase handles this (AES-256)
Encryption in Transit: TLS 1.3 enforced
Audit Log: Every data access logged with user_id, timestamp, resource
Input Validation
All API inputs validated via Pydantic models
SQL Injection Prevention: SQLAlchemy ORM only (no raw queries)
XSS Prevention: React escapes by default, but CSP headers enforced:
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
