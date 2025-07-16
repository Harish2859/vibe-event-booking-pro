
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, User, Download, Share } from 'lucide-react';

const ViewTicket = () => {
  const { id } = useParams();

  // Mock ticket data - in real app, fetch by id
  const ticket = {
    id: id,
    bookingId: 'BK001234567',
    event: {
      title: 'Summer Music Festival',
      date: '2024-08-15',
      time: '7:00 PM',
      location: 'Central Park, New York',
      organizer: 'Music Events Co.'
    },
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    ticketType: 'General Admission',
    quantity: 2,
    totalPaid: 150,
    purchaseDate: '2024-07-20',
    status: 'confirmed'
  };

  const handleDownload = () => {
    // In real app, generate and download PDF
    console.log('Downloading ticket PDF...');
  };

  const handleShare = () => {
    // In real app, implement sharing functionality
    console.log('Sharing ticket...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Ticket</h1>
          <p className="text-gray-600 mt-2">Booking ID: {ticket.bookingId}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ticket Details */}
          <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader className="text-center border-b border-blue-200">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{ticket.event.title}</CardTitle>
              <Badge className="mx-auto bg-green-100 text-green-800">
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">{ticket.event.date}</p>
                  <p className="text-sm text-gray-600">Event Date</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">{ticket.event.time}</p>
                  <p className="text-sm text-gray-600">Start Time</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">{ticket.event.location}</p>
                  <p className="text-sm text-gray-600">Venue</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold">{ticket.user.name}</p>
                  <p className="text-sm text-gray-600">Ticket Holder</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Ticket Type:</span>
                  <span className="font-semibold">{ticket.ticketType}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="font-semibold">{ticket.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Paid:</span>
                  <span className="font-semibold text-green-600">${ticket.totalPaid}</span>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="text-center pt-4 border-t">
                <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded mb-2 mx-auto"></div>
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Show this QR code at the venue</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Ticket
                </Button>
                <Button onClick={handleShare} variant="outline" className="w-full">
                  <Share className="mr-2 h-4 w-4" />
                  Share Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Arrival Instructions:</p>
                  <p className="text-gray-600">Please arrive 30 minutes before the event starts. Present your ticket QR code at the entrance.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Organizer Contact:</p>
                  <p className="text-gray-600">{ticket.event.organizer}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Purchase Date:</p>
                  <p className="text-gray-600">{ticket.purchaseDate}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Tickets can be cancelled up to 24 hours before the event for a full refund. 
                  Cancellations made within 24 hours are non-refundable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;
