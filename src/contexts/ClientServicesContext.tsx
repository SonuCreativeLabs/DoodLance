'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  providerCount: number;
  mostBooked?: boolean;
  image: string;
  fallbackEmoji: string;
}

interface ClientServicesContextType {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  refreshServices: () => void;
}

const ClientServicesContext = createContext<ClientServicesContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
const initialServices: ServiceItem[] = [
  // Cricket Playing Services
  { id: 'match-player', name: 'Match Player', category: 'playing', providerCount: 52, mostBooked: true, image: '/images/categories/sports-fitness.jpg', fallbackEmoji: '🏏' },
  { id: 'net-bowler', name: 'Net Bowler', category: 'playing', providerCount: 45, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏏' },
  { id: 'net-batsman', name: 'Net Batsman', category: 'playing', providerCount: 38, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏏' },
  { id: 'sidearm-specialist', name: 'Sidearm', category: 'playing', providerCount: 22, image: '/images/women sidearm.png', fallbackEmoji: '🎯' },

  // Cricket Coaching & Training
  { id: 'coach', name: 'Coach', category: 'coaching', providerCount: 35, mostBooked: true, image: '/images/categories/education.jpg', fallbackEmoji: '👨‍🏫' },
  { id: 'trainer', name: 'Trainer', category: 'coaching', providerCount: 60, image: '/images/categories/sports-fitness.jpg', fallbackEmoji: '💪' },

  // Cricket Support Services
  { id: 'analyst', name: 'Analyst', category: 'support', providerCount: 18, image: '/images/companies/digitalvibes.png', fallbackEmoji: '📊' },
  { id: 'physio', name: 'Physio', category: 'support', providerCount: 25, image: '/images/categories/beauty-spa.jpg', fallbackEmoji: '🏥' },
  { id: 'scorer', name: 'Scorer', category: 'support', providerCount: 15, image: '/images/companies/capture.png', fallbackEmoji: '📝' },
  { id: 'umpire', name: 'Umpire', category: 'support', providerCount: 20, image: '/images/live events.jpeg', fallbackEmoji: '⚖️' },

  // Cricket Media & Content
  { id: 'cricket-photo-videography', name: 'Cricket Photo / Videography', category: 'media', providerCount: 30, mostBooked: true, image: '/images/Event production.jpeg', fallbackEmoji: '📷' },
  { id: 'cricket-content-creator', name: 'Cricket Content Creator', category: 'media', providerCount: 24, image: '/images/Influencer:creator.jpeg', fallbackEmoji: '🎬' },
  { id: 'commentator', name: 'Commentator', category: 'media', providerCount: 16, image: '/images/live events.jpeg', fallbackEmoji: '🎤' },

  // Other Services
  { id: 'other', name: 'Other', category: 'other', providerCount: 5, image: '/images/Bowler & batsman.png', fallbackEmoji: '🔧' },

  // Cricket Ground Services
];

export function ClientServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshServices = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setServices(initialServices);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshServices();
  }, []);

  const value = {
    services,
    loading,
    error,
    refreshServices
  };

  return (
    <ClientServicesContext.Provider value={value}>
      {children}
    </ClientServicesContext.Provider>
  );
}

export function useClientServices() {
  const context = useContext(ClientServicesContext);
  if (context === undefined) {
    throw new Error('useClientServices must be used within a ClientServicesProvider');
  }
  return context;
}
