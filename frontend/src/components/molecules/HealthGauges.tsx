import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/lib/store';
import { Activity } from 'lucide-react';

export const HealthGauges = () => {
    const health = useAppStore(state => state.agentStates.systemHealth);
    const queue = useAppStore(state => state.tickets.length); // Use actual length

    // Data for charts
    const healthData = [{ value: health, fill: '#10b981' }]; // Emerald-500
    const loadData = [{ value: Math.min(queue * 2, 100), fill: '#f59e0b' }]; // Amber-500 scaling

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* System Health */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center">
                <div className="h-20 w-20 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            barSize={6}
                            data={healthData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-lg font-bold text-slate-200">{health}%</span>
                    </div>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">Sys Health</span>
            </div>

            {/* Agent Load */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center">
                <div className="h-20 w-20 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="70%"
                            outerRadius="100%"
                            barSize={6}
                            data={loadData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">Agent Load</span>
            </div>
        </div>
    );
};
