import React from 'react';

import { ShieldAlert, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming global util exists

interface RiskAssessmentCardProps {
    title: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    impacts: string[];
    onApprove: () => void;
    onReject: () => void;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentCardProps> = ({
    title,
    riskLevel,
    impacts,
    onApprove,
    onReject
}) => {

    const isHighRisk = riskLevel === 'high' || riskLevel === 'critical';

    const riskColor = riskLevel === 'critical' ? 'bg-red-500' :
        riskLevel === 'high' ? 'bg-orange-500' :
            riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500';

    const borderColor = riskLevel === 'critical' ? 'border-red-500/50' :
        riskLevel === 'high' ? 'border-orange-500/50' :
            riskLevel === 'medium' ? 'border-yellow-500/50' : 'border-emerald-500/50';

    return (
        <div className={cn("rounded border bg-slate-900/50 overflow-hidden", borderColor)}>

            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                <div className="flex items-center gap-2">
                    <ShieldAlert className={cn("size-4",
                        riskLevel === 'critical' ? 'text-red-500' :
                            riskLevel === 'high' ? 'text-orange-500' : 'text-emerald-500'
                    )} />
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-200">{title}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-700 bg-slate-800">
                    <span className={cn("size-1.5 rounded-full animate-pulse", riskColor)} />
                    <span className="text-[9px] font-bold uppercase text-slate-300">{riskLevel} RISK</span>
                </div>
            </div>

            {/* Impact List */}
            <div className="p-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Predicted Impact</p>
                <ul className="space-y-2">
                    {impacts.map((impact, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="mt-0.5 text-slate-600">›</span>
                            {impact}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Warning for High Risk */}
            {isHighRisk && (
                <div className="mx-4 mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-2">
                    <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-200 leading-tight">
                        <strong>CAUTION:</strong> This action affects live transaction processing. Manual override enabled.
                    </p>
                </div>
            )}

            {/* Action Footer */}
            <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
                <button
                    onClick={onReject}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-400 transition-colors uppercase tracking-wide"
                >
                    <XCircle className="size-3.5" />
                    Reject
                </button>
                <button
                    onClick={onApprove}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded border text-xs font-bold text-white transition-all shadow-lg uppercase tracking-wide",
                        isHighRisk
                            ? "bg-red-600 border-red-500 hover:bg-red-500 shadow-red-900/20"
                            : "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 shadow-emerald-900/20"
                    )}
                >
                    <CheckCircle className="size-3.5" />
                    Approve Fix
                </button>
            </div>
        </div>
    );
};
