'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Booking {
  "#": string;
  service: string;
  provider: string;
  image: string;
  date: string;
  time: string;
  status: 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  location: string;
  price: string;
  rating: number;
  completedJobs: number;
  description: string;
  category: string;
  providerPhone?: string;
  paymentMethod?: 'cod' | 'upi' | 'card' | 'wallet';
  notes?: string; // Client notes for the freelancer
  otp?: string; // 4-digit OTP for job verification
  services?: {
    id: string;
    title: string;
    price: string | number;
    quantity: number;
  }[];
}

interface BookingsContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refreshBookings: () => void;
  addBooking: (booking: Omit<Booking, '#'>) => string;
  rescheduleBooking: (id: string, newDate: string, newTime: string) => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
// Initial mock data - this would typically come from an API
const initialBookings: Booking[] = [];

// Generate a unique booking ID
const generateBookingId = (): string => {
  const prefix = '#TNCHE';
  const randomNum = Math.floor(Math.random() * 900) + 100; // 3 digit number
  return `${prefix}${randomNum}`;
};

// LocalStorage key for client bookings (shared with freelancer side)
const CLIENT_BOOKINGS_KEY = 'clientBookings';

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load bookings from localStorage on mount
  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem(CLIENT_BOOKINGS_KEY);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (err) {
      console.error('Error loading bookings from localStorage:', err);
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CLIENT_BOOKINGS_KEY, JSON.stringify(bookings));

      // Dispatch custom event so freelancer side can listen
      window.dispatchEvent(new CustomEvent('clientBookingUpdated', {
        detail: { bookings }
      }));
    } catch (err) {
      console.error('Error saving bookings to localStorage:', err);
    }
  }, [bookings]);

  const refreshBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load from localStorage
      const storedBookings = localStorage.getItem(CLIENT_BOOKINGS_KEY);
      if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings) as Booking[];
        const mergedBookings = [...parsedBookings];
        initialBookings.forEach(initial => {
          if (!mergedBookings.some(b => b['#'] === initial['#'])) {
            mergedBookings.push(initial);
          }
        });
        setBookings(mergedBookings);
      } else {
        setBookings(initialBookings);
      }
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Add a new booking
  const addBooking = (bookingData: Omit<Booking, '#'>): string => {
    const bookingId = generateBookingId();
    const newBooking: Booking = {
      '#': bookingId,
      ...bookingData
    };

    // Add to the beginning of the list so it shows first
    setBookings(prev => [newBooking, ...prev]);

    // Immediately save to localStorage so freelancer side can access it
    try {
      const storedBookings = localStorage.getItem(CLIENT_BOOKINGS_KEY);
      const existingBookings = storedBookings ? JSON.parse(storedBookings) : [];
      const updatedBookings = [newBooking, ...existingBookings];
      localStorage.setItem(CLIENT_BOOKINGS_KEY, JSON.stringify(updatedBookings));

      // Dispatch event to notify freelancer side immediately
      window.dispatchEvent(new CustomEvent('clientBookingUpdated', {
        detail: { bookings: updatedBookings, action: 'added', newBooking }
      }));
    } catch (err) {
      console.error('Error saving new booking to localStorage:', err);
    }

    return bookingId;
  };

  // Reschedule an existing booking
  const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking['#'] === id) {
        return {
          ...booking,
          date: newDate,
          time: newTime,
          status: 'confirmed' // Reset status to confirmed if it was something else? Or keep it? Usually rescheduling implies re-confirmation.
        };
      }
      return booking;
    }));

    // Local storage update is handled by the useEffect
  };

  const value = {
    bookings,
    loading,
    error,
    refreshBookings,
    addBooking,
    rescheduleBooking
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingsProvider');
  }
  return context;
}
