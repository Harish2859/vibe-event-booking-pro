import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, MapPin, Clock, Ticket, Heart, User, Mail, Edit3, Save, X } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, bookings, wishlist, cancelBooking, toggleWishlist, updateProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    toast.success('Booking cancelled successfully');
  };

  const handleRemoveFromWishlist = (eventId: string) => {
    const eventToRemove = wishlist.find(item => item.id === eventId);
    if (eventToRemove) {
      toggleWishlist(eventToRemove);
      toast.success('Event removed from wishlist');
    }
  };

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setIsEditingProfile(false);
    toast.success('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Manage your bookings and discover new events</p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Bookings</h2>
              <Badge variant="secondary">{bookings.length} bookings</Badge>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Ticket className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">Start exploring events and make your first booking!</p>
                  <Button onClick={() => navigate('/')}>Browse Events</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={booking.image}
                          alt={booking.eventTitle}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{booking.eventTitle}</h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{booking.eventDate} at {booking.eventTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{booking.location}</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={booking.status === 'confirmed' ? 'default' : 'destructive'}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Booking ID</p>
                              <p className="font-medium">{booking.bookingId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Tickets</p>
                              <p className="font-medium">{booking.quantity}x {booking.ticketType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="font-medium">${booking.totalPaid}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Booking Date</p>
                              <p className="font-medium">{booking.bookingDate}</p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/ticket/${booking.id}`)}
                            >
                              View Ticket
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Wishlist</h2>
              <Badge variant="secondary">{wishlist.length} events</Badge>
            </div>

            {wishlist.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events in wishlist</h3>
                  <p className="text-gray-600 mb-4">Save events you're interested in to your wishlist!</p>
                  <Button onClick={() => navigate('/')}>Browse Events</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFromWishlist(event.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">${event.price}</span>
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/event/${event.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditingProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="outline" className="mt-2">
                      {user.role === 'user' ? 'Event Attendee' : 'Event Organizer'}
                    </Badge>
                  </div>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email Address</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Wishlist Items</p>
                        <p className="text-2xl font-bold text-purple-600">{wishlist.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      
    </div>
  );
};

export default UserDashboard;
