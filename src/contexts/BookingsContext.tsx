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
}

interface BookingsContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refreshBookings: () => void;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
const initialBookings: Booking[] = [
  {
    "#": "#TNCHE001",
    service: "Batting Coaching",
    provider: "Rahul Sharma",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().getHours() < 11 ? "11:00 AM" : "5:00 PM", // Future time today
    status: "ongoing",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,200/session",
    rating: 4.8,
    completedJobs: 342,
    description: "Advanced batting technique and shot selection coaching",
    category: "cricket"
  },
  {
    "#": "#TNCHE002",
    service: "Bowling Training",
    provider: "Irfan Pathan",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Irfan",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "5:00 PM",
    status: "confirmed",
    location: "MA Chidambaram Stadium, Chennai",
    price: "₹800/hr",
    rating: 4.9,
    completedJobs: 234,
    description: "Fast bowling technique and pace bowling mastery",
    category: "cricket"
  },
  {
    "#": "#TNCHE003",
    service: "Fielding Practice",
    provider: "Virat Kohli",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Virat",
    date: new Date().toISOString().split('T')[0], // Today
    time: new Date().getHours() < 16 ? "4:30 PM" : "8:30 PM", // Future time today
    status: "ongoing",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,000/session",
    rating: 4.6,
    completedJobs: 145,
    description: "Advanced fielding drills and catching techniques",
    category: "cricket"
  },
  {
    "#": "#TNALWA001",
    service: "Cricket Fitness Training",
    provider: "Sachin Tendulkar",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachin",
    date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: "5:30 PM",
    status: "confirmed",
    location: "Alwarpet Cricket Academy, Chennai",
    price: "₹1,500/month",
    rating: 5.0,
    completedJobs: 312,
    description: "Cricket-specific fitness and endurance training",
    category: "cricket"
  }
];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setBookings(initialBookings);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshBookings();
  }, []);

  const value = {
    bookings,
    loading,
    error,
    refreshBookings
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
