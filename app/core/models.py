from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Enum, Numeric, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.ext.declarative import declared_attr
import uuid
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_id = Column(String(255), unique=True, nullable=False)
    tier = Column(Enum("free", "growth", "enterprise", name="merchant_tier"), nullable=False)
    migration_stage = Column(Enum("not_started", "in_progress", "completed", "rollback", name="migration_stage"), nullable=False)
    config_json = Column(JSONB, default={})
    health_score = Column(Numeric(3, 2), default=1.00)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tickets = relationship("Ticket", back_populates="merchant")

    __table_args__ = (
        Index("ix_merchants_config_json", config_json, postgresql_using="gin"),
    )

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    merchant_id = Column(UUID(as_uuid=True), ForeignKey("merchants.id"), nullable=False)
    channel = Column(Enum("email", "chat", "api", "auto_detected", name="ticket_channel"), nullable=False)
    raw_text = Column(Text, nullable=False)
    processed_text = Column(Text)
    classification = Column(String(50))
    classification_confidence = Column(Numeric(3, 2))
    priority = Column(Integer)
    status = Column(String(20), default="open")
    assigned_agent = Column(Enum("orchestrator", "human", "pending", name="agent_assignment"), default="pending")
    root_cause = Column(Text)
    resolution_action = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

    merchant = relationship("Merchant", back_populates="tickets")
    decisions = relationship("AgentDecision", back_populates="ticket")

class AgentDecision(Base):
    __tablename__ = "agent_decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))
    agent_id = Column(String(50), nullable=False)
    reasoning_chain = Column(JSONB)
    proposed_action = Column(JSONB)
    action_type = Column(Enum("auto_executed", "human_approved", "rejected", "escalated", name="action_type"))
    risk_level = Column(Enum("low", "medium", "high", "critical", name="risk_level"))
    executed_at = Column(DateTime(timezone=True))
    executed_by = Column(String(50))
    rollback_available_until = Column(DateTime(timezone=True))
    outcome_verified = Column(Boolean)

    ticket = relationship("Ticket", back_populates="decisions")

class DocumentationChunk(Base):
    __tablename__ = "documentation_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(768))
    metadata_json = Column(JSONB)
    source_url = Column(String(500))

class Pattern(Base):
    __tablename__ = "patterns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    error_signature = Column(String(255), index=True)
    error_regex = Column(Text)
    solution_template = Column(Text)
    success_rate = Column(Numeric(3, 2))
    frequency = Column(Integer, default=0)
    last_occurred = Column(DateTime(timezone=True))
    auto_apply_enabled = Column(Boolean, default=False)
