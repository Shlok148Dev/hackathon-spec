import { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
// import { TicketStream } from '@/components/organisms/TicketStream';
// import { ReasoningTheater } from '@/components/organisms/ReasoningTheater';
// import { CommandCenter } from '@/components/organisms/CommandCenter';

export const Dashboard = () => {
    // const { data: tickets, isLoading, error } = useTickets();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    return (
        <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col items-center justify-center">
            <h1 className="text-4xl text-emerald-500 font-bold tracking-widest uppercase mb-4">Mission Control</h1>
            <div className="p-6 border border-slate-800 bg-slate-900/50 rounded-lg max-w-md text-center">
                <p className="text-slate-400 mb-2">Systems initializing...</p>
                <div className="flex gap-4 justify-center text-xs font-mono text-slate-500">
                    <span>ORCHESTRATOR: ONLINE</span>
                    <span>DIAGNOSTICIAN: ONLINE</span>
                </div>
                <div className="mt-8 text-left text-xs text-slate-600">
                    <p>Debug Status: Dashboard Shell Loaded.</p>
                    <p>Widgets (TicketStream, ReasoningTheater) disabled for safety check.</p>
                </div>
            </div>
            {/* 
            <div className="flex w-full h-full">
               <div className="w-[350px] flex-shrink-0">
                   <TicketStream />
               </div>
               <div className="flex-1 min-w-0">
                   <ReasoningTheater />
               </div>
               <div className="w-[300px] flex-shrink-0">
                   <CommandCenter />
               </div>
            </div> 
            */}
        </div>
    );
};
