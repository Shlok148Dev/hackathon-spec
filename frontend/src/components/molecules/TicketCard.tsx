import { Ticket } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface TicketCardProps {
    ticket: Ticket;
    isSelected: boolean;
    onClick: () => void;
    style?: React.CSSProperties; // For react-window
}

export const TicketCard = ({ ticket, isSelected, onClick, style }: TicketCardProps) => {
    const urgencyColor = ticket.priority >= 9 ? 'bg-red-500' :
        ticket.priority >= 7 ? 'bg-orange-500' :
            ticket.priority >= 4 ? 'bg-yellow-500' : 'bg-blue-500';

    return (
        <motion.div
            layoutId={`ticket-${ticket.id}`}
            style={style}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-3 border-b border-slate-800/50 cursor-pointer h-[80px] w-full bg-slate-950 hover:bg-slate-900/50 transition-colors",
                isSelected && "border-l-4 border-l-emerald-500 bg-slate-900/80"
            )}
        >
            {/* Urgency Indicator */}
            <div className={cn("w-1 h-12 rounded-full", urgencyColor)} />

            {/* Avatar */}
            <Avatar className="h-10 w-10 border border-slate-700">
                <AvatarImage src={ticket.merchantAvatar} />
                <AvatarFallback className="bg-slate-800 text-slate-400">
                    {ticket.merchantName?.substring(0, 2).toUpperCase() || "ME"}
                </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h3 className={cn("text-sm font-medium truncate text-slate-200", isSelected && "text-emerald-400")}>
                        {ticket.rawText}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Badge variant="outline" className="text-[10px] bg-slate-900 border-slate-700 text-slate-400 h-5 px-1.5 uppercase tracking-wider">
                        {ticket.classification || "PENDING"}
                    </Badge>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2m ago
                    </span>
                </div>
            </div>

            {/* Confidence Ring */}
            <div className="w-9 h-9">
                <CircularProgressbar
                    value={(ticket.confidence || 0) * 100}
                    text={`${Math.round((ticket.confidence || 0) * 100)}%`}
                    styles={buildStyles({
                        textSize: '28px',
                        textColor: isSelected ? '#34d399' : '#94a3b8',
                        pathColor: isSelected ? '#34d399' : '#475569',
                        trailColor: '#1e293b',
                    })}
                />
            </div>
        </motion.div>
    );
};
