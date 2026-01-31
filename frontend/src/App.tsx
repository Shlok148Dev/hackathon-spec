import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/routes/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900 text-white min-h-screen">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <pre className="mt-2 text-sm opacity-80 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
          <pre className="mt-2 text-xs opacity-60">See console for details.</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  console.log("App Mounting...");
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Dashboard />
          <Toaster theme="dark" position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
