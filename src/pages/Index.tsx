import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/events/HeroSection";
import { EventFiltersComponent } from "@/components/events/EventFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { useApprovedEvents } from "@/hooks/useEvents";
import type { Event, EventFilters } from "@/types/event";
import { VIBRANCE_HIGHLIGHTS } from "@/data/vibrance";
import { cn } from "@/lib/utils";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays,
  isToday,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const Index = () => {
  const { data: events, isLoading } = useApprovedEvents();
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    category: "",
    feeType: "all",
    dateRange: "all",
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    (events ?? []).forEach((event) => {
      try {
        const startDate = parseISO(event.start_date);
        const endDate = event.end_date ? parseISO(event.end_date) : startDate;
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
          return;
        }

        let cursor = startDate;
        const finalDate = endDate < startDate ? startDate : endDate;
        while (cursor <= finalDate) {
          const key = format(cursor, "yyyy-MM-dd");
          const existing = map.get(key) ?? [];
          existing.push(event);
          map.set(key, existing);
          cursor = addDays(cursor, 1);
        }
      } catch (error) {
        // Ignore parsing errors for malformed dates
      }
    });
    return map;
  }, [events]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const goToPreviousMonth = () => setCurrentMonth((prev) => startOfMonth(subMonths(prev, 1)));
  const goToNextMonth = () => setCurrentMonth((prev) => startOfMonth(addMonths(prev, 1)));
  const goToToday = () => setCurrentMonth(startOfMonth(new Date()));

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(226_64%_6%)] text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(225_84%_12%/_0.7),_transparent_70%)]" />
          <section id="highlights" className="relative container py-12 md:py-16">
            <div className="aurora-section px-6 py-10 md:px-12 md:py-14 space-y-10">
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">Highlights</p>
                    <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground drop-shadow-[0_16px_45px_hsl(225_84%_35%/0.45)]">
                      Festival moments not to miss
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-[hsl(225_84%_61%/0.25)] bg-[hsl(226_46%_12%/0.55)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Vibrance 2026 Spotlight
                  </div>
                </div>
                <p className="max-w-3xl text-sm md:text-base text-muted-foreground/90">
                  Curated by the Open Source Programming Club, these capsules capture the energy of Vibrance 2026—from midnight showcases to grand finale spectacles. Tap into the culture driving campus life this season.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {VIBRANCE_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="aurora-card p-6 md:p-7 transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(226_46%_16%/0.65)]">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-heading text-lg text-foreground">{title}</h3>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground/85">{description}</p>
                  </div>
                ))}
              </div>

              <div className="aurora-divider" />

              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">Filter the atlas</p>
                    <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground drop-shadow-[0_12px_35px_hsl(225_84%_30%/0.4)]">
                      Tune the stream to match your vibe
                    </h3>
                  </div>
                  <p className="max-w-xl text-sm text-muted-foreground/85">
                    Search by organiser, focus on free gatherings, or zero in on upcoming dates. Clubs keep the sheet current, so your view always reflects the freshest happenings.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.65)] p-6 md:p-8 backdrop-blur-lg shadow-[0_25px_70px_-45px_hsl(225_84%_61%/0.75)]">
                  <EventFiltersComponent filters={filters} onFiltersChange={setFilters} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="relative container pb-16 md:pb-24">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,_transparent,_hsl(226_64%_6%))]" />
          <EventGrid events={events} isLoading={isLoading} filters={filters} />
        </section>

        <section
          id="calendar"
          className="relative container pb-16 md:pb-24 space-y-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
                Student planner
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground drop-shadow-[0_10px_35px_hsl(225_84%_30%/0.35)]">
                Plan your month at a glance
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.6)] text-muted-foreground transition hover:text-foreground"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="rounded-full border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.6)] px-4 py-2 text-sm font-semibold text-muted-foreground">
                <CalendarDays className="mr-2 inline h-4 w-4 text-accent" />
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.6)] text-muted-foreground transition hover:text-foreground"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="hidden sm:inline-flex rounded-full border border-[hsl(225_84%_61%/0.35)] bg-[hsl(225_84%_18%/0.6)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground transition hover:text-foreground"
              >
                Today
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_10%/0.55)] p-6 backdrop-blur-md space-y-6">
            <div className="grid grid-cols-7 gap-3 text-center text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              {weekdayLabels.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDate.get(dayKey) ?? [];
                const inCurrentMonth = isSameMonth(day, currentMonth);
                const isCurrentDay = isToday(day);
                const hasEvents = dayEvents.length > 0;
                const displayEvents = dayEvents.slice(0, 2);
                const remainingCount = Math.max(dayEvents.length - displayEvents.length, 0);

                return (
                  <div
                    key={dayKey}
                    className={cn(
                      "group relative flex h-32 flex-col gap-2 rounded-2xl border px-4 py-3 transition-all",
                      "border-[hsl(226_32%_22%/0.35)] bg-[hsl(226_46%_12%/0.55)]",
                      !inCurrentMonth && "opacity-40",
                      hasEvents && "border-[hsl(225_84%_61%/0.45)] shadow-[0_18px_45px_-35px_hsl(225_84%_61%/0.65)]",
                      isCurrentDay && "border-[hsl(16_92%_66%/0.6)] text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground/80">
                      <span className="font-heading text-lg text-foreground">{format(day, "d")}</span>
                      {hasEvents && (
                        <span className="rounded-full bg-[hsl(225_84%_61%/0.2)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[hsl(225_84%_71%)]">
                          {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 overflow-hidden text-sm">
                      {displayEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/event/${event.id}`}
                          className="block truncate rounded-xl border border-[hsl(226_32%_22%/0.45)] bg-[hsl(226_46%_16%/0.6)] px-3 py-2 text-xs text-muted-foreground/90 transition hover:text-foreground"
                        >
                          <span className="font-semibold text-foreground">{event.name}</span>
                          <span className="ml-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                            {event.organizer}
                          </span>
                        </Link>
                      ))}
                      {remainingCount > 0 && (
                        <span className="block text-[11px] text-muted-foreground/70">
                          +{remainingCount} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground/70">
              Dates and slots update as soon as clubs submit events. For additions or collaborations, reach out to the volunteers.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;