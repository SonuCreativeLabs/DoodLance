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
  { id: 'match-player', name: 'Match Player', category: 'playing', providerCount: 52, mostBooked: true, image: '/images/Service Catagories/Cricket match player.png', fallbackEmoji: '🏏' },
  { id: 'net-bowler', name: 'Net Bowler', category: 'playing', providerCount: 45, mostBooked: true, image: '/images/Service Catagories/cricket net bowler.jpeg', fallbackEmoji: '🏏' },
  { id: 'net-batsman', name: 'Net Batsman', category: 'playing', providerCount: 38, mostBooked: true, image: '/images/Service Catagories/Cricket net batsman.png', fallbackEmoji: '🏏' },
  { id: 'sidearm-specialist', name: 'Sidearm', category: 'playing', providerCount: 22, image: '/images/Service Catagories/cricket sidearm.png', fallbackEmoji: '🎯' },

  // Cricket Coaching & Training
  { id: 'coach', name: 'Coach', category: 'coaching', providerCount: 35, mostBooked: true, image: '/images/Service Catagories/Cricket coach.png', fallbackEmoji: '👨‍🏫' },
  { id: 'trainer', name: 'Trainer', category: 'coaching', providerCount: 60, image: '/images/Service Catagories/cricket trainer.png', fallbackEmoji: '💪' },

  // Cricket Support Services
  { id: 'analyst', name: 'Analyst', category: 'support', providerCount: 18, image: '/images/Service Catagories/cricket analyst.png', fallbackEmoji: '📊' },
  { id: 'physio', name: 'Physio', category: 'support', providerCount: 25, image: '/images/Service Catagories/cricket physio.png', fallbackEmoji: '🏥' },
  { id: 'scorer', name: 'Scorer', category: 'support', providerCount: 15, image: '/images/Service Catagories/cricket scorer.png', fallbackEmoji: '📝' },
  { id: 'umpire', name: 'Umpire', category: 'support', providerCount: 20, image: '/images/Service Catagories/cricket umpire.png', fallbackEmoji: '⚖️' },

  // Cricket Media & Content
  { id: 'cricket-photo-videography', name: 'Cricket Photo / Videography', category: 'media', providerCount: 30, mostBooked: true, image: '/images/Service Catagories/cricket photography.jpeg', fallbackEmoji: '📷' },
  { id: 'cricket-content-creator', name: 'Cricket Influencer', category: 'media', providerCount: 24, image: '/images/Service Catagories/cricket influencer.png', fallbackEmoji: '🎬' },
  { id: 'commentator', name: 'Commentator', category: 'media', providerCount: 16, image: '/images/Service Catagories/cricket commentator.png', fallbackEmoji: '🎤' },

  // Other Services
  { id: 'other', name: 'Other', category: 'other', providerCount: 5, image: '/images/Service Catagories/other.png', fallbackEmoji: '🔧' },

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
