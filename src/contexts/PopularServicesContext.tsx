'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PopularService {
  id: string;
  title: string;
  icon: string;
  providerCount: number;
  image: string;
  mostBooked: boolean;
}

interface PopularServicesContextType {
  popularServices: PopularService[];
  loading: boolean;
  error: string | null;
  refreshServices: () => void;
}

const PopularServicesContext = createContext<PopularServicesContextType | undefined>(undefined);

// Initial popular services data - will be fetched from API
const initialPopularServices: PopularService[] = [
  {
    id: 'net-bowler',
    title: 'Net Bowler',
    icon: '🎯',
    providerCount: 156,
    image: '/images/Service Catagories/cricket net bowler.jpeg',
    mostBooked: true
  },
  {
    id: 'cricket-coach',
    title: 'Cricket Coach',
    icon: '🏏',
    providerCount: 120,
    image: '/images/Service Catagories/Cricket coach.png',
    mostBooked: true
  },
  {
    id: 'physio',
    title: 'Sports Physio',
    icon: '👨‍⚕️',
    providerCount: 28,
    image: '/images/Service Catagories/cricket physio.png',
    mostBooked: false
  },
  {
    id: 'umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 45,
    image: '/images/Service Catagories/cricket umpire.png',
    mostBooked: true
  },
  {
    id: 'sidearm-thrower',
    title: 'Sidearm Thrower',
    icon: '💪',
    providerCount: 34,
    image: '/images/Service Catagories/cricket sidearm.png',
    mostBooked: true
  }
];

export function PopularServicesProvider({ children }: { children: ReactNode }) {
  const [popularServices, setPopularServices] = useState<PopularService[]>(initialPopularServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshServices = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setPopularServices(initialPopularServices);
    } catch (err) {
      setError('Failed to load popular services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshServices();
  }, []);

  const value = {
    popularServices,
    loading,
    error,
    refreshServices
  };

  return (
    <PopularServicesContext.Provider value={value}>
      {children}
    </PopularServicesContext.Provider>
  );
}

export function usePopularServices() {
  const context = useContext(PopularServicesContext);
  if (context === undefined) {
    throw new Error('usePopularServices must be used within a PopularServicesProvider');
  }
  return context;
}
