import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, IndianRupee } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventDetailSkeleton } from "@/components/ui/skeleton-card";
import { useEvent } from "@/hooks/useEvents";
import { format, parseISO } from "date-fns";

export default function EventDetail() {
  const { id } = useParams();
  const { data: event, isLoading } = useEvent(id);

  const isFree = !event?.fee || event.fee.toLowerCase() === "free" || event.fee === "0";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Events</Link>
        </Button>

        {isLoading ? (
          <EventDetailSkeleton />
        ) : event ? (
          <div className="max-w-3xl animate-fade-in">
            <div className="space-y-4 mb-8">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">{event.name}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{event.category}</Badge>
                <Badge className={isFree ? "bg-success" : "bg-accent"}>{isFree ? "Free" : event.fee}</Badge>
              </div>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(parseISO(event.start_date), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>
                {event.time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p className="font-medium">{event.organizer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {event.description && (
              <div className="mb-8">
                <h2 className="font-heading text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

          </div>
        ) : (
          <p className="text-muted-foreground">Event not found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}