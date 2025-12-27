import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Plus, Check, X, Pencil, Trash2, LogOut, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTableSkeleton } from "@/components/ui/skeleton-card";
import { useAuth } from "@/hooks/useAuth";
import { useAdminEvents, useApproveEvent, useRejectEvent, useDeleteEvent } from "@/hooks/useEvents";
import type { Event, EventStatus } from "@/types/event";
import { format, parseISO } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user, isAdmin, adminRole, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<EventStatus | "all">("pending");
  const handleTabChange = (value: string) => {
    if (value === "all" || value === "pending" || value === "approved" || value === "rejected") {
      setActiveTab(value);
    }
  };
  
  const { data: events, isLoading } = useAdminEvents(
    token,
    activeTab === "all" ? undefined : activeTab
  );
  const approveEvent = useApproveEvent(token);
  const rejectEvent = useRejectEvent(token);
  const deleteEvent = useDeleteEvent(token);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!token || !isAdmin) { navigate("/auth"); return null; }

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const statusCounts = {
    pending: events?.filter(e => e.status === "pending").length || 0,
    approved: events?.filter(e => e.status === "approved").length || 0,
    rejected: events?.filter(e => e.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold">Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{adminRole}</Badge>
            <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" />Logout</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-warning" /><span className="text-2xl font-bold">{statusCounts.pending}</span></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-success" /><span className="text-2xl font-bold">{statusCounts.approved}</span></div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive" /><span className="text-2xl font-bold">{statusCounts.rejected}</span></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Events</CardTitle>
            <Button asChild size="sm"><Link to="/admin/events/new"><Plus className="h-4 w-4 mr-2" />Add Event</Link></Button>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4"><TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="approved">Approved</TabsTrigger><TabsTrigger value="rejected">Rejected</TabsTrigger><TabsTrigger value="all">All</TabsTrigger></TabsList>
              <TabsContent value={activeTab}>
                {isLoading ? <AdminTableSkeleton /> : (
                  <div className="space-y-3">
                    {events?.length === 0 && <p className="text-center text-muted-foreground py-8">No events found.</p>}
                    {events?.map((event) => (
                      <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg bg-background">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.organizer} · {format(parseISO(event.start_date), "MMM d, yyyy")}</p>
                        </div>
                        <Badge variant={event.status === "approved" ? "default" : event.status === "rejected" ? "destructive" : "secondary"}>{event.status}</Badge>
                        <div className="flex gap-2">
                          {event.status === "pending" && (<><Button size="icon" variant="outline" className="text-success" onClick={() => approveEvent.mutate(event.id)}><Check className="h-4 w-4" /></Button><Button size="icon" variant="outline" className="text-destructive" onClick={() => rejectEvent.mutate(event.id)}><X className="h-4 w-4" /></Button></>)}
                          <Button size="icon" variant="outline" asChild><Link to={`/admin/events/${event.id}`}><Pencil className="h-4 w-4" /></Link></Button>
                          <AlertDialog><AlertDialogTrigger asChild><Button size="icon" variant="outline" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Event?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteEvent.mutate(event.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}