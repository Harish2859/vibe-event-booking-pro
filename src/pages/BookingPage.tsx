
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock event data - in real app, fetch by id
  const event = {
    id: id,
    title: 'Summer Music Festival',
    date: '2024-08-15',
    time: '7:00 PM',
    location: 'Central Park, New York',
    price: 75,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80'
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    navigate('/dashboard');
  };

  const total = event.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.date} at {event.time}</p>
              <p className="text-gray-600 mb-4">{event.location}</p>
              <p className="text-2xl font-bold text-blue-600">${event.price} per ticket</p>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quantity">Number of Tickets</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Tickets ({quantity}x)</span>
                  <span>${event.price * quantity}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total + 5}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Booking'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
