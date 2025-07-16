
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
}

interface WishlistItem {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  image: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  wishlist: WishlistItem[];
  login: (email: string, password: string, role: 'user' | 'organizer') => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'organizer') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  toggleWishlist: (event: WishlistItem) => void;
  isInWishlist: (eventId: string) => boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('eventBookingUser');
    const storedBookings = localStorage.getItem('eventBookings');
    const storedWishlist = localStorage.getItem('eventWishlist');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'organizer') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
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
      id: '1',
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
    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('eventBookings', JSON.stringify(newBookings));
  };

  const cancelBooking = (bookingId: string) => {
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

  const value = {
    user,
    isAuthenticated: !!user,
    bookings,
    wishlist,
    login,
    signup,
    logout,
    updateProfile,
    addBooking,
    cancelBooking,
    toggleWishlist,
    isInWishlist,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
