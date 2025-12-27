export type EventStatus = 'pending' | 'approved' | 'rejected';
export type EventSourceType = 'scraper' | 'manual';

export interface Event {
  id: string;
  name: string;
  organizer: string;
  category: string;
  venue: string;
  start_date: string;
  end_date: string | null;
  deadline: string | null;
  time: string | null;
  fee: string;
  description: string | null;
  source_link: string | null;
  source_type: EventSourceType;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface EventFilters {
  search: string;
  category: string;
  feeType: 'all' | 'free' | 'paid';
  dateRange: 'all' | 'today' | 'this-week' | 'this-month';
}

export const EVENT_CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Competition',
  'Fest',
  'Guest Lecture',
  'Other',
] as const;
