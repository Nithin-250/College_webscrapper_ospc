import Link from "next/link";
import { CalendarDays, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";

const formatDate = (iso: string) => {
  if (!iso) return "TBA";
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const EventCard = ({ event }: { event: Event }) => {
  const isFree = event.fee.toLowerCase().includes("free");

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 shadow-xl ring-1 ring-white/10 transition hover:-translate-y-1 hover:shadow-2xl hover:ring-indigo-400/40 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
          {event.category}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isFree ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-100"
          }`}
        >
          {isFree ? "Free" : event.fee}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-2xl font-semibold text-white">
          <Link href={`/events/${event._id}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden />
            {event.name}
          </Link>
        </h3>
        <p className="text-sm text-slate-200/80 line-clamp-3">{event.description}</p>
      </div>

      <dl className="mt-6 space-y-3 text-sm text-slate-200/80">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-indigo-300" />
          <dt className="sr-only">Dates</dt>
          <dd>
            {formatDate(event.startDate)} – {formatDate(event.endDate)}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-300" />
          <dt className="sr-only">Time</dt>
          <dd>{event.time || "TBA"}</dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-indigo-300" />
          <dt className="sr-only">Venue</dt>
          <dd>{event.venue}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-300" />
          <dt className="sr-only">Organizer</dt>
          <dd>{event.organizer}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-white/60">
          Deadline: {formatDate(event.deadline)}
        </span>
        <a
          href={event.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 transition hover:text-white"
        >
          Source
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default EventCard;
