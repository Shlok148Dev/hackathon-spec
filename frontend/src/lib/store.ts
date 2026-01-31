import { create } from 'zustand';
import { Ticket, AgentState, Decision } from '@/types';

interface AppState {
    tickets: Ticket[];
    selectedTicketId: string | null;
    agentStates: AgentState;
    decisions: Decision[];

    // Actions
    addTicket: (ticket: Ticket) => void;
    updateTicket: (ticket: Ticket) => void;
    setTickets: (tickets: Ticket[]) => void;
    setSelectedTicket: (id: string | null) => void;
    updateAgentState: <K extends keyof AgentState>(agent: K, state: AgentState[K]) => void;
    setSystemHealth: (health: number) => void;
    setQueueDepth: (depth: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    tickets: [],
    selectedTicketId: null,
    agentStates: {
        orchestrator: 'idle',
        diagnostician: 'idle',
        healer: 'idle',
        queueDepth: 0,
        systemHealth: 100
    },
    decisions: [],

    addTicket: (ticket) => set((state) => ({
        tickets: [ticket, ...state.tickets]
    })),

    updateTicket: (updatedTicket) => set((state) => ({
        tickets: state.tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
    })),

    setTickets: (tickets) => set({ tickets }),

    setSelectedTicket: (id) => set({ selectedTicketId: id }),

    updateAgentState: (agent, status) => set((state) => ({
        agentStates: { ...state.agentStates, [agent]: status }
    })),

    setSystemHealth: (health) => set((state) => ({
        agentStates: { ...state.agentStates, systemHealth: health }
    })),

    setQueueDepth: (depth) => set((state) => ({
        agentStates: { ...state.agentStates, queueDepth: depth }
    })),
}));
