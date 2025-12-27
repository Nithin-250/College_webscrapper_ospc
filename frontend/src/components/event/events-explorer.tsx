"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, CalendarRange, Filter } from "lucide-react";
import EventCard from "./event-card";
import EventCardSkeleton from "./event-card-skeleton";
import { fetchEvents, type EventFilters } from "@/lib/events";

const defaultFilters: EventFilters = {
  search: "",
  category: "",
  fee: "",
  startDate: "",
  endDate: "",
};

const categories = [
  "All",
  "Technology",
  "Workshops",
  "Sports",
  "Cultural",
  "Hackathon",
  "Research",
  "General",
];

const feeOptions = [
  { label: "All", value: "" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const formatDateInput = (value?: string) => value?.split("T")[0] || "";

const EventsExplorer = () => {
  const [filters, setFilters] = useState(defaultFilters);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["events", filters],
    queryFn: () =>
      fetchEvents({
        ...filters,
        search: filters.search?.trim() || undefined,
        category: filters.category && filters.category !== "All" ? filters.category : undefined,
        fee: filters.fee || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      }),
  });

  const onInputChange = (key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    refetch();
  };

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.search ||
          (filters.category && filters.category !== "All") ||
          filters.fee ||
          filters.startDate ||
          filters.endDate
      ),
    [filters]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="rounded-3xl border border-white/5 bg-white/5/30 p-6 shadow-2xl ring-1 ring-indigo-400/20 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex shrink grow items-center gap-3 rounded-full bg-white/10 px-4 py-2">
            <Search className="h-5 w-5 text-indigo-200" />
            <input
              value={filters.search}
              onChange={(e) => onInputChange("search", e.target.value)}
              placeholder="Search by event, organizer, or venue"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-white/80">
            <Filter className="h-4 w-4 text-indigo-200" />
            <select
              value={filters.category || "All"}
              onChange={(e) => onInputChange("category", e.target.value)}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.fee}
              onChange={(e) => onInputChange("fee", e.target.value)}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            >
              {feeOptions.map(({ label, value }) => (
                <option key={value || label} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-indigo-200" />
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">From</label>
              <input
                type="date"
                value={formatDateInput(filters.startDate)}
                onChange={(e) => onInputChange("startDate", e.target.value)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase tracking-wide text-white/60">To</label>
              <input
                type="date"
                value={formatDateInput(filters.endDate)}
                onChange={(e) => onInputChange("endDate", e.target.value)}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-indigo-400 hover:text-white"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reset
          </button>

          {isFetching && (
            <span className="ml-auto text-xs uppercase tracking-wide text-indigo-200">
              Refreshing events…
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <EventCardSkeleton key={index} />)
        ) : error ? (
          <div className="col-span-full rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-rose-100">
            <h3 className="text-lg font-semibold">Failed to load events</h3>
            <p className="mt-2 text-sm text-rose-100/80">
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
          </div>
        ) : data && data.length > 0 ? (
          data.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/5/40 p-10 text-center">
            <h3 className="text-2xl font-semibold text-white">No events match your filters yet.</h3>
            <p className="mt-2 text-sm text-white/70">
              Try adjusting the filters or check back soon—new events are being added constantly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsExplorer;
