import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { HealthGauges } from '@/components/molecules/HealthGauges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertOctagon } from 'lucide-react';

export const CommandCenter = () => {
    const selectedId = useAppStore(state => state.selectedTicketId);
    const { data: diagnosis } = useDiagnosis(selectedId);

    const handleApprove = () => {
        // Mock action
        // In real app: mutate api.post
        toast.success("Action Approved", {
            description: "Patches deployed to staging environment."
        });
    };

    return (
        <div className="h-full bg-slate-950 border-l border-slate-800 flex flex-col">
            {/* Header */}
            <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-950/50 backdrop-blur-sm">
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Command Center</span>
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-950/20">ONLINE</Badge>
            </div>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                <HealthGauges />

                {/* Approval Queue */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                    <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        Approval Queue
                        <span className="bg-slate-800 text-slate-400 px-1.5 rounded-full text-[10px]">{diagnosis?.recommended_action ? 1 : 0}</span>
                    </h3>

                    {diagnosis?.recommended_action ? (
                        <Card className="bg-slate-900 border-amber-500/50 border-l-4 border-l-amber-500 shadow-lg shadow-amber-900/10">
                            <CardHeader className="p-3 pb-2">
                                <CardTitle className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4 text-amber-500" />
                                    Action Required
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <p className="text-xs text-slate-400 mb-3">{diagnosis.recommended_action}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        size="sm"
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none h-8 text-xs font-bold"
                                        onClick={handleApprove}
                                    >
                                        APPROVE
                                    </Button>
                                    <Button size="sm" variant="outline" className="w-full text-slate-400 border-slate-700 h-8 text-xs bg-transparent">
                                        REJECT
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center py-8 text-slate-600 text-xs italic">
                            No pending actions.
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Daily Metrics</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-400">Autonomy Rate</span>
                            <span className="text-sm font-mono text-emerald-400">88.5%</span>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded border border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-400">Avg Resolution</span>
                            <span className="text-sm font-mono text-slate-200">2m 14s</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
