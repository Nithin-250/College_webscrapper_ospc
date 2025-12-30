import { useQuery } from '@tanstack/react-query';
import { fetchApprovedEvents, fetchEventById } from '@/lib/supabase-helpers';

// Hook for fetching approved events (public)
export function useApprovedEvents() {
  return useQuery({
    queryKey: ['events', 'approved'],
    queryFn: fetchApprovedEvents,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for fetching single event
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => (id ? fetchEventById(id) : null),
    enabled: !!id,
  });
}
