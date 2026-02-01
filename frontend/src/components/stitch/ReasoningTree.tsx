import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReasoningStep {
    type: 'analysis' | 'decision' | 'action';
    title: string;
    description: string;
    confidence: number;
    timestamp: string;
}

interface ReasoningTreeProps {
    steps: ReasoningStep[];
    isLoading?: boolean;
}

export const ReasoningTree: React.FC<ReasoningTreeProps> = ({ steps, isLoading }) => {
    return (
        <div className="h-full flex flex-col p-4 bg-slate-950/20">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 text-emerald-500">
                <Brain className="size-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Cognitive Chain</h3>
                {isLoading && <span className="text-[10px] animate-pulse">Running diagnosis...</span>}
            </div>

            {/* Tree Steps */}
            <div className="space-y-0 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-3.5 top-2 bottom-6 w-px bg-gradient-to-b from-emerald-500/50 to-slate-800/20" />

                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative pl-10 pb-6 group"
                    >
                        {/* Dot Connector */}
                        <div className="absolute left-1.5 top-1 size-4 rounded-full border-2 border-slate-950 bg-slate-800 group-hover:bg-emerald-500 group-hover:border-emerald-900 transition-colors z-10 flex items-center justify-center">
                            {idx === steps.length - 1 ? (
                                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ) : (
                                <div className="size-1 rounded-full bg-slate-500" />
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-emerald-500/70">0{idx + 1}</span>
                                    <span className={cn(
                                        "text-[9px] font-bold px-1.5 py-px rounded uppercase",
                                        step.type === 'analysis' ? 'bg-blue-500/10 text-blue-400' :
                                            step.type === 'decision' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
                                    )}>
                                        {step.type}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">{step.confidence * 100}% CONF</span>
                            </div>

                            <h4 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                                {step.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed border-l-2 border-slate-800 pl-2 ml-0.5">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State / Loading Skeleton */}
            {steps.length === 0 && (
                <div className="text-center py-12 opacity-50">
                    <Search className="size-8 mx-auto text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Awaiting Analysis...</p>
                </div>
            )}
        </div>
    );
};
