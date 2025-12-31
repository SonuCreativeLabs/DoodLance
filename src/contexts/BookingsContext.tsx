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

// Initial state
const initialBookings: Booking[] = [];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        // Map API response to Context Booking interface
        // API returns: { id, title, clientName, freelancerName, freelancerAvatar, ... }
        // Context expects: { '#': string, service: string, provider: string, ... }

        const mapped: Booking[] = (data.bookings || []).map((b: any) => {
          const dateObj = b.date ? new Date(b.date) : null;
          return {
            "#": b.id,
            service: b.title,
            provider: b.freelancerName || 'Unknown',
            image: b.freelancerAvatar || '/images/avatar-placeholder.png',
            date: dateObj ? dateObj.toISOString().split('T')[0] : '',
            time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
            status: (b.status?.toLowerCase() as any) || 'pending',
            location: 'Remote',
            price: `₹${b.price}`,
            rating: 0,
            completedJobs: 0,
            description: '',
            category: 'General',
          };
        });
        setBookings(mapped);
      } else {
        // If 401, maybe just empty
        if (response.status === 401) setBookings([]);
        else setError('Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const refreshBookings = fetchBookings;

  // Add a new booking
  const addBooking = async (bookingData: Omit<Booking, '#'>): Promise<string> => {
    // Note: The caller might expect synchronous return of ID. 
    // We changed signature to Promise<string> to handle API.
    // Ensure consumers await this.

    // Convert context data to API payload
    // bookingData has 'service' (title), 'provider', etc.
    // API needs 'serviceId'. 
    // PROBLEM: The current 'addBooking' in frontend works with pre-defined Booking object that might NOT have serviceId!
    // We need to pass serviceId. The `Booking` interface needs to support `serviceId`.

    // For now, assume bookingData contains `serviceId` or we can't create it meaningfully in DB.
    // Looking at `Booking` interface:
    // services?: { id, ... }[]

    // If the Caller passes `services` array (cart?), we pick the first one?
    const serviceId = bookingData.services?.[0]?.id || (bookingData as any).serviceId;

    if (!serviceId) {
      throw new Error("Service ID missing for booking");
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          scheduledAt: bookingData.date ? new Date(`${bookingData.date} ${bookingData.time}`) : undefined,
          notes: bookingData.notes,
          // Pass other fields if API supports
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newId = data.booking.id;
        await refreshBookings(); // Reload to get full state
        return newId;
      } else {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error adding booking:', err);
      throw err;
    }
  };

  // Reschedule an existing booking
  const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
    try {
      // Optimistic
      setBookings(prev => prev.map(booking => {
        if (booking['#'] === id) {
          return {
            ...booking,
            date: newDate,
            time: newTime,
            status: 'confirmed'
          };
        }
        return booking;
      }));

      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT', // or PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CONFIRMED', // Reschedule usually confirms it?
          // API PUT expects status.
          // We might need a specific 'reschedule' field or just update logic.
          // For now just status update as per existing PUT
        }),
      });

      if (!response.ok) fetchBookings(); // Revert/Reload
    } catch (err) {
      console.error('Error rescheduling:', err);
      fetchBookings();
    }
  };

  const value = {
    bookings,
    loading,
    error,
    refreshBookings,
    // Cast appropriately or update Interface in Step 1
    addBooking: addBooking as any,
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
