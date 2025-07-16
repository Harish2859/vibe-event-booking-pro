
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ManageEvents = () => {
  const navigate = useNavigate();
  const { user, events, deleteEvent, getEventBookings } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showBookingsDialog, setShowBookingsDialog] = useState(false);

  // Get organizer's events
  const organizerEvents = events.filter(event => event.organizerId === user?.id);

  const getStatusBadge = (status: string, attendees: number, maxAttendees: number) => {
    if (attendees >= maxAttendees) {
      return <Badge className="bg-orange-100 text-orange-800">Sold Out</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully');
    }
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  const handleViewBookings = (eventId: string) => {
    setSelectedEvent(eventId);
    setShowBookingsDialog(true);
  };

  const eventBookings = selectedEvent ? getEventBookings(selectedEvent) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-2">View and manage all your events</p>
          </div>
          <Button asChild>
            <Link to="/organizer/create">Create New Event</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {organizerEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status, event.attendees, event.maxAttendees)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewEvent(event.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Event
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewBookings(event.id)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Bookings ({event.attendees})
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p>{event.date} at {event.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p>{event.location}</p>
                      </div>
                      <div>
                        <p className="font-medium">Attendees</p>
                        <p>{event.attendees}/{event.maxAttendees}</p>
                      </div>
                      <div>
                        <p className="font-medium">Earnings</p>
                        <p className="text-green-600 font-semibold">${event.earnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {organizerEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first event</p>
              <Button asChild>
                <Link to="/organizer/create">Create Event</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings Dialog */}
        <Dialog open={showBookingsDialog} onOpenChange={setShowBookingsDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Event Bookings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {eventBookings.length > 0 ? (
                <div className="space-y-3">
                  {eventBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{booking.userName}</p>
                        <p className="text-sm text-gray-600">
                          Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{booking.quantity} tickets</p>
                        <p className="text-sm text-green-600">${booking.totalPaid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings yet for this event</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageEvents;
