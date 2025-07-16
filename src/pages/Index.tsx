import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Calendar, Music, Mic, BookOpen, Palette } from 'lucide-react';

const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'Join us for an unforgettable night of music with top artists from around the world.',
    date: '2024-08-15',
    time: '18:00',
    location: 'Central Park, New York',
    price: 89,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500',
    category: 'Music',
    attendees: 1250,
    maxAttendees: 2000,
    organizer: 'Music Events Co.'
  },
  {
    id: '2',
    title: 'Tech Innovation Conference',
    description: 'Discover the latest trends in technology and connect with industry leaders.',
    date: '2024-08-20',
    time: '09:00',
    location: 'Convention Center, San Francisco',
    price: 199,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500',
    category: 'Conference',
    attendees: 850,
    maxAttendees: 1000,
    organizer: 'TechEvents Inc.'
  },
  {
    id: '3',
    title: 'Comedy Night Special',
    description: 'Laugh until your sides hurt with our lineup of incredible comedians.',
    date: '2024-08-12',
    time: '20:00',
    location: 'Comedy Club Downtown',
    price: 45,
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=500',
    category: 'Comedy',
    attendees: 120,
    maxAttendees: 150,
    organizer: 'Laugh Factory'
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    description: 'Experience contemporary art from emerging local artists in an intimate setting.',
    date: '2024-08-18',
    time: '19:00',
    location: 'Modern Art Gallery',
    price: 25,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500',
    category: 'Art',
    attendees: 80,
    maxAttendees: 200,
    organizer: 'Gallery Events'
  }
];

const categories = [
  { name: 'All', icon: Calendar },
  { name: 'Music', icon: Music },
  { name: 'Comedy', icon: Mic },
  { name: 'Conference', icon: BookOpen },
  { name: 'Art', icon: Palette },
];

const Index = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [wishlistedEvents, setWishlistedEvents] = useState<string[]>([]);

  const handleWishlist = (eventId: string) => {
    setWishlistedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && event.price === 0) ||
                        (priceFilter === 'under50' && event.price < 50) ||
                        (priceFilter === 'under100' && event.price < 100) ||
                        (priceFilter === 'over100' && event.price >= 100);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              From concerts to conferences, find and book tickets for events that matter to you
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Price Filter */}
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="under50">Under $50</SelectItem>
              <SelectItem value="under100">Under $100</SelectItem>
              <SelectItem value="over100">$100+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Upcoming Events'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredEvents.length} events found
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
