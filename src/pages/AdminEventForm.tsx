import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEvent, useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { EVENT_CATEGORIES } from "@/types/event";

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAdmin, loading: authLoading } = useAuth();
  const { data: existingEvent, isLoading } = useEvent(id);
  const createEvent = useCreateEvent(token);
  const updateEvent = useUpdateEvent(token);
  const isEditing = !!id;

  const [form, setForm] = useState<{
    name: string; organizer: string; category: string; venue: string; start_date: string; end_date: string; deadline: string; time: string; fee: string; description: string; source_link: string; source_type: "manual" | "scraper"; status: "pending" | "approved" | "rejected";
  }>({
    name: "", organizer: "", category: "Technical", venue: "", start_date: "", end_date: "", deadline: "", time: "", fee: "Free", description: "", source_link: "", source_type: "manual", status: "pending",
  });

  useEffect(() => {
    if (existingEvent) {
      setForm({
        name: existingEvent.name, organizer: existingEvent.organizer, category: existingEvent.category, venue: existingEvent.venue,
        start_date: existingEvent.start_date, end_date: existingEvent.end_date || "", deadline: existingEvent.deadline || "",
        time: existingEvent.time || "", fee: existingEvent.fee, description: existingEvent.description || "",
        source_link: existingEvent.source_link || "", source_type: existingEvent.source_type, status: existingEvent.status,
      });
    }
  }, [existingEvent]);

  if (authLoading || isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!token || !isAdmin) { navigate("/auth"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { ...form, end_date: form.end_date || null, deadline: form.deadline || null, time: form.time || null, description: form.description || null, source_link: form.source_link || null };
    if (isEditing && id) {
      await updateEvent.mutateAsync({ id, updates: eventData });
    } else {
      await createEvent.mutateAsync(eventData);
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-2xl">
        <Button asChild variant="ghost" className="mb-6"><Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link></Button>
        <Card>
          <CardHeader><CardTitle className="font-heading">{isEditing ? "Edit Event" : "Add New Event"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Event Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><Label>Organizer *</Label><Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} required /></div>
                <div><Label>Category *</Label><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EVENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Venue *</Label><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required /></div>
                <div><Label>Fee</Label><Input value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="Free or ₹500" /></div>
                <div><Label>Start Date *</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required /></div>
                <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
                <div><Label>Time</Label><Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM - 5:00 PM" /></div>
                <div><Label>Registration Deadline</Label><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="md:col-span-2"><Label>Source Link</Label><Input type="url" value={form.source_link} onChange={(e) => setForm({ ...form, source_link: e.target.value })} placeholder="https://..." /></div>
              </div>
              <Button type="submit" className="w-full" disabled={createEvent.isPending || updateEvent.isPending}><Save className="h-4 w-4 mr-2" />{isEditing ? "Update Event" : "Create Event"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}