import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Ticket } from '@/types';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export const useTickets = () => {
    const setTickets = useAppStore(state => state.setTickets);

    const query = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await api.get<Ticket[]>('/tickets');
            return res.data; // Assuming backend returns [Ticket] directly or { data: [] }
        },
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (query.data) {
            // Only update if different? store handles it
            // We might want to merge with SSE... 
            // For now, let Query be source of truth for initial load/polling fallback
            setTickets(query.data);
        }
    }, [query.data, setTickets]);

    return query;
};
