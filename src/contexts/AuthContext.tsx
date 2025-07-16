
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer';
  avatar?: string;
}

interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  location: string;
  ticketType: string;
  quantity: number;
  totalPaid: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  image: string;
  bookingId: string;
  userId: string;
  userName: string;
}

interface WishlistItem {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  maxAttendees: number;
  image: string;
  organizerId: string;
  organizer: string;
  status: 'active' | 'sold-out' | 'cancelled';
  attendees: number;
  earnings: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  wishlist: WishlistItem[];
  events: Event[];
  loading: boolean;
  login: (email: string, password: string, role: 'user' | 'organizer') => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'organizer') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  toggleWishlist: (event: WishlistItem) => void;
  isInWishlist: (eventId: string) => boolean;
  createEvent: (eventData: Omit<Event, 'id' | 'organizerId' | 'organizer' | 'attendees' | 'earnings' | 'createdAt' | 'status'>) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  getEventBookings: (eventId: string) => Booking[];
  getOrganizerStats: () => {
    totalEvents: number;
    totalTicketsSold: number;
    totalEarnings: number;
    activeEvents: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with default events
    const defaultEvents: Event[] = [
      {
        id: '1',
        title: 'Summer Music Festival 2024',
        description: 'Join us for an unforgettable night of music with top artists from around the world.',
        category: 'Music',
        date: '2024-08-15',
        time: '18:00',
        location: 'Central Park, New York',
        price: 89,
        maxAttendees: 2000,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500',
        organizerId: 'org1',
        organizer: 'Music Events Co.',
        status: 'active',
        attendees: 1250,
        earnings: 111250,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Tech Innovation Conference',
        description: 'Discover the latest trends in technology and connect with industry leaders.',
        category: 'Conference',
        date: '2024-08-20',
        time: '09:00',
        location: 'Convention Center, San Francisco',
        price: 199,
        maxAttendees: 1000,
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500',
        organizerId: 'org2',
        organizer: 'TechEvents Inc.',
        status: 'active',
        attendees: 850,
        earnings: 169150,
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '3',
        title: 'Comedy Night Special',
        description: 'Laugh until your sides hurt with our lineup of incredible comedians.',
        category: 'Comedy',
        date: '2024-08-12',
        time: '20:00',
        location: 'Comedy Club Downtown',
        price: 45,
        maxAttendees: 150,
        image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=500',
        organizerId: 'org3',
        organizer: 'Laugh Factory',
        status: 'active',
        attendees: 120,
        earnings: 5400,
        createdAt: '2024-01-05T10:00:00Z'
      },
      {
        id: '4',
        title: 'Art Gallery Opening',
        description: 'Experience contemporary art from emerging local artists in an intimate setting.',
        category: 'Art',
        date: '2024-08-18',
        time: '19:00',
        location: 'Modern Art Gallery',
        price: 25,
        maxAttendees: 200,
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500',
        organizerId: 'org4',
        organizer: 'Gallery Events',
        status: 'active',
        attendees: 80,
        earnings: 2000,
        createdAt: '2024-01-01T10:00:00Z'
      }
    ];

    // Check for stored data
    const storedUser = localStorage.getItem('eventBookingUser');
    const storedBookings = localStorage.getItem('eventBookings');
    const storedWishlist = localStorage.getItem('eventWishlist');
    const storedEvents = localStorage.getItem('eventBookingEvents');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(defaultEvents);
      localStorage.setItem('eventBookingEvents', JSON.stringify(defaultEvents));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'organizer') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: role === 'organizer' ? 'org1' : 'user1',
      name: role === 'organizer' ? 'Event Organizer' : 'John Doe',
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
    
    setUser(mockUser);
    localStorage.setItem('eventBookingUser', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'organizer') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: role === 'organizer' ? 'org1' : 'user1',
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
    
    setUser(mockUser);
    localStorage.setItem('eventBookingUser', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    setWishlist([]);
    localStorage.removeItem('eventBookingUser');
    localStorage.removeItem('eventBookings');
    localStorage.removeItem('eventWishlist');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('eventBookingUser', JSON.stringify(updatedUser));
    }
  };

  const addBooking = (booking: Booking) => {
    // Add booking to user's bookings
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('eventBookings', JSON.stringify(newBookings));

    // Update event stats
    const updatedEvents = events.map(event => {
      if (event.id === booking.eventId) {
        const newAttendees = event.attendees + booking.quantity;
        const newEarnings = event.earnings + booking.totalPaid;
        const newStatus = newAttendees >= event.maxAttendees ? 'sold-out' : event.status;
        
        return {
          ...event,
          attendees: newAttendees,
          earnings: newEarnings,
          status: newStatus as 'active' | 'sold-out' | 'cancelled'
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    localStorage.setItem('eventBookingEvents', JSON.stringify(updatedEvents));
  };

  const cancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(booking => booking.id === bookingId);
    if (bookingToCancel) {
      // Update event stats
      const updatedEvents = events.map(event => {
        if (event.id === bookingToCancel.eventId) {
          const newAttendees = Math.max(0, event.attendees - bookingToCancel.quantity);
          const newEarnings = Math.max(0, event.earnings - bookingToCancel.totalPaid);
          const newStatus = newAttendees < event.maxAttendees ? 'active' : event.status;
          
          return {
            ...event,
            attendees: newAttendees,
            earnings: newEarnings,
            status: newStatus as 'active' | 'sold-out' | 'cancelled'
          };
        }
        return event;
      });
      
      setEvents(updatedEvents);
      localStorage.setItem('eventBookingEvents', JSON.stringify(updatedEvents));
    }

    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('eventBookings', JSON.stringify(updatedBookings));
  };

  const toggleWishlist = (event: WishlistItem) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === event.id);
    let updatedWishlist;
    
    if (isAlreadyInWishlist) {
      updatedWishlist = wishlist.filter(item => item.id !== event.id);
    } else {
      updatedWishlist = [...wishlist, event];
    }
    
    setWishlist(updatedWishlist);
    localStorage.setItem('eventWishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (eventId: string) => {
    return wishlist.some(item => item.id === eventId);
  };

  const createEvent = (eventData: Omit<Event, 'id' | 'organizerId' | 'organizer' | 'attendees' | 'earnings' | 'createdAt' | 'status'>) => {
    if (!user) return;

    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      organizerId: user.id,
      organizer: user.name,
      attendees: 0,
      earnings: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('eventBookingEvents', JSON.stringify(updatedEvents));
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('eventBookingEvents', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (eventId: string) => {
    // Remove event
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('eventBookingEvents', JSON.stringify(updatedEvents));

    // Remove related bookings
    const updatedBookings = bookings.filter(booking => booking.eventId !== eventId);
    setBookings(updatedBookings);
    localStorage.setItem('eventBookings', JSON.stringify(updatedBookings));

    // Remove from wishlist
    const updatedWishlist = wishlist.filter(item => item.id !== eventId);
    setWishlist(updatedWishlist);
    localStorage.setItem('eventWishlist', JSON.stringify(updatedWishlist));
  };

  const getEventBookings = (eventId: string) => {
    return bookings.filter(booking => booking.eventId === eventId);
  };

  const getOrganizerStats = () => {
    if (!user || user.role !== 'organizer') {
      return { totalEvents: 0, totalTicketsSold: 0, totalEarnings: 0, activeEvents: 0 };
    }

    const organizerEvents = events.filter(event => event.organizerId === user.id);
    
    return {
      totalEvents: organizerEvents.length,
      totalTicketsSold: organizerEvents.reduce((sum, event) => sum + event.attendees, 0),
      totalEarnings: organizerEvents.reduce((sum, event) => sum + event.earnings, 0),
      activeEvents: organizerEvents.filter(event => event.status === 'active').length
    };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    bookings,
    wishlist,
    events,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    addBooking,
    cancelBooking,
    toggleWishlist,
    isInWishlist,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventBookings,
    getOrganizerStats
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
