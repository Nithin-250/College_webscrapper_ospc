import type { Event } from "@/types/event";
import type { ReadableEvent } from "@/types/local-events";

/**
 * Holds locally-sourced events when Supabase is unavailable.
 * Populated via a script (TODO: implement backend integration).
 */
export const localEvents: Event[] = [];

export const mapReadableToEvent = (row: ReadableEvent): Event => ({
  id: row.id,
  name: row.name,
  organizer: row.organizer,
  category: row.category,
  venue: row.venue,
  start_date: row.start_date,
  end_date: row.end_date,
  deadline: row.deadline,
  time: row.time,
  fee: row.fee,
  description: row.description,
  source_link: row.source_link,
  source_type: row.source_type,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
});
