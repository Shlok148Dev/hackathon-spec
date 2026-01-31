import { useAppStore } from './store';

class SSEManager {
    private eventSource: EventSource | null = null;
    private reconnectAttempts = 0;
    private maxReconnect = 5;
    private url: string = '';

    connect(url: string) {
        this.url = url;
        // Close existing connection if any
        if (this.eventSource) {
            this.eventSource.close();
        }

        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
            console.log("SSE Connected");
            this.reconnectAttempts = 0;
        };

        this.eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                // Handle different event types if structure exists, else assume Ticket
                // For Hackathon, assuming loose protocol
                if (data.type === 'ticket_update') {
                    useAppStore.getState().updateTicket(data.payload);
                } else if (data.type === 'new_ticket') {
                    useAppStore.getState().addTicket(data.payload);
                } else if (data.id) {
                    // Assume ticket
                    useAppStore.getState().addTicket(data);
                }
            } catch (err) {
                console.error("SSE Parse Error", err);
            }
        };

        this.eventSource.onerror = () => {
            console.error("SSE Error");
            this.eventSource?.close();
            if (this.reconnectAttempts < this.maxReconnect) {
                const timeout = 2000 * Math.pow(1.5, this.reconnectAttempts);
                setTimeout(() => this.connect(this.url), timeout);
                this.reconnectAttempts++;
            }
        };
    }

    disconnect() {
        this.eventSource?.close();
        this.eventSource = null;
    }
}

export const sse = new SSEManager();
