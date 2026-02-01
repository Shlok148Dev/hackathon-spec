import { useState, useEffect } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useAppStore } from '@/lib/store';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Ticket } from '@/types';
import AgentErrorBoundary from '@/components/AgentErrorBoundary';

// System metrics type
interface SystemMetrics {
    neural_activity_percent: number;
    queue_depth: number;
    agents_active: number;
    tickets_per_minute: number;
    llm_latency_ms: number;
    awaiting_approval: number;
}

export const Dashboard = () => {
    // 1. Data Integration
    const { isLoading: isTicketsLoading } = useTickets();
    const tickets = useAppStore(state => state.tickets);
    const selectedTicketId = useAppStore(state => state.selectedTicketId);
    const setSelectedTicketId = useAppStore(state => state.setSelectedTicket);

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    const { data: diagnosis } = useDiagnosis(selectedTicketId);

    // Real-time system metrics
    const [metrics, setMetrics] = useState<SystemMetrics>({
        neural_activity_percent: 30,
        queue_depth: 0,
        agents_active: 0,
        tickets_per_minute: 0,
        llm_latency_ms: 0,
        awaiting_approval: 0
    });

    // Mock data for the brainwave chart
    const [chartData, setChartData] = useState<{ value: number }[]>([]);

    // Poll metrics every 3 seconds
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/v1/metrics');
                if (response.ok) {
                    const data = await response.json();
                    setMetrics(data);
                }
            } catch (error) {
                console.error('Metrics fetch failed:', error);
            }
        };

        fetchMetrics(); // Initial fetch
        const metricsInterval = setInterval(fetchMetrics, 3000);

        return () => clearInterval(metricsInterval);
    }, []);

    useEffect(() => {
        // Generate initial data
        const data = Array.from({ length: 40 }, (_, i) => ({
            value: 30 + Math.sin(i * 0.5) * 20 + Math.random() * 10
        }));
        setChartData(data);

        const interval = setInterval(() => {
            setChartData(prev => {
                const newData = [...prev.slice(1), { value: 30 + Math.sin(Date.now() * 0.005) * 20 + Math.random() * 10 }];
                return newData;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Helper for ticket colors based on priority/status
    const getTicketColor = (ticket: Ticket) => {
        if (ticket.priority >= 8) return 'red-500';
        if (ticket.priority >= 5) return 'orange-500';
        if (ticket.classification === 'API_ERROR') return 'red-500';
        if (ticket.classification === 'CONFIG_ERROR') return 'orange-500';
        return 'blue-500';
    };

    return (
        // ROOT CONTAINER: h-screen w-screen bg-[#020617] overflow-hidden
        <div className="h-screen w-screen bg-[#020617] overflow-hidden flex font-['Space_Grotesk'] text-slate-200 selection:bg-[#10b77f] selection:text-white">

            {/* === LEFT COLUMN (25% / 280px) - SIGNAL STREAM === */}
            <aside className="hidden w-80 flex-col border-r border-slate-800 bg-[#020617] lg:flex h-full shrink-0">
                <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Signal Stream</p>
                    <span className="text-[9px] font-mono text-[#10b77f]/60">NODE: TICKET_INTEL_v4</span>
                </div>

                {/* Scrollable List */}
                <AgentErrorBoundary>
                    <nav className="flex-1 space-y-2 p-2 overflow-y-auto scrollbar-hide">
                        {isTicketsLoading && tickets.length === 0 && (
                            <div className="p-4 text-center text-xs text-slate-500 animate-pulse">Scanning frequencies...</div>
                        )}
                        {tickets.map(ticket => {
                            const color = getTicketColor(ticket);
                            const isSelected = ticket.id === selectedTicketId;

                            return (
                                <article
                                    key={ticket.id}
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`group relative flex flex-col gap-2 rounded-sm border-l-4 border-l-${color} ${isSelected ? 'bg-slate-800' : 'bg-slate-900'} p-3 transition-all hover:-translate-y-0.5 hover:bg-slate-800 cursor-pointer shadow-lg`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-white truncate">{ticket.merchantName || 'Unknown Merchant'}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-${color}`}>{ticket.classification}</span>
                                            <span className="text-[9px] text-slate-500 font-mono">2m ago</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">{(ticket.rawText || '').substring(0, 100)}...</h3>
                                        <p className="text-[11px] text-slate-400 line-clamp-1">{ticket.id}</p>
                                    </div>
                                    <div className="mt-1">
                                        <div className="flex justify-between text-[8px] font-bold uppercase text-slate-500 mb-1">
                                            <span>AI Confidence</span>
                                            <span className={`text-${color}`}>
                                                {(ticket.confidence || 0) <= 1
                                                    ? Math.floor((ticket.confidence || 0) * 100)
                                                    : Math.floor(ticket.confidence || 0)}%
                                            </span>
                                        </div>
                                        <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full bg-${color}`} style={{ width: `${(ticket.confidence || 0) <= 1 ? (ticket.confidence || 0) * 100 : ticket.confidence}%` }}></div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </nav>
                </AgentErrorBoundary>
            </aside>

            {/* === CENTER COLUMN (50%) - NEURAL BRAIN + COGNITIVE FEED === */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#020617]/50 backdrop-blur-sm h-full overflow-hidden">

                {/* TOP SECTION (40%) - NEURAL BRAIN ACTIVITY */}
                <div className="h-[40%] shrink-0 flex flex-col border-b border-slate-800 overflow-hidden">
                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-px bg-slate-800 border-b border-slate-800">
                        <div className="flex min-w-[120px] flex-1 flex-col gap-1 p-4 bg-[#020617]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime</p>
                            <p className="text-xl font-bold text-white">99.98%</p>
                            <p className="text-xs font-medium text-[#10b77f] flex items-center gap-1">
                                +0.01%
                            </p>
                        </div>
                        <div className="flex min-w-[120px] flex-1 flex-col gap-1 p-4 bg-[#020617]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latency</p>
                            <p className="text-xl font-bold text-white">{metrics.llm_latency_ms}ms</p>
                            <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                                Gemini
                            </p>
                        </div>
                        <div className="flex min-w-[120px] flex-1 flex-col gap-1 p-4 bg-[#020617]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Throughput</p>
                            <p className="text-xl font-bold text-white">{metrics.tickets_per_minute}/min</p>
                            <p className="text-xs font-medium text-[#10b77f] flex items-center gap-1">
                                Ingestion
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-4 gap-4 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-slate-100 text-xs font-bold leading-normal tracking-[0.2em] uppercase border-l-2 border-[#10b77f] pl-3">Neural Brain Activity</h4>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-[#10b77f]/60">LIVE_STREAM_ID: 0x882A</span>
                            </div>
                        </div>

                        <div className="rounded border border-slate-800 bg-slate-900/40 p-4 h-[calc(100%-2rem)] backdrop-blur-sm relative flex flex-col">
                            <div className="flex items-end justify-between absolute top-4 left-4 right-4 z-10">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">AI Processing Load</p>
                                    <p className="text-white text-3xl lg:text-4xl font-bold tracking-tight">{metrics.neural_activity_percent.toFixed(1)}<span className="text-[#10b77f]/50 text-xl">%</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Status</p>
                                    <p className="text-sm font-bold text-[#10b77f]">OPTIMIZED</p>
                                </div>
                            </div>

                            {/* Recharts Area Chart */}
                            <div className="flex-1 mt-12 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b77f" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b77f" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#10b77f"
                                            strokeWidth={2}
                                            fill="url(#wave-gradient)"
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                                <p className="text-slate-500 text-[10px] font-bold">T-30s</p>
                                <p className="text-slate-500 text-[10px] font-bold">T-15s</p>
                                <p className="text-[#10b77f] text-[10px] font-bold">REALTIME</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION (60%) - LIVE COGNITIVE FEED */}
                <div className="h-[60%] flex-1 overflow-y-auto scrollbar-hide p-4 bg-[#020617]">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#020617] z-20 py-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#10b77f] animate-pulse"></span>
                            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase">Live Cognitive Feed</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">HYPOTHESIS_ENGINE_ACTIVE</span>
                    </div>

                    <AgentErrorBoundary>
                        {!diagnosis ? (
                            <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-widest">
                                {selectedTicket ? "Analyzing Data Streams..." : "Select a signal to begin analysis"}
                            </div>
                        ) : (
                            <div className="space-y-0 overflow-y-auto h-full pr-2">
                                {/* STEP 1: ORCHESTRATOR */}
                                <div className="relative pl-6 pb-6 border-l-2 border-emerald-500/30">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <div className="text-[10px] font-mono text-emerald-400 mb-1 uppercase tracking-wider">
                                        Orchestrator • {selectedTicket?.created_at ? new Date(selectedTicket.created_at).toLocaleTimeString() : 'Just now'}
                                    </div>
                                    <div className="text-sm text-slate-200 mb-1">
                                        Classified as <span className="font-semibold text-emerald-400">{diagnosis.classification}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Confidence: {(diagnosis.confidence * 100).toFixed(0)}% • Routed to Diagnostician
                                    </div>
                                </div>

                                {/* STEP 2: DIAGNOSTICIAN */}
                                <div className="relative pl-6 pb-6 border-l-2 border-purple-500/30">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    <div className="text-[10px] font-mono text-purple-400 mb-1 uppercase tracking-wider">
                                        Diagnostician • {['diagnosed', 'resolved'].includes(selectedTicket?.status || '') ? 'Diagnosis Complete' : 'Analyzing'}
                                    </div>
                                </div>

                                {/* Evidence */}
                                {diagnosis.evidence && diagnosis.evidence.length > 0 && (
                                    <div className="mb-3 p-2 bg-slate-900/50 rounded border border-slate-800 ml-6">
                                        <div className="text-[10px] text-slate-500 mb-1 uppercase">Evidence Gathered</div>
                                        {diagnosis.evidence.map((e: string, i: number) => (
                                            <div key={i} className="text-xs text-slate-400 pl-2 border-l border-slate-700 mb-1">
                                                {e}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Hypotheses */}
                                <div className="space-y-2 ml-6 mb-6">
                                    <div className="text-[10px] text-purple-400 font-mono mb-2 uppercase tracking-wider">Hypothesis Generation</div>
                                    {diagnosis.hypotheses?.map((h: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded border ${idx === 0
                                                ? 'border-purple-500/30 bg-purple-500/5'
                                                : 'border-slate-800 bg-slate-900/20'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-slate-400">H{idx + 1}: {h.category || 'Hypothesis'}</span>
                                                <span className={`text-xs font-bold ${h.confidence > 0.6 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {(h.confidence * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-200 leading-snug">{h.description}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* STEP 3: HEALER */}
                                <div className="relative pl-6 pb-4 border-l-2 border-slate-800">
                                    <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${selectedTicket?.status === 'resolved' ? 'bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
                                    <div className={`text-[10px] font-mono ${selectedTicket?.status === 'resolved' ? 'text-green-400' : 'text-amber-400'} mb-1 uppercase tracking-wider`}>
                                        {selectedTicket?.status === 'resolved' ? 'Healer • Fix Deployed' : 'Healer • Action Potential'}
                                    </div>
                                    <p className="text-sm font-medium text-slate-200">
                                        {selectedTicket?.status === 'resolved' ? 'Fix Deployed' : selectedTicket?.status === 'diagnosed' ? 'Action Proposed' : 'Standby'}
                                    </p>
                                    <div className="text-sm text-slate-200 mb-1">
                                        {selectedTicket?.status === 'resolved' ? (
                                            <>Action Executed: <span className="text-green-400 font-bold">{diagnosis.recommended_action}</span></>
                                        ) : (
                                            <>Proposed: <span className="text-amber-200">{diagnosis.recommended_action || 'Auto-fix recommendation pending'}</span></>
                                        )}
                                    </div>
                                    <div className={`text-xs ${selectedTicket?.status === 'resolved' ? 'text-green-500/80' : 'text-amber-500/80'} mb-2`}>
                                        {selectedTicket?.status === 'resolved' ? 'Risk Mitigated • System Self-Healed' : 'Risk Level: HIGH • Human approval required'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </AgentErrorBoundary>
                </div>
            </main >

            {/* === RIGHT COLUMN (25% / 300px) - ALERTS & TELEMETRY === */}
            < aside className="w-[300px] h-full border-l border-slate-800 bg-[#020617]/30 overflow-y-auto scrollbar-hide shrink-0 lg:flex flex-col hidden" >
                <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alert Center</p>
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">2 ACTIVE</span>
                    </div>

                    {/* Recommended Auto-Fix Card */}
                    <AgentErrorBoundary>
                        {selectedTicket && diagnosis && (
                            <div className="group relative overflow-hidden rounded border border-red-500/30 bg-red-500/5 p-4 transition-all hover:bg-red-500/10">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="material-symbols-outlined text-red-500 text-lg">shield</span>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xs font-bold text-white uppercase tracking-tight">RECOMMENDED AUTO-FIX</h3>
                                            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">HIGH RISK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-8 mb-4">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">PREDICTED IMPACT</p>
                                    <ul className="space-y-1">
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="text-slate-600">›</span> {diagnosis.recommended_action || "Automatic rollback"}
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="text-slate-600">›</span> Merchant notified via webhook
                                        </li>
                                        <li className="flex items-center gap-2 text-xs text-slate-300">
                                            <span className="text-slate-600">›</span> Audit log entry created
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-4">
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                        <p className="text-[10px] text-red-200 leading-tight">CAUTION: This action affects live transaction processing. Manual override enabled.</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            try {
                                                console.log('Rejecting fix for ticket:', selectedTicket.id);
                                                const response = await fetch(`/api/v1/decisions/${selectedTicket.id}/approve`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        approved: false,
                                                        approver_id: '00000000-0000-0000-0000-000000000000',
                                                        justification: 'Rejected via Mission Control'
                                                    })
                                                });

                                                if (response.ok) {
                                                    await response.json();
                                                    // Update ticket status in store
                                                    useAppStore.getState().updateTicket({
                                                        ...selectedTicket,
                                                        status: 'escalated'
                                                    });
                                                    alert('❌ Fix REJECTED. Ticket escalated to human support.');
                                                } else {
                                                    alert('❌ Rejection failed. Check console.');
                                                }
                                            } catch (error) {
                                                console.error('Rejection error:', error);
                                                alert('Network error during rejection.');
                                            }
                                        }}
                                        className="flex-1 py-2 rounded border border-slate-700 hover:bg-slate-800 text-[10px] font-bold uppercase text-slate-300 transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                console.log('Approving fix for ticket:', selectedTicket.id);
                                                const response = await fetch(`/api/v1/decisions/${selectedTicket.id}/approve`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        approved: true,
                                                        approver_id: '00000000-0000-0000-0000-000000000000',
                                                        justification: 'Approved via Mission Control'
                                                    })
                                                });

                                                if (response.ok) {
                                                    await response.json();
                                                    // Update ticket status in store
                                                    const updatedTicket = {
                                                        ...selectedTicket,
                                                        status: 'resolved' as const
                                                    };
                                                    useAppStore.getState().updateTicket(updatedTicket);

                                                    // Force update local selected ticket to reflect change immediately
                                                    // This keeps the feed visible but updates the Healer section
                                                    // (The parent component might need to re-render or we rely on store subscription)
                                                    alert('✅ Fix APPROVED! Deployed to merchant.');
                                                } else {
                                                    const errorData = await response.json();
                                                    console.error('Approval failed:', errorData);
                                                    alert('❌ Approval failed. Check console.');
                                                }
                                            } catch (error) {
                                                console.error('Approval error:', error);
                                                alert('Network error during approval.');
                                            }
                                        }}
                                        className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-[10px] font-bold uppercase text-white shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Approve Fix
                                    </button>
                                </div>
                            </div>
                        )}
                    </AgentErrorBoundary>

                    {!selectedTicket && (
                        <div className="p-4 rounded border border-slate-800 bg-slate-900/20 text-center">
                            <span className="material-symbols-outlined text-slate-600 text-2xl mb-2">shield</span>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">No Active Threats</p>
                        </div>
                    )}

                    {/* Agent Swarm Status - Shows multi-agent architecture */}
                    <div className="mt-4 border-t border-slate-800 pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Agent Swarm Status</p>

                        <div className="space-y-3">
                            {/* Orchestrator */}
                            <div className="rounded border border-slate-800 bg-slate-900/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${metrics.queue_depth > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                        <span className="text-xs font-bold text-slate-100">Orchestrator</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500">Flash</span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    {metrics.queue_depth > 0 ? `Processing ${metrics.queue_depth} tickets` : 'Idle - Queue empty'}
                                </p>
                            </div>

                            {/* Diagnostician */}
                            <div className="rounded border border-slate-800 bg-slate-900/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${metrics.agents_active >= 2 ? 'bg-purple-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                        <span className="text-xs font-bold text-slate-100">Diagnostician</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500">Pro</span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    {selectedTicket ? `Analyzing ${selectedTicket.classification}` : 'Awaiting ticket'}
                                </p>
                            </div>

                            {/* Healer */}
                            <div className="rounded border border-slate-800 bg-slate-900/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`size-2 rounded-full ${selectedTicket?.status === 'resolved' ? 'bg-green-500' : diagnosis ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                        <span className="text-xs font-bold text-slate-100">Healer</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500">Tools</span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    {selectedTicket?.status === 'resolved'
                                        ? 'Fix Deployed'
                                        : diagnosis
                                            ? 'Awaiting approval'
                                            : 'Standby'}
                                </p>
                            </div>
                        </div>

                        {/* Enhanced System Telemetry */}
                        <div className="mt-6 border-t border-slate-800 pt-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">System Telemetry</h3>

                            {/* Per-Agent Load Bars */}
                            <div className="space-y-3 mb-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-emerald-400">Orchestrator Load</span>
                                        <span className="text-slate-300">{Math.min(Math.round(metrics.queue_depth * 2.5), 100)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-700"
                                            style={{ width: `${Math.min(metrics.queue_depth * 2.5, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-purple-400">Diagnostician Active</span>
                                        <span className={metrics.agents_active >= 2 ? "text-purple-300" : "text-slate-600"}>
                                            {metrics.agents_active >= 2 ? "Analyzing" : "Idle"}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ${metrics.agents_active >= 2 ? "bg-purple-500" : "bg-slate-700"
                                                }`}
                                            style={{ width: metrics.agents_active >= 2 ? "75%" : "0%" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-amber-400">Healer Pending</span>
                                        <span className="text-slate-300">
                                            {/* We rely on API metrics, but for immediate feedback we can use local state if needed. 
                                                metrics.awaiting_approval comes from backend. If backend status update takes time, 
                                                this might lag. But let's assume metrics endpoint is polled. */}
                                            {metrics.awaiting_approval || 0} tasks
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 transition-all duration-700"
                                            style={{ width: `${Math.min((metrics.awaiting_approval || 0) * 33, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live Metrics Cards */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
                                    <div className="text-[10px] text-slate-500 uppercase">LLM Latency</div>
                                    <div className="text-lg font-mono text-slate-200">{metrics.llm_latency_ms || 850}ms</div>
                                    <div className="text-[10px] text-slate-600">Gemini API</div>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded p-2">
                                    <div className="text-[10px] text-slate-500 uppercase">Throughput</div>
                                    <div className="text-lg font-mono text-slate-200">{metrics.tickets_per_minute || 12}/min</div>
                                    <div className="text-[10px] text-slate-600">Ingestion rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside >

        </div >
    );
};
