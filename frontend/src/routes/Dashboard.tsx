import { useState, useEffect } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useAppStore } from '@/lib/store';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Ticket } from '@/types';

export const Dashboard = () => {
    // 1. Data Integration
    const { isLoading: isTicketsLoading } = useTickets();
    const tickets = useAppStore(state => state.tickets);
    const selectedTicketId = useAppStore(state => state.selectedTicketId);
    const setSelectedTicketId = useAppStore(state => state.setSelectedTicket);

    const selectedTicket = tickets.find(t => t.id === selectedTicketId);
    const { data: diagnosis } = useDiagnosis(selectedTicketId);

    // Mock data for the brainwave chart
    const [chartData, setChartData] = useState<{ value: number }[]>([]);

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
                                        <span className={`text-${color}`}>{Math.floor(ticket.confidence * 100)}%</span>
                                    </div>
                                    <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${color}`} style={{ width: `${ticket.confidence * 100}%` }}></div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </nav>
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
                            <p className="text-xl font-bold text-white">12ms</p>
                            <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                                -2ms
                            </p>
                        </div>
                        <div className="flex min-w-[120px] flex-1 flex-col gap-1 p-4 bg-[#020617]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Throughput</p>
                            <p className="text-xl font-bold text-white">4.2k/s</p>
                            <p className="text-xs font-medium text-[#10b77f] flex items-center gap-1">
                                +12%
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-4 gap-4 overflow-hidden relative">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-slate-100 text-xs font-bold leading-normal tracking-[0.2em] uppercase border-l-2 border-[#10b77f] pl-3">Neural Brain Activity</h4>
                            <span className="text-[10px] font-mono text-[#10b77f]/60">LIVE_STREAM_ID: 0x882A</span>
                        </div>

                        <div className="rounded border border-slate-800 bg-slate-900/40 p-4 h-[calc(100%-2rem)] backdrop-blur-sm relative flex flex-col">
                            <div className="flex items-end justify-between absolute top-4 left-4 right-4 z-10">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">AI Processing Load</p>
                                    <p className="text-white text-3xl lg:text-4xl font-bold tracking-tight">88.4<span className="text-[#10b77f]/50 text-xl">%</span></p>
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

                    <div className="space-y-4">
                        {diagnosis?.hypotheses?.map((hypothesis, idx) => (
                            <div key={idx} className="group relative flex flex-col gap-3 rounded border border-slate-800 bg-slate-900/20 p-4 transition-all hover:bg-slate-900/40">
                                <div className="absolute -left-[1px] top-4 h-8 w-0.5 bg-[#8b5cf6]"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs text-slate-500">0{idx + 1}</span>
                                        <span className="rounded bg-[#8b5cf6]/10 px-2 py-0.5 text-[10px] font-bold text-[#8b5cf6] uppercase">Analysis</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">{Math.floor(hypothesis.confidence * 100)}% MATCH</span>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-200">{hypothesis.description}</p>
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{hypothesis.evidence?.join('. ')}</p>
                                </div>

                                {/* Confidence Bar */}
                                <div className="mt-2 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                                    <div
                                        className="h-full bg-[#8b5cf6] transition-all duration-1000"
                                        style={{ width: `${hypothesis.confidence * 100}%` }}
                                    />
                                </div>
                            </div>
                        )) || (
                                <div className="text-center py-10 text-slate-600 font-mono text-xs uppercase tracking-widest">
                                    {selectedTicket ? "Analyzing Data Streams..." : "Select a signal to begin analysis"}
                                </div>
                            )}

                        {/* Terminal Activity Log (Simulated) */}
                        <div className="mt-8 rounded border border-slate-800 bg-black/40 p-4 font-mono text-[10px]">
                            <p className="text-slate-500 mb-1">[14:22:01] <span className="text-[#10b77f]">INFO:</span> Initializing HERMES sub-processor node_A12</p>
                            <p className="text-slate-500 mb-1">[14:22:02] <span className="text-[#8b5cf6]">ANALYSIS:</span> Hypothesis generation active...</p>
                            <p className="text-[#10b77f] animate-pulse">_</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* === RIGHT COLUMN (25% / 300px) - ALERTS & TELEMETRY === */}
            <aside className="w-[300px] h-full border-l border-slate-800 bg-[#020617]/30 overflow-y-auto scrollbar-hide shrink-0 lg:flex flex-col hidden">
                <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Alert Center</p>
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">2 ACTIVE</span>
                    </div>

                    {/* Recommended Auto-Fix Card */}
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
                                <button className="flex-1 py-2 rounded border border-slate-700 hover:bg-slate-800 text-[10px] font-bold uppercase text-slate-300 transition-colors">
                                    Reject
                                </button>
                                <button className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-[10px] font-bold uppercase text-white shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Approve Fix
                                </button>
                            </div>
                        </div>
                    )}

                    {!selectedTicket && (
                        <div className="p-4 rounded border border-slate-800 bg-slate-900/20 text-center">
                            <span className="material-symbols-outlined text-slate-600 text-2xl mb-2">shield</span>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">No Active Threats</p>
                        </div>
                    )}

                    {/* System Telemetry */}
                    <div className="mt-4 border-t border-slate-800 pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">System Telemetry</p>

                        {/* Node Topology Map (Simulated) */}
                        <div className="relative aspect-square w-full rounded border border-slate-800 bg-slate-900/50 flex items-center justify-center overflow-hidden mb-4">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                            <div className="relative size-full">
                                <span className="absolute top-1/4 left-1/3 size-2 rounded-full bg-[#10b77f] animate-ping"></span>
                                <span className="absolute top-1/4 left-1/3 size-2 rounded-full bg-[#10b77f]/60"></span>
                                <span className="absolute bottom-1/3 right-1/4 size-2 rounded-full bg-[#10b77f] animate-ping" style={{ animationDelay: '1s' }}></span>
                                <span className="absolute bottom-1/3 right-1/4 size-2 rounded-full bg-[#10b77f]/60"></span>
                            </div>
                            <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded bg-black/80 px-2 py-1 border border-slate-700">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Status</span>
                            </div>
                        </div>

                        {/* Gauges */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                    <span>CPU Usage</span>
                                    <span className="text-slate-100">67%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10b77f] w-[67%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                    <span>RAM Usage</span>
                                    <span className="text-slate-100">12.4 GB</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10b77f] w-[45%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

        </div>
    );
};
