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
  sport?: string;
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
    image: '/images/Service Catagories/cricket net bowler.webp',
    fallbackEmoji: '🎯',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'net-batter',
    name: 'Net Batter',
    category: 'playing',
    providerCount: 45,
    image: '/images/Service Catagories/Cricket net batsman.webp',
    fallbackEmoji: '🏏',
    sport: 'Cricket'
  },
  {
    id: 'match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 89,
    image: '/images/Service Catagories/Cricket match player.webp',
    fallbackEmoji: '🏃',
    sport: 'Cricket'
  },

  // Coaching
  {
    id: 'cricket-coach',
    name: 'Cricket Coach',
    category: 'coaching',
    providerCount: 120,
    image: '/images/Service Catagories/Cricket coach.webp',
    fallbackEmoji: '👨‍🏫',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'sidearm-thrower',
    name: 'Sidearm Thrower',
    category: 'coaching',
    providerCount: 34,
    image: '/images/Service Catagories/cricket sidearm.webp',
    fallbackEmoji: '💪',
    sport: 'Cricket'
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    category: 'coaching',
    providerCount: 56,
    image: '/images/Service Catagories/cricket trainer.webp',
    fallbackEmoji: '🏋️',
    sport: 'Fitness'
  },
  {
    id: 'yoga-instructor',
    name: 'Yoga Instructor',
    category: 'coaching',
    providerCount: 42,
    image: '/images/Service Catagories/fitness yoga instructor.webp',
    fallbackEmoji: '🧘',
    sport: 'Fitness'
  },
  {
    id: 'conditioning-coach',
    name: 'Strength & Conditioning',
    category: 'coaching',
    providerCount: 38,
    image: '/images/Service Catagories/fitness strength conditioning.webp',
    fallbackEmoji: '💪',
    sport: 'Fitness'
  },
  {
    id: 'crossfit-coach',
    name: 'Crossfit Coach',
    category: 'coaching',
    providerCount: 22,
    image: '/images/Service Catagories/fitness crossfit coach.webp',
    fallbackEmoji: '🏋️',
    sport: 'Fitness'
  },
  {
    id: 'sports-nutritionist',
    name: 'Sports Nutritionist',
    category: 'coaching',
    providerCount: 18,
    image: '/images/Service Catagories/fitness sports nutritionist.webp',
    fallbackEmoji: '🥗',
    sport: 'Fitness'
  },

  // Support
  {
    id: 'umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 45,
    image: '/images/Service Catagories/cricket umpire.webp',
    fallbackEmoji: '☝️',
    sport: 'Cricket'
  },
  {
    id: 'scorer',
    name: 'Scorer',
    category: 'support',
    providerCount: 32,
    image: '/images/Service Catagories/cricket scorer.webp',
    fallbackEmoji: '📝',
    sport: 'Cricket'
  },
  {
    id: 'physio',
    name: 'Sports Physio',
    category: 'other',
    providerCount: 28,
    image: '/images/Service Catagories/cricket physio.webp',
    fallbackEmoji: '👨‍⚕️',
    sport: 'Others'
  },

  // Media
  {
    id: 'commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 15,
    image: '/images/Service Catagories/cricket commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Cricket'
  },
  {
    id: 'analyst',
    name: 'Cricket Analyst',
    category: 'media',
    providerCount: 12,
    image: '/images/Service Catagories/cricket analyst.webp',
    fallbackEmoji: '💻',
    sport: 'Cricket'
  },
  {
    id: 'photographer',
    name: 'Sports Photo/Videographer',
    category: 'other',
    providerCount: 45,
    image: '/images/Service Catagories/other sports photographer.webp',
    fallbackEmoji: '📸',
    sport: 'Others'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 23,
    image: '/images/Service Catagories/cricket influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Cricket'
  },

  // Other
  {
    id: 'other',
    name: 'Other Services',
    category: 'other',
    providerCount: 10,
    image: '/images/Service Catagories/other.webp',
    fallbackEmoji: '🔧',
    sport: 'Others'
  },

  // Football Services
  {
    id: 'football-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 45,
    image: '/images/Service Catagories/football match player.webp',
    fallbackEmoji: '⚽',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-training-partner',
    name: 'Training Partner',
    category: 'playing',
    providerCount: 22,
    image: '/images/Service Catagories/football training partner.webp',
    fallbackEmoji: '⚽',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-coach',
    name: 'Football Coach',
    category: 'coaching',
    providerCount: 32,
    image: '/images/Service Catagories/football coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-referee',
    name: 'Referee',
    category: 'support',
    providerCount: 15,
    image: '/images/Service Catagories/football referee.webp',
    fallbackEmoji: '🟨',
    sport: 'Football'
  },
  {
    id: 'football-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 8,
    image: '/images/Service Catagories/football analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Football'
  },
  {
    id: 'football-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 5,
    image: '/images/Service Catagories/football commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Football'
  },
  {
    id: 'football-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 12,
    image: '/images/Service Catagories/football influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Football'
  },

  // Badminton Services
  {
    id: 'badminton-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 34,
    image: '/images/Service Catagories/badminton match player.webp',
    fallbackEmoji: '🏸',
    mostBooked: true,
    sport: 'Badminton'
  },
  {
    id: 'badminton-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 28,
    image: '/images/Service Catagories/badminton practice partner.webp',
    fallbackEmoji: '🏸',
    sport: 'Badminton'
  },
  {
    id: 'badminton-coach',
    name: 'Badminton Coach',
    category: 'coaching',
    providerCount: 45,
    image: '/images/Service Catagories/badminton coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Badminton'
  },
  {
    id: 'badminton-umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 12,
    image: '/images/Service Catagories/badminton umpire.webp',
    fallbackEmoji: '☝️',
    sport: 'Badminton'
  },
  {
    id: 'badminton-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 8,
    image: '/images/Service Catagories/badminton analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Badminton'
  },
  {
    id: 'badminton-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 5,
    image: '/images/Service Catagories/badminton commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Badminton'
  },
  {
    id: 'badminton-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 12,
    image: '/images/Service Catagories/badminton influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Badminton'
  },

  // Tennis Services
  {
    id: 'tennis-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 30,
    image: '/images/Service Catagories/tennis match player.webp',
    fallbackEmoji: '🎾',
    mostBooked: true,
    sport: 'Tennis'
  },
  {
    id: 'tennis-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 25,
    image: '/images/Service Catagories/tennis practice partner.webp',
    fallbackEmoji: '🎾',
    sport: 'Tennis'
  },
  {
    id: 'tennis-coach',
    name: 'Tennis Coach',
    category: 'coaching',
    providerCount: 40,
    image: '/images/Service Catagories/tennis coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Tennis'
  },
  {
    id: 'tennis-umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 15,
    image: '/images/Service Catagories/tennis umpire.webp',
    fallbackEmoji: '☝️',
    sport: 'Tennis'
  },
  {
    id: 'tennis-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 6,
    image: '/images/Service Catagories/tennis analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Tennis'
  },
  {
    id: 'tennis-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 4,
    image: '/images/Service Catagories/tennis commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Tennis'
  },
  {
    id: 'tennis-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 10,
    image: '/images/Service Catagories/tennis influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Tennis'
  },

  // Basketball Services
  {
    id: 'basketball-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 40,
    image: '/images/Service Catagories/basketball match player.webp',
    fallbackEmoji: '🏀',
    mostBooked: true,
    sport: 'Basketball'
  },
  {
    id: 'basketball-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 30,
    image: '/images/Service Catagories/basketball practice partner.webp',
    fallbackEmoji: '🏀',
    sport: 'Basketball'
  },
  {
    id: 'basketball-coach',
    name: 'Basketball Coach',
    category: 'coaching',
    providerCount: 35,
    image: '/images/Service Catagories/basketball coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Basketball'
  },
  {
    id: 'basketball-referee',
    name: 'Referee',
    category: 'support',
    providerCount: 20,
    image: '/images/Service Catagories/basketball referee.webp',
    fallbackEmoji: '🟨',
    sport: 'Basketball'
  },
  {
    id: 'basketball-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 10,
    image: '/images/Service Catagories/basketball analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Basketball'
  },
  {
    id: 'basketball-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 6,
    image: '/images/Service Catagories/basketball commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Basketball'
  },
  {
    id: 'basketball-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 15,
    image: '/images/Service Catagories/basketball influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Basketball'
  },

  // Padel Services
  {
    id: 'padel-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 25,
    image: '/images/Service Catagories/padel match player.webp',
    fallbackEmoji: '🎾',
    mostBooked: true,
    sport: 'Padel'
  },
  {
    id: 'padel-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 20,
    image: '/images/Service Catagories/padel practice partner.webp',
    fallbackEmoji: '🎾',
    sport: 'Padel'
  },
  {
    id: 'padel-coach',
    name: 'Padel Coach',
    category: 'coaching',
    providerCount: 15,
    image: '/images/Service Catagories/padel coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Padel'
  },
  {
    id: 'padel-umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 8,
    image: '/images/Service Catagories/padel umpire.webp',
    fallbackEmoji: '☝️',
    sport: 'Padel'
  },
  {
    id: 'padel-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 4,
    image: '/images/Service Catagories/padel analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Padel'
  },
  {
    id: 'padel-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 3,
    image: '/images/Service Catagories/padel commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Padel'
  },
  {
    id: 'padel-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 8,
    image: '/images/Service Catagories/padel influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Padel'
  },

  // Pickleball Services
  {
    id: 'pickleball-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 28,
    image: '/images/Service Catagories/pickleball match player.webp',
    fallbackEmoji: '🏓',
    mostBooked: true,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 22,
    image: '/images/Service Catagories/pickleball practice partner.webp',
    fallbackEmoji: '🏓',
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-coach',
    name: 'Pickleball Coach',
    category: 'coaching',
    providerCount: 18,
    image: '/images/Service Catagories/pickleball coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-referee',
    name: 'Referee',
    category: 'support',
    providerCount: 10,
    image: '/images/Service Catagories/pickleball referee.webp',
    fallbackEmoji: '☝️',
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 5,
    image: '/images/Service Catagories/pickleball analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 3,
    image: '/images/Service Catagories/pickleball commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 8,
    image: '/images/Service Catagories/pickleball influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Pickleball'
  },

  // Table Tennis Services  
  {
    id: 'table-tennis-match-player',
    name: 'Match Player',
    category: 'playing',
    providerCount: 25,
    image: '/images/Service Catagories/table tennis match player.webp',
    fallbackEmoji: '🏓',
    mostBooked: true,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-practice-partner',
    name: 'Practice Partner',
    category: 'playing',
    providerCount: 20,
    image: '/images/Service Catagories/table tennis practice partner.webp',
    fallbackEmoji: '🏓',
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-coach',
    name: 'Table Tennis Coach',
    category: 'coaching',
    providerCount: 18,
    image: '/images/Service Catagories/table tennis coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-umpire',
    name: 'Umpire',
    category: 'support',
    providerCount: 10,
    image: '/images/Service Catagories/table tennis umpire.webp',
    fallbackEmoji: '☝️',
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 5,
    image: '/images/Service Catagories/table tennis analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 3,
    image: '/images/Service Catagories/table tennis commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 6,
    image: '/images/Service Catagories/table tennis influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Table Tennis'
  },



  // Combat Sports Services
  {
    id: 'combat-sports-fighter',
    name: 'Fighter',
    category: 'playing',
    providerCount: 28,
    image: '/images/Service Catagories/combat sports fighter.webp',
    fallbackEmoji: '🥊',
    mostBooked: true,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-sparring-partner',
    name: 'Sparring Partner',
    category: 'playing',
    providerCount: 24,
    image: '/images/Service Catagories/combat sports sparring partner.webp',
    fallbackEmoji: '🥊',
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-coach',
    name: 'Combat Sports Coach',
    category: 'coaching',
    providerCount: 26,
    image: '/images/Service Catagories/combat sports coach.webp',
    fallbackEmoji: '📋',
    mostBooked: true,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-referee',
    name: 'Referee',
    category: 'support',
    providerCount: 14,
    image: '/images/Service Catagories/combat sports referee.webp',
    fallbackEmoji: '🟨',
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-analyst',
    name: 'Analyst',
    category: 'media',
    providerCount: 6,
    image: '/images/Service Catagories/combat sports analyst.webp',
    fallbackEmoji: '📊',
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-commentator',
    name: 'Commentator',
    category: 'media',
    providerCount: 5,
    image: '/images/Service Catagories/combat sports commentator.webp',
    fallbackEmoji: '🎙️',
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-influencer',
    name: 'Influencer',
    category: 'media',
    providerCount: 10,
    image: '/images/Service Catagories/combat sports influencer.webp',
    fallbackEmoji: '📱',
    sport: 'Combat Sports'
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

  return (
    <ClientServicesContext.Provider value={{ services, categories, loading, error, refreshServices }}>
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
