system:
  name: "Hermes" # Greek god of transitions/messengers (fitting for migration support)
  version: "0.1.0-hackathon"
  architecture: "Event-Driven Micro-Agent Swarm"
  
  # ==========================================
  # INFRASTRUCTURE LAYER
  # ==========================================
  infrastructure:
    compute:
      primary: "Python 3.11 (FastAPI + uvicorn)"
      concurrency: "AsyncIO with uvloop optimization"
      workers: "4 uvicorn workers (simulated load balancing)"
    
    database:
      primary_db: "Supabase PostgreSQL 15"
      vector_store: "pgvector 0.5.1 (embedded in PostgreSQL)"
      cache: "Redis 7 (upstash.io free tier acceptable)"
      connection_pool: "PgBouncer (transaction mode)"
      
    storage:
      artifacts: "Supabase Storage (documentation PDFs, schemas)"
      logs: "Structured JSONL (local file rotation, simulated cloudwatch)"
      
    messaging:
      queue: "Redis Streams (lightweight, no RabbitMQ complexity)"
      events: "Server-Sent Events (SSE) to frontend (no WebSocket complexity)"
      
  # ==========================================
  # AGENT ARCHITECTURE (Google ADK)
  # ==========================================
  agent_swarm:
    topology: "Supervisor-Worker with Shared Memory"
    
    agents:
      - id: "orchestrator"
        type: "SequentialAgent"
        model: "gemini-2.0-flash"
        temperature: 0.1  # Low creativity, high determinism
        max_retries: 3
        tools:
          - "ticket_classifier"
          - "priority_calculator"
          - "router"
          - "escalation_manager"
        responsibilities:
          - "Ingestion validation"
          - "Initial triage"
          - "Load balancing to workers"
        memory_scope: "session"  # Short-term, per-ticket
        
      - id: "diagnostician"
        type: "ParallelAgent"  # Investigates multiple hypotheses simultaneously
        model: "gemini-2.0-pro"  # Better reasoning, slower
        temperature: 0.2
        parallel_calls: 3  # Investigate 3 hypotheses at once
        tools:
          - "log_analyzer"
          - "doc_rag_retriever"
          - "config_validator"
          - "pattern_matcher"
          - "api_schema_checker"
        responsibilities:
          - "Root cause analysis"
          - "Evidence collection"
          - "Hypothesis generation and testing"
        memory_scope: "episodic"  # Can recall similar past tickets
        
      - id: "healer"
        type: "LoopAgent"  # Retry logic built-in
        model: "gemini-2.0-flash"
        temperature: 0.0  # Deterministic for safety
        max_iterations: 3  # Try fix 3 times max
        tools:
          - "doc_updater"
          - "merchant_notifier"
          - "config_suggester"
          - "webhook_reenabler"
        responsibilities:
          - "Intervention execution"
          - "Verification of fixes"
          - "Rollback if failed"
        memory_scope: "permanent"  # Learns from success/failure
        
      - id: "learner"
        type: "BackgroundAgent"  # Runs on cron, not per-ticket
        schedule: "0 */4 * * *"  # Every 4 hours
        model: "gemini-2.0-flash"
        tools:
          - "pattern_extractor"
          - "feedback_analyzer"
          - "doc_generator"
        responsibilities:
          - "Long-term pattern recognition"
          - "Documentation improvement"
          - "Model performance tuning"
          
  # ==========================================
  # MACHINE LEARNING PIPELINE
  # ==========================================
  ml_components:
    - name: "ticket_classifier_v1"
      type: "few_shot_classification"
      model: "gemini-1.5-pro"  # Long context for examples
      embedding_cache: true
      classes:
        - id: "API_ERROR"
          description: "GraphQL/REST endpoint failures, schema mismatches"
          severity: 8
        - id: "CONFIG_ERROR"
          description: "Misconfigured webhooks, tokens, environment variables"
          severity: 7
        - id: "WEBHOOK_FAIL"
          description: "SSL issues, timeouts, signature validation failures"
          severity: 9  # Critical (affects external systems)
        - id: "CHECKOUT_BREAK"
          description: "Payment flow failures, cart calculation errors"
          severity: 10  # Maximum priority
        - id: "DOCS_CONFUSION"
          description: "Developer confusion, unclear migration guides"
          severity: 4
        - id: "PLATFORM_BUG"
          description: "Confirmed platform-side regression"
          severity: 6
      features:
        - "ticket_title + description (TF-IDF weighted)"
        - "merchant_migration_stage (categorical)"
        - "error_code patterns (regex extracted)"
        - "temporal_features (time since migration)"
        
    - name: "doc_rag_engine"
      type: "retrieval_augmented_generation"
      embedding_model: "models/text-embedding-004"
      vector_store: "pgvector"
      chunking_strategy:
        method: "semantic"
        chunk_size: 512
        overlap: 50
      retrieval:
        top_k: 5
        reranker: "cross-encoder (optional, fallback to cosine similarity)"
      context_window: "8192 tokens"
      
    - name: "anomaly_detector"
      type: "unsupervised_learning"
      algorithm: "IsolationForest (sklearn)"
      features:
        - "error_rate_rolling_mean (window=1h)"
        - "ticket_volume_velocity (tickets/min)"
        - "merchant_health_score (composite)"
        - "api_latency_p95"
      contamination: 0.05  # Expect 5% anomalies
      threshold: "-0.35"  # Isolation Forest score
      action: "generate_synthetic_ticket"  # Auto-create high-priority alert
      
  # ==========================================
  # API SPECIFICATION (OpenAPI 3.0)
  # ==========================================
  api:
    version: "v1"
    spec: "/docs/openapi.yaml"  # Auto-generated by FastAPI
    auth:
      type: "JWT (RS256)"
      issuer: "https://your-auth-provider.com"
      audience: "hermes-api"
    rate_limiting:
      strategy: "token_bucket"
      default: "100/minute"
      burst: "150"
      
    endpoints:
      - path: "/v1/tickets"
        methods: ["POST", "GET"]
        description: "Ticket lifecycle management"
        schema:
          id: "uuid"
          merchant_id: "uuid"
          raw_text: "text"
          classification: "enum"
          confidence: "float 0-1"
          status: "enum [open, analyzing, resolved, escalated]"
          priority_score: "integer 1-10"
          created_at: "timestampz"
          
      - path: "/v1/tickets/{id}/diagnosis"
        methods: ["GET"]
        description: "Get full reasoning chain"
        response:
          hypotheses: "array"
          evidence: "array"
          conclusion: "object"
          confidence: "float"
          
      - path: "/v1/decisions/{id}/approve"
        methods: ["POST"]
        description: "Human approval for high-risk actions"
        body:
          approved: "boolean"
          approver_id: "uuid"
          justification: "text"
          
      - path: "/v1/agents/status"
        methods: ["GET"]
        description: "Real-time agent health and cognition"
        response:
          orchestrator: "status_object"
          diagnostician: "status_object"
          healer: "status_object"
          queue_depth: "integer"
          
      - path: "/v1/webhooks/platform"
        methods: ["POST"]
        description: "Ingest platform events"
        security: "hmac_signature_sha256"
        
  # ==========================================
  # DATABASE SCHEMA (PostgreSQL)
  # ==========================================
  database:
    tables:
      - name: "merchants"
        columns:
          - id: "uuid primary key"
          - external_id: "varchar(255) unique"  # Shopify/BigCommerce ID
          - tier: "enum [free, growth, enterprise]"
          - migration_stage: "enum [not_started, in_progress, completed, rollback]"
          - config_json: "jsonb"  # Encrypted at application layer
          - health_score: "decimal(3,2)"  # 0.00-1.00
          - created_at: "timestampz"
          - updated_at: "timestampz"
        indexes:
          - "gin(config_json)"  # For JSON queries
          - "btree(health_score)"
          
      - name: "tickets"
        columns:
          - id: "uuid primary key"
          - merchant_id: "uuid foreign key"
          - channel: "enum [email, chat, api, auto_detected]"
          - raw_text: "text"
          - processed_text: "text"  # Cleaned/PPI masked
          - classification: "varchar(50)"
          - classification_confidence: "decimal(3,2)"
          - priority: "integer"  # 1-10
          - status: "varchar(20)"
          - assigned_agent: "enum [orchestrator, human, pending]"
          - root_cause: "text"  # Generated by diagnostician
          - resolution_action: "text"
          - created_at: "timestampz"
          - resolved_at: "timestampz"
        indexes:
          - "btree(merchant_id, created_at)"
          - "gin(to_tsvector('english', raw_text))"  # Full-text search
          
      - name: "agent_decisions"
        columns:
          - id: "uuid primary key"
          - ticket_id: "uuid foreign key"
          - agent_id: "varchar(50)"
          - reasoning_chain: "jsonb"  # Full trace
          - proposed_action: "jsonb"
          - action_type: "enum [auto_executed, human_approved, rejected, escalated]"
          - risk_level: "enum [low, medium, high, critical]"
          - executed_at: "timestampz"
          - executed_by: "varchar(50)"  # Agent ID or human email
          - rollback_available_until: "timestampz"
          - outcome_verified: "boolean"
        indexes:
          - "btree(ticket_id)"
          - "gin(reasoning_chain)"  # For querying specific reasoning patterns
          
      - name: "documentation_chunks"
        columns:
          - id: "uuid primary key"
          - content: "text"
          - embedding: "vector(768)"  # text-embedding-004 dimension
          - metadata: "jsonb"  # {title, url, section, version}
          - source_url: "varchar(500)"
        indexes:
          - "ivfflat(embedding vector_cosine_ops)"  # Approximate nearest neighbor
          
      - name: "patterns"
        columns:
          - id: "uuid primary key"
          - error_signature: "varchar(255)"  # Hashed pattern
          - error_regex: "text"
          - solution_template: "text"
          - success_rate: "decimal(3,2)"
          - frequency: "integer"
          - last_occurred: "timestampz"
          - auto_apply_enabled: "boolean"
        indexes:
          - "btree(error_signature)"
          
  # ==========================================
  # OBSERVABILITY (The Three Pillars)
  # ==========================================
  observability:
    logging:
      structure: "structured_json"
      severity_levels: ["DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"]
      correlation_id: "uuid per request"
      fields:
        - "timestamp_iso"
        - "service_name"
        - "agent_id"
        - "ticket_id"
        - "trace_id"
        - "span_id"
        - "message"
        - "context_json"
        
    metrics:
      system: "Prometheus exposition format"
      port: 9090
      custom_metrics:
        - "tickets_processed_total"
        - "classification_accuracy_ratio"
        - "agent_decision_latency_seconds"
        - "healing_success_ratio"
        - "escalation_rate_ratio"
        
    tracing:
      provider: "OpenTelemetry"
      exporter: "console (for hackathon, OTLP in production)"
      sampling_rate: 1.0  # 100% for demo visibility
      
  # ==========================================
  # SECURITY ARCHITECTURE
  # ==========================================
  security:
    encryption:
      at_rest: "AES-256-GCM (via Supabase)"
      in_transit: "TLS 1.3"
      pii_masking: "regex_based (email, phone, credit_card)"
      
    access_control:
      model: "RBAC"
      roles:
        - "agent_system"  # Internal agents
        - "analyst_readonly"  # Human support read-only
        - "admin"  # Can approve high-risk actions
        
    audit_logging:
      table: "audit_logs"
      retention: "90 days (simulated)"
      
  # ==========================================
  # FRONTEND ARCHITECTURE
  # ==========================================
  frontend:
    framework: "React 18 (Strict Mode)"
    bundler: "Vite 5 (swc for speed)"
    styling: "Tailwind CSS 3.4"
    ui_library: "shadcn/ui (Radix primitives)"
    state_management: "TanStack Query (React Query) v5"
    routing: "TanStack Router"
    realtime: "SSE (EventSource API, no Socket.io)"
    visualization: "Recharts (analytics), @xyflow/react (agent graphs)"
    
    performance_targets:
      fcp: "<1.5s"
      lcp: "<2.5s"
      tti: "<3.5s"
      
  # ==========================================
  # DEPLOYMENT SPECIFICATION
  # ==========================================
  deployment:
    platform: "Vercel (frontend) + Railway/Render (backend)"
    container: "Docker (python:3.11-slim)"
    scaling: "Single instance (hackathon), horizontal pod autoscaler spec'd for production"
    
    environment_variables:
      required:
        - "DATABASE_URL (postgresql://...)"
        - "REDIS_URL"
        - "GEMINI_API_KEY"
        - "SUPABASE_SERVICE_KEY"
        - "JWT_SECRET"
      optional:
        - "SENTRY_DSN"
        - "LOG_LEVEL"
        
    health_checks:
      liveness: "/health/live (5s interval)"
      readiness: "/health/ready (checks DB connection)"
      
  # ==========================================
  # TESTING STRATEGY
  # ==========================================
  testing:
    unit: "pytest (coverage >80%)"
    integration: "TestClient (FastAPI), mocked LLM calls"
    e2e: "Playwright (golden path only, 2 critical flows)"
    load: "locust (100 concurrent users for 5 minutes)"
