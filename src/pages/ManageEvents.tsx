
import { useState } from 'react';
import { Link } from 'react-router-dom';
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

const ManageEvents = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Summer Music Festival',
      date: '2024-08-15',
      time: '7:00 PM',
      location: 'Central Park, New York',
      price: 75,
      attendees: 250,
      maxAttendees: 500,
      status: 'active',
      earnings: 18750,
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '2',
      title: 'Tech Conference 2024',
      date: '2024-09-20',
      time: '9:00 AM',
      location: 'Convention Center, San Francisco',
      price: 50,
      attendees: 180,
      maxAttendees: 300,
      status: 'active',
      earnings: 9000,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '3',
      title: 'Food & Wine Expo',
      date: '2024-07-10',
      time: '6:00 PM',
      location: 'Downtown Hotel, Chicago',
      price: 40,
      attendees: 320,
      maxAttendees: 320,
      status: 'sold-out',
      earnings: 12800,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'sold-out':
        return <Badge className="bg-orange-100 text-orange-800">Sold Out</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

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
          {events.map((event) => (
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
                        {getStatusBadge(event.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Event
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              View Bookings
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

        {events.length === 0 && (
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
      </div>
    </div>
  );
};

export default ManageEvents;
