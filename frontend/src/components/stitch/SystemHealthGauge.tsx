// Cleaned imports

export const SystemHealthGauge = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Stats Metric Row (Screen 3 Top) */}
            <div className="grid grid-cols-2 gap-3 p-4">
                <div className="flex flex-col gap-1 border border-slate-800 bg-slate-900/50 p-4 rounded-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Node Connectivity</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-white text-2xl font-bold tracking-tighter">98.2%</p>
                        <p className="text-emerald-500 text-[10px] font-bold uppercase">Nominal</p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 border border-slate-800 bg-slate-900/50 p-4 rounded-sm">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Neural Load</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-white text-2xl font-bold tracking-tighter">4.2 TF</p>
                        <p className="text-amber-500 text-[10px] font-bold uppercase">Peak</p>
                    </div>
                </div>
            </div>

            {/* Neural Latency Chart (Screen 3 Center) */}
            <div className="px-4 pb-4">
                <div className="border border-slate-800 bg-slate-900/30 p-4 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.1em]">Neural Latency</p>
                            <p className="text-white text-3xl font-bold font-mono">24<span className="text-sm ml-1 text-slate-500">ms</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-emerald-500 text-[11px] font-bold uppercase">Real-Time</p>
                            <p className="text-slate-500 text-[10px] font-mono">σ 1.2ms</p>
                        </div>
                    </div>
                    {/* SVG Chart from Stitch */}
                    <div className="h-32 w-full">
                        <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="latency_grad" x1="200" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b77f" stopOpacity="0.2" />
                                    <stop offset="1" stopColor="#10b77f" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0 80C20 75 40 20 60 25C80 30 100 90 120 85C140 80 160 40 180 35C200 30 220 70 240 75C260 80 280 10 300 15C320 20 340 100 360 95C380 90 400 40 420 45V120H0V80Z" fill="url(#latency_grad)" />
                            <path d="M0 80C20 75 40 20 60 25C80 30 100 90 120 85C140 80 160 40 180 35C200 30 220 70 240 75C260 80 280 10 300 15C320 20 340 100 360 95C380 90 400 40 420 45" stroke="#10b77f" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Hardware Monitor (Screen 3 Right Side - adapted for reuse) */}
            <div className="px-4 pb-4">
                <div className="p-4 border border-slate-800 bg-slate-900/20 rounded">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Hardware</p>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                <span>CPU Usage</span>
                                <span className="text-slate-100">67%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[67%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                <span>RAM Usage</span>
                                <span className="text-slate-100">12.4 GB</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[45%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
