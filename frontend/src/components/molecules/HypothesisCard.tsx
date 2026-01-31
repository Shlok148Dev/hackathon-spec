import { Hypothesis } from '@/types';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, FileText, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const HypothesisCard = ({ hypothesis, delay }: { hypothesis: Hypothesis; delay: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay * 0.15, type: 'spring' }}
        >
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className="bg-slate-900 border-slate-800 mb-3 hover:border-slate-700 transition-colors group">
                    <CardHeader className="p-3 pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={cn(
                                "text-[10px] tracking-wider",
                                hypothesis.confidence > 0.6 ? "text-emerald-400 border-emerald-900 bg-emerald-950/30" : "text-slate-400"
                            )}>
                                {hypothesis.category || "UNCERTAIN"}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500">{(hypothesis.confidence * 100).toFixed(0)}%</span>
                                <CollapsibleTrigger asChild>
                                    <button className="p-1 hover:bg-slate-800 rounded">
                                        <ChevronDown className={cn("w-3 h-3 text-slate-500 transition-transform", isOpen && "rotate-180")} />
                                    </button>
                                </CollapsibleTrigger>
                            </div>
                        </div>

                        <CardTitle className="text-sm font-medium text-slate-200 leading-tight flex gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            {hypothesis.description}
                        </CardTitle>

                        <div className="mt-3">
                            <Progress value={hypothesis.confidence * 100} className="h-1 bg-slate-800" indicatorClassName={
                                hypothesis.confidence > 0.7 ? "bg-emerald-500" :
                                    hypothesis.confidence > 0.3 ? "bg-amber-500" : "bg-slate-600"
                            } />
                        </div>
                    </CardHeader>

                    <CollapsibleContent>
                        <CardContent className="p-3 pt-0 text-xs text-slate-400 border-t border-slate-800/50 mt-2 bg-slate-950/30">
                            <div className="mt-2 space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Evidence</span>
                                {hypothesis.evidence && hypothesis.evidence.map((line, i) => (
                                    <div key={i} className="flex gap-2 items-start py-1">
                                        <FileText className="w-3 h-3 mt-0.5 text-slate-600 shrink-0" />
                                        <p className="leading-relaxed">{line}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        </motion.div>
    );
};
