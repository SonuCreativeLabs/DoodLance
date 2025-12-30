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

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

interface ClientServicesContextType {
  services: ServiceItem[];
  categories: CategoryItem[];
  loading: boolean;
  error: string | null;
  refreshServices: () => void;
}

const ClientServicesContext = createContext<ClientServicesContextType | undefined>(undefined);

// Define categories
const categories: CategoryItem[] = [
  { id: 'playing', name: 'Playing', icon: '🏏', slug: 'playing' },
  { id: 'coaching', name: 'Coaching', icon: '👨‍🏫', slug: 'coaching' },
  { id: 'support', name: 'Support', icon: '🤝', slug: 'support' },
  { id: 'media', name: 'Media', icon: '📸', slug: 'media' },
  { id: 'other', name: 'Other', icon: '🔧', slug: 'other' }
];

// Initial services - will be fetched from API
const initialServices: ServiceItem[] = [
  // Playing
  {
    id: 'net-bowler',
    name: 'Net Bowler',
    category: 'playing',
    providerCount: 156,
    image: '/images/Service Catagories/cricket net bowler.jpeg',
    fallbackEmoji: '🎯',
    mostBooked: true
  },
  {
    id: 'net-batter',
    name: 'Net Batter',
    category: 'playing',
    providerCount: 45,
    image: '/images/Service Catagories/Cricket net batsman.png',
    fallbackEmoji: '🏏'
  },
  {
    id: 'match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 89,
    image: '/images/Service Catagories/Cricket match player.png',
    fallbackEmoji: '🏃'
  },

  // Coaching
  {
    id: 'cricket-coach',
    name: 'Cricket Coach',
    category: 'coaching',
    providerCount: 120,
    image: '/images/Service Catagories/Cricket coach.png',
    fallbackEmoji: '👨‍🏫',
    mostBooked: true
  },
  {
    id: 'sidearm-thrower',
    name: 'Sidearm Thrower',
    category: 'coaching',
    providerCount: 34,
    image: '/images/Service Catagories/cricket sidearm.png',
    fallbackEmoji: '💪'
  },
  {
    id: 'cricket-trainer',
    name: 'Fitness Trainer',
    category: 'coaching',
    providerCount: 56,
    image: '/images/Service Catagories/cricket trainer.png',
    fallbackEmoji: '🏋️'
  },

  // Support
  {
    id: 'umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 45,
    image: '/images/Service Catagories/cricket umpire.png',
    fallbackEmoji: '☝️'
  },
  {
    id: 'scorer',
    name: 'Scorer',
    category: 'support',
    providerCount: 32,
    image: '/images/Service Catagories/cricket scorer.png',
    fallbackEmoji: '📝'
  },
  {
    id: 'physio',
    name: 'Sports Physio',
    category: 'support',
    providerCount: 28,
    image: '/images/Service Catagories/cricket physio.png',
    fallbackEmoji: '👨‍⚕️'
  },

  // Media
  {
    id: 'commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 15,
    image: '/images/Service Catagories/cricket commentator.png',
    fallbackEmoji: '🎙️'
  },
  {
    id: 'analyst',
    name: 'Cricket Analyst',
    category: 'media',
    providerCount: 12,
    image: '/images/Service Catagories/cricket analyst.png',
    fallbackEmoji: '💻'
  },
  {
    id: 'photographer',
    name: 'Photographer',
    category: 'media',
    providerCount: 45,
    image: '/images/Service Catagories/cricket photography.jpeg',
    fallbackEmoji: '📸'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 23,
    image: '/images/Service Catagories/cricket influencer.png',
    fallbackEmoji: '📱'
  },

  // Other
  {
    id: 'other',
    name: 'Other Services',
    category: 'other',
    providerCount: 10,
    image: '/images/Service Catagories/other.png',
    fallbackEmoji: '🔧'
  }
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
    categories,
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
