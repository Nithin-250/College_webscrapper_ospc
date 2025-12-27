import { useQuery } from '@tanstack/react-query';
import { fetchApprovedEvents, fetchEventById } from '@/lib/supabase-helpers';

// Hook for fetching approved events (public)
export function useApprovedEvents() {
  return useQuery({
    queryKey: ['events', 'approved'],
    queryFn: fetchApprovedEvents,
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
