
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
  const { isAuthenticated, toggleWishlist, isInWishlist, events } = useAuth();
  const isWishlisted = isInWishlist(id || '');

  // Find the event from context
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
            <Button onClick={() => navigate('/')}>Back to Events</Button>
          </div>
        </div>
      </div>
    );
  }

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
    
    if (event.status === 'sold-out' || event.attendees >= event.maxAttendees) {
      toast.error('This event is sold out');
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

  const isSoldOut = event.status === 'sold-out' || event.attendees >= event.maxAttendees;

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
                    <p className="text-sm">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
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
                    <p className="text-sm">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Tickets</span>
                    <Badge variant="outline" className={isSoldOut ? 'text-red-600' : ''}>
                      {isSoldOut ? 'Sold Out' : `${event.maxAttendees - event.attendees} left`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${event.price}
                    </div>
                    <p className="text-sm text-gray-600">per ticket</p>
                  </div>

                  <Button 
                    onClick={handleBookNow} 
                    className="w-full py-6 text-lg"
                    disabled={isSoldOut}
                  >
                    {isSoldOut ? 'Sold Out' : 'Book Now'}
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
