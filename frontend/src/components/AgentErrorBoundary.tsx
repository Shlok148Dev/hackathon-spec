import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    errorType: 'reasoning' | 'network' | 'unknown' | null;
}

class AgentErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        errorType: null
    };

    public static getDerivedStateFromError(error: Error): State {
        if (error.message.toLowerCase().includes('diagnosis') || error.message.toLowerCase().includes('reasoning')) {
            return { hasError: true, errorType: 'reasoning' };
        }
        if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
            return { hasError: true, errorType: 'network' };
        }
        return { hasError: true, errorType: 'unknown' };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-slate-900 border border-red-500/50 rounded-lg animate-pulse">
                    <h3 className="text-red-400 font-mono text-sm uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Agent Cognitive Disruption
                    </h3>
                    <p className="text-slate-400 mt-2 text-xs font-mono">
                        {this.state.errorType === 'reasoning'
                            ? "AI reasoning temporarily unavailable - showing cached analysis"
                            : "Signal lost - attempting neural reconnect..."}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs uppercase tracking-wider border border-slate-700 transition-colors"
                    >
                        Re-establish Connection
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AgentErrorBoundary;
