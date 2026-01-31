import { useAppStore } from '@/lib/store';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { HypothesisCard } from '@/components/molecules/HypothesisCard';
import { AnimatePresence, motion } from 'framer-motion';
import { BrainCircuit, ScanLine, Activity, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ReasoningTheater = () => {
    const selectedId = useAppStore(state => state.selectedTicketId);
    const tickets = useAppStore(state => state.tickets);
    const selectedTicket = tickets.find(t => t.id === selectedId);

    const { data: diagnosis, isLoading, error } = useDiagnosis(selectedId);

    if (!selectedTicket) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                <BrainCircuit className="w-16 h-16 opacity-20" />
                <p className="text-sm font-mono uppercase tracking-widest">Awaiting Signal Selection</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-950/50">
            {/* Header */}
            <div className="h-12 border-b border-slate-800 flex items-center px-6 gap-3 shrink-0">
                <ScanLine className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase">
                    Stage 2: Investigation
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                        {selectedTicket.id.split('-')[0]}
                    </span>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Stage 1: Context */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-700" />
                            Observation Context
                        </h3>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                            <p className="text-lg font-light text-slate-200 leading-relaxed font-sans">
                                "{selectedTicket.rawText}"
                            </p>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">
                                    Merchant: {selectedTicket.merchantName || "Unknown"}
                                </span>
                                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">
                                    {/* Mock tier if missing */}
                                    Tier: Growth
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stage 2: Diagnosis */}
                    <div className="space-y-4 min-h-[300px]">
                        <h3 className="text-xs font-bold text-violet-500 uppercase flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" />
                            Agent Reasoning
                        </h3>

                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-24 w-full bg-slate-800/50" />
                                <Skeleton className="h-24 w-full bg-slate-900/30" />
                                <Skeleton className="h-24 w-full bg-slate-900/20" />
                                <div className="flex items-center gap-2 text-violet-400 text-xs animate-pulse justify-center mt-4">
                                    <Activity className="w-3 h-3" />
                                    <span>Constructing hypotheses from patterns...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-950/20 border border-red-900/50 p-4 rounded text-red-400 flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5" />
                                <div>
                                    <p className="text-sm font-bold">Cognition Error</p>
                                    <p className="text-xs opacity-70">Agent failed to generate diagnosis.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {diagnosis?.hypotheses?.map((h, i) => (
                                        <HypothesisCard key={i} hypothesis={h} delay={i} />
                                    ))}
                                </AnimatePresence>

                                {diagnosis?.recommended_action && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-6 border-t border-slate-800 pt-6"
                                    >
                                        <h3 className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2 mb-3">
                                            <Activity className="w-4 h-4" />
                                            Proposed Intervention
                                        </h3>
                                        <div className="bg-amber-950/10 border border-amber-900/30 p-4 rounded-lg text-amber-200/80 text-sm font-medium">
                                            {diagnosis.recommended_action}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
