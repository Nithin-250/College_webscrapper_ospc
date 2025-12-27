import { Link } from "react-router-dom";
import {
  CalendarCheck,
  MapPin,
  Clock3,
  IndianRupee,
  Users,
  ArrowUpRight,
  Sparkle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { format, parseISO, isPast } from "date-fns";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = parseISO(event.start_date);
  const isPastEvent = isPast(startDate);
  const isFree = !event.fee || event.fee.toLowerCase() === "free" || event.fee === "0";

  return (
    <Card className="group relative overflow-hidden border border-[hsl(225_32%_24%/0.45)] bg-[hsl(226_46%_12%/0.75)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_-30px_hsl(225_84%_61%/0.65)]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,_hsl(225_84%_45%/0.45),_transparent_60%)]" />

      <CardContent className="relative z-10 flex flex-col gap-6 p-6">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(225_84%_61%/0.35)] bg-[hsl(226_52%_12%/0.55)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">
              <Sparkle className="h-3 w-3 text-accent" />
              {event.category || "Featured"}
            </div>
            <h3 className="font-heading text-xl leading-tight text-foreground drop-shadow-[0_8px_35px_hsl(225_84%_25%/0.55)] transition-colors group-hover:text-white">
              {event.name}
            </h3>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
              <Users className="h-3 w-3 text-primary" />
              {event.organizer}
            </div>
          </div>
          <Badge
            variant={isFree ? "default" : "secondary"}
            className={cn(
              "rounded-full border border-[hsl(225_84%_61%/0.35)] px-3 py-1 text-[11px] font-semibold uppercase",
              isFree ? "bg-[hsl(152_80%_44%)] text-[hsl(152_86%_8%)]" : "bg-[hsl(226_46%_18%/0.6)] text-accent"
            )}
          >
            {isFree ? "Free Entry" : event.fee}
          </Badge>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[hsl(226_32%_16%/0.6)]">
              <CalendarCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="leading-tight text-foreground">
              <p className={cn("font-medium", isPastEvent && "line-through opacity-60")}>{format(startDate, "EEE, MMM d, yyyy")}</p>
              {event.end_date && event.end_date !== event.start_date && (
                <p className="text-xs text-muted-foreground/80">until {format(parseISO(event.end_date), "MMM d, yyyy")}</p>
              )}
            </div>
          </div>

          {event.time && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[hsl(226_32%_16%/0.6)]">
                <Clock3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-foreground">{event.time}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[hsl(226_32%_16%/0.6)]">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <p className="text-foreground line-clamp-2">{event.venue}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[hsl(225_32%_24%/0.35)] pt-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground/70">
            <IndianRupee className="h-3 w-3 text-accent" />
            {isFree ? "Open community" : "Limited seats"}
          </div>
          <Button asChild size="sm" className="rounded-full bg-[hsl(226_46%_18%)] px-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:bg-[hsl(225_46%_28%)]">
            <Link to={`/event/${event.id}`} className="flex items-center gap-2">
              Learn More
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
