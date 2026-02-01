import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Hypothesis } from '@/types';

interface DiagnosisResponse {
    classification: string;
    confidence: number;
    hypotheses: Hypothesis[];
    recommended_action: string;
    risk_level?: string;
    evidence?: string[];
}

export const useDiagnosis = (ticketId: string | null) => {
    return useQuery({
        queryKey: ['diagnosis', ticketId],
        queryFn: async () => {
            if (!ticketId) return null;
            // Note: Backend endpoint /api/v1/tickets/{id}/diagnosis
            const res = await api.get<DiagnosisResponse>(`/tickets/${ticketId}/diagnosis`);
            return res.data;
        },
        enabled: !!ticketId,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
};
