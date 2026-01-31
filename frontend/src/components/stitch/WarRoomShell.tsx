import React from 'react';
import {
    Terminal,
    Siren,
    Activity
} from 'lucide-react';
// import { cn } from '@/lib/utils';

export interface WarRoomShellProps {
    leftPanel?: React.ReactNode;
    centerPanel?: React.ReactNode;
    rightPanel?: React.ReactNode;
}

export const WarRoomShell: React.FC<WarRoomShellProps> = ({
    leftPanel,
    centerPanel,
    rightPanel
}) => {
    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-white">

            {/* HERMES Top Header (Screen 3 Design) */}
            <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                        <Terminal size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter text-emerald-500">HERMES</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-emerald-500/80">System Live</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest leading-none">Uptime</p>
                        <p className="text-xs font-mono font-bold text-white">420:12:44:09</p>
                    </div>
                    <button className="group flex h-10 items-center gap-2 rounded border border-red-500/50 bg-red-500/10 px-4 text-xs font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-500/20 active:scale-95">
                        <Siren size={16} className="group-hover:animate-bounce" />
                        STOP
                    </button>
                </div>
            </header>

            {/* Main Layout Area */}
            <main className="relative flex flex-1 overflow-hidden grid-bg">

                {/* Left Sidebar: Navigation / Ticket Stream */}
                <aside className="w-[320px] flex-col border-r border-slate-800 bg-slate-950/50 flex shrink-0">
                    <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Active Signals</p>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded">LIVE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                        {leftPanel || (
                            <div className="p-4 text-center text-slate-500 text-xs">Awaiting Global Uplink...</div>
                        )}
                    </div>
                </aside>

                {/* Center Panel: Visualization & Command */}
                <section className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
                    {centerPanel || (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-600 font-mono text-sm">NO SIGNAL ON MAIN SCREEN</p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Right Sidebar: Telemetry / Alerts */}
                <aside className="w-80 flex-col border-l border-slate-800 bg-slate-950/30 flex shrink-0">
                    {rightPanel || (
                        <div className="p-4">
                            <div className="p-4 border border-dashed border-slate-800 rounded bg-slate-900/20 text-center">
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Telemetry Offline</p>
                            </div>
                        </div>
                    )}
                </aside>

            </main>

            {/* Mobile Nav (Optional, handled via hidden classes for desktop-first design mandated by prompt) */}
        </div>
    );
};
