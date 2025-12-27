import { CalendarX } from "lucide-react";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "@/components/ui/skeleton-card";
import type { Event, EventFilters } from "@/types/event";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";
import { useMemo } from "react";

interface EventGridProps {
  events: Event[] | undefined;
  isLoading: boolean;
  filters: EventFilters;
}

export function EventGrid({ events, isLoading, filters }: EventGridProps) {
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          event.name.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower) ||
          event.venue.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && event.category !== filters.category) {
        return false;
      }

      // Fee type filter
      if (filters.feeType !== "all") {
        const isFree =
          !event.fee ||
          event.fee.toLowerCase() === "free" ||
          event.fee === "0";
        if (filters.feeType === "free" && !isFree) return false;
        if (filters.feeType === "paid" && isFree) return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const eventDate = parseISO(event.start_date);
        if (filters.dateRange === "today" && !isToday(eventDate)) return false;
        if (filters.dateRange === "this-week" && !isThisWeek(eventDate))
          return false;
        if (filters.dateRange === "this-month" && !isThisMonth(eventDate))
          return false;
      }

      return true;
    });
  }, [events, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <section id="events" className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">Open Source Programming Club</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground drop-shadow-[0_10px_35px_hsl(225_84%_30%/0.45)]">
            Upcoming & signature experiences
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg">
          Showing {filteredEvents.length} curated events based on your filters. OSPC volunteers sync new entries from the VIT Event Hub sheet every few minutes.
        </p>
      </div>

      {!filteredEvents.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.6)] py-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(226_46%_16%/0.85)]">
            <CalendarX className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">No events match your filters</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {events?.length
              ? "Adjust the filters above to reveal more opportunities happening across campus."
              : "Keep an eye here—new events drop soon once they are confirmed by the organizing clubs and departments."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-3xl border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.55)] px-6 py-4 text-sm text-muted-foreground/85">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[hsl(225_44%_18%/0.7)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                OSPC LIVE FEED
              </span>
              <span>
                Latest update {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}. OSPC curators publish additions instantly so the campus can plug in within moments.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
