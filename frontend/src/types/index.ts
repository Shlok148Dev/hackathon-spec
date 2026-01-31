export interface Hypothesis {
    id: number;
    description: string;
    confidence: number; // 0-1
    category: 'PLATFORM_BUG' | 'MIGRATION_ERROR' | 'CONFIG_ERROR' | 'DOCS_GAP';
    evidence: string[];
}

export interface Ticket {
    id: string;
    merchantId: string;
    merchantName?: string;
    merchantAvatar?: string;
    classification: 'API_ERROR' | 'CONFIG_ERROR' | 'WEBHOOK_FAIL' | 'CHECKOUT_BREAK' | 'DOCS_CONFUSION' | 'UNKNOWN';
    confidence: number;
    status: 'open' | 'analyzing' | 'resolved' | 'escalated' | 'diagnosed';
    priority: number; // 1-10
    rawText: string;
    createdAt: string;
    hypotheses?: Hypothesis[]; // From diagnosis
}

export interface AgentState {
    orchestrator: 'idle' | 'processing' | 'error';
    diagnostician: 'idle' | 'processing' | 'error';
    healer: 'idle' | 'processing' | 'awaiting_approval' | 'error';
    queueDepth: number;
    systemHealth: number; // 0-100
}

export interface Decision {
    id: string;
    ticketId: string;
    action: string;
    status: 'pending' | 'approved' | 'rejected';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
