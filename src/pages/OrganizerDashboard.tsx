import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Settings,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock
} from 'lucide-react';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { user, events, getOrganizerStats, getEventBookings, deleteEvent } = useAuth();

  if (!user || user.role !== 'organizer') {
    navigate('/login');
    return null;
  }

  const stats = getOrganizerStats();
  const organizerEvents = events.filter(event => event.organizerId === user.id);

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button onClick={() => navigate('/organizer/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeEvents} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTicketsSold}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all events
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                  <p className="text-xs text-muted-foreground">
                    Revenue generated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.totalEvents > 0 ? Math.round(stats.totalEarnings / stats.totalEvents) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per event
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Events</CardTitle>
                <Button variant="outline" onClick={() => navigate('/organizer/events')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {organizerEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first event</p>
                    <Button onClick={() => navigate('/organizer/create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {organizerEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.attendees}/{event.maxAttendees}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={event.status === 'active' ? 'default' : event.status === 'sold-out' ? 'secondary' : 'destructive'}>
                            {event.status}
                          </Badge>
                          <span className="font-semibold text-green-600">${event.earnings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Events</h2>
              <Button onClick={() => navigate('/organizer/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </div>

            {organizerEvents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
                  <p className="text-gray-600 mb-4">Start organizing events and reach your audience</p>
                  <Button onClick={() => navigate('/organizer/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {organizerEvents.map((event) => {
                  const eventBookings = getEventBookings(event.id);
                  const fillPercentage = Math.round((event.attendees / event.maxAttendees) * 100);

                  return (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{event.date} at {event.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant={event.status === 'active' ? 'default' : event.status === 'sold-out' ? 'secondary' : 'destructive'}>
                                {event.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Attendees</p>
                                <p className="font-medium">{event.attendees}/{event.maxAttendees}</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full" 
                                    style={{ width: `${fillPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Earnings</p>
                                <p className="font-medium text-green-600">${event.earnings}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="font-medium">${event.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Bookings</p>
                                <p className="font-medium">{eventBookings.length}</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/event/${event.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate('/organizer/events')}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Event Analytics</h2>
            
            <div className="grid gap-6">
              {organizerEvents.map((event) => {
                const eventBookings = getEventBookings(event.id);
                const totalRevenue = event.earnings;
                const averageTicketPrice = event.attendees > 0 ? totalRevenue / event.attendees : 0;

                return (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{event.title}</span>
                        <Badge variant="outline">{event.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{event.attendees}</div>
                          <div className="text-sm text-gray-600">Total Attendees</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
                          <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{eventBookings.length}</div>
                          <div className="text-sm text-gray-600">Total Bookings</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">${Math.round(averageTicketPrice)}</div>
                          <div className="text-sm text-gray-600">Avg. Revenue/Attendee</div>
                        </div>
                      </div>

                      {eventBookings.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Recent Bookings</h4>
                          <div className="space-y-2">
                            {eventBookings.slice(0, 3).map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <span className="font-medium">{booking.userName}</span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${booking.totalPaid}</div>
                                  <div className="text-sm text-gray-600">{booking.bookingDate}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ChatBot />
    </div>
  );
};

export default OrganizerDashboard;
