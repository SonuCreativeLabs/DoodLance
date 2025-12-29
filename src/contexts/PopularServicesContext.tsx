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

// Initial popular services data
const initialPopularServices: PopularService[] = [
  {
    id: 'net-bowler',
    title: 'Net Bowler',
    icon: '🎯',
    providerCount: 0,
    image: '/images/Service Catagories/cricket net bowler.jpeg',
    mostBooked: true
  },
  {
    id: 'sidearm-specialist',
    title: 'Sidearm',
    icon: '🎯',
    providerCount: 0,
    image: '/images/Service Catagories/cricket sidearm.png',
    mostBooked: true
  },
  {
    id: 'coach',
    title: 'Coach',
    icon: '👨‍🏫',
    providerCount: 0,
    image: '/images/Service Catagories/Cricket coach.png',
    mostBooked: true
  },
  {
    id: 'match-player',
    title: 'Match Player',
    icon: '🏏',
    providerCount: 0,
    image: '/images/Service Catagories/Cricket match player.png',
    mostBooked: true
  },
  {
    id: 'cricket-photo-videography',
    title: 'Cricket Photo / Videography',
    icon: '📷',
    providerCount: 0,
    image: '/images/Service Catagories/cricket photography.jpeg',
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
