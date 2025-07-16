
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, toggleWishlist, isInWishlist } = useAuth();
  const isWishlisted = isInWishlist(id || '');

  // Mock event data - in real app, fetch from API
  const event = {
    id: id || '1',
    title: 'Summer Music Festival 2024',
    description: 'Join us for an unforgettable night of music with top artists from around the world. This festival brings together diverse musical genres and creates an atmosphere of pure joy and celebration. Experience live performances, food trucks, art installations, and connect with fellow music lovers.',
    fullDescription: 'The Summer Music Festival 2024 is our biggest event yet, featuring over 20 artists across 3 stages. From indie rock to electronic dance music, jazz to hip-hop, there\'s something for everyone. The festival grounds will feature local food vendors, craft beer gardens, art installations from local artists, and interactive experiences. Come early to explore everything we have to offer!',
    date: '2024-08-15',
    time: '18:00',
    endTime: '23:00',
    location: 'Central Park, New York',
    address: '123 Park Avenue, New York, NY 10001',
    price: 89,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    category: 'Music',
    attendees: 1250,
    maxAttendees: 2000,
    organizer: {
      name: 'Music Events Co.',
      email: 'info@musicevents.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    ticketTypes: [
      { id: '1', name: 'General Admission', price: 89, description: 'Access to all stages and festival grounds' },
      { id: '2', name: 'VIP Pass', price: 199, description: 'Includes VIP area, complimentary drinks, and meet & greet' },
      { id: '3', name: 'Early Bird', price: 69, description: 'Limited time offer - save $20!', available: false }
    ],
    highlights: [
      '20+ Artists performing across 3 stages',
      'Local food vendors and craft beer',
      'Art installations and interactive experiences',
      'Free parking and shuttle service',
      'Family-friendly activities'
    ]
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add events to wishlist');
      return;
    }
    
    toggleWishlist({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      price: event.price,
      image: event.image
    });
    
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard');
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/book/${id}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {event.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleWishlist}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-sm">{event.time} - {event.endTime}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                    <p className="text-sm">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.attendees} attending
                    </p>
                    <p className="text-sm">{event.maxAttendees - event.attendees} spots left</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Organized by</p>
                    <p className="text-sm">{event.organizer.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {event.fullDescription}
                </p>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Event Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {event.organizer.name}
                    </h3>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${event.organizer.email}`} className="hover:text-blue-600">
                          {event.organizer.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${event.organizer.phone}`} className="hover:text-blue-600">
                          {event.organizer.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Tickets</span>
                    <Badge variant="outline">{event.maxAttendees - event.attendees} left</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ticket Types */}
                  <div className="space-y-3">
                    {event.ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`border rounded-lg p-4 ${
                          ticket.available === false
                            ? 'border-gray-200 bg-gray-50 opacity-60'
                            : 'border-gray-200 hover:border-blue-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                          <span className="text-lg font-bold text-blue-600">
                            ${ticket.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{ticket.description}</p>
                        {ticket.available === false && (
                          <p className="text-sm text-red-500 mt-1">Sold Out</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleBookNow} className="w-full py-6 text-lg">
                    Book Now
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Free cancellation up to 24 hours before the event
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
