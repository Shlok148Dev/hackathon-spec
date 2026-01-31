import React from 'react';
import { motion } from 'framer-motion';
// Unused icons removed
import { cn } from '@/lib/utils';

import { Ticket } from '@/types'; // Use global type

export interface TicketCardProps {
    ticket: Ticket;
    isSelected?: boolean;
    onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, isSelected, onClick }) => {

    // Derived properties
    const title = ticket.rawText?.substring(0, 60) || "Untitled Ticket";
    const customerName = ticket.merchantName || "Unknown Merchant";


    // Derived visual states
    const isCritical = ticket.priority >= 9;
    const isHigh = ticket.priority >= 7 && ticket.priority < 9;
    const isMedium = ticket.priority >= 4 && ticket.priority < 7;

    const borderColor = isCritical ? 'border-red-600' :
        isHigh ? 'border-orange-500' :
            isMedium ? 'border-yellow-500' : 'border-emerald-500'; // Default low urgency

    const badgeColor = isCritical ? 'bg-red-500/10 text-red-500 border-red-500/20' :
        isHigh ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

    const confidenceValue = 92; // Mocking AI confidence per card for now, or derive from ticket metadata

    return (
        <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ x: 4, backgroundColor: 'rgba(30, 41, 59, 0.8)' }} // slate-800/80
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={cn(
                "group relative flex items-center gap-3 border-l-4 p-3 mb-2 cursor-pointer transition-all duration-200 shadow-lg",
                "bg-slate-900",
                borderColor,
                isSelected ? "bg-slate-800 ring-1 ring-slate-700" : "hover:bg-slate-800/50"
            )}
        >
            {/* New Pulse Indicator */}
            {ticket.status === 'open' && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                </div>
            )}

            {/* Avatar / Merchant Icon */}
            <div className="shrink-0 size-10 rounded-sm overflow-hidden border border-slate-700 flex items-center justify-center bg-slate-800">
                <span className="font-bold text-slate-500 text-xs">
                    {customerName[0] || "#"}
                </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 border uppercase", badgeColor)}>
                        {isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL'}
                    </span>
                    <span className="text-[9px] font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 border border-slate-700 uppercase">
                        AI_TRIAGE
                    </span>
                </div>
                <h3 className="text-xs font-semibold text-white truncate leading-tight">
                    {title}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 uppercase tracking-wide">
                    Merchant: {customerName}
                </p>
            </div>

            {/* Confidence Ring (SVG from Stitch) */}
            <div className="shrink-0 flex flex-col items-center justify-center">
                <div className="relative size-8 flex items-center justify-center">
                    <svg className="size-full -rotate-90">
                        <circle className="text-slate-800" cx="16" cy="16" fill="transparent" r="14" stroke="currentColor" strokeWidth="2"></circle>
                        <circle
                            className={isCritical ? "text-red-500" : "text-emerald-500"}
                            cx="16" cy="16" fill="transparent" r="14"
                            stroke="currentColor"
                            strokeDasharray="88"
                            strokeDashoffset={88 - (88 * (confidenceValue / 100))}
                            strokeWidth="2"
                        ></circle>
                    </svg>
                    <span className="absolute text-[8px] font-bold font-mono text-white">
                        {confidenceValue}%
                    </span>
                </div>
            </div>

        </motion.div>
    );
};
