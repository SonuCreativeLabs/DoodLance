'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PopularService {
  id: string;
  title: string;
  icon: string;
  providerCount: number;
  image: string;
  mostBooked: boolean;
  sport?: string;
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
  // Cricket Services
  {
    id: 'net-bowler',
    title: 'Net Bowler',
    icon: '🎯',
    providerCount: 156,
    image: '/images/Service Catagories/cricket net bowler.jpeg',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'sidearm-thrower',
    title: 'Sidearm Thrower',
    icon: '💪',
    providerCount: 34,
    image: '/images/Service Catagories/cricket sidearm.png',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'cricket-coach',
    title: 'Cricket Coach',
    icon: '🏏',
    providerCount: 120,
    image: '/images/Service Catagories/Cricket coach.png',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'physio',
    title: 'Sports Physio',
    icon: '👨‍⚕️',
    providerCount: 28,
    image: '/images/Service Catagories/cricket physio.png',
    mostBooked: false,
    sport: 'Cricket'
  },
  {
    id: 'umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 45,
    image: '/images/Service Catagories/cricket umpire.png',
    mostBooked: true,
    sport: 'Cricket'
  },
  {
    id: 'scorer',
    title: 'Scorer',
    icon: '📝',
    providerCount: 89,
    image: '/images/Service Catagories/cricket scorer.png',
    mostBooked: false,
    sport: 'Cricket'
  },
  {
    id: 'commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 12,
    image: '/images/Service Catagories/cricket commentator.png',
    mostBooked: false,
    sport: 'Cricket'
  },

  // Football Services
  {
    id: 'football-match-player',
    title: 'Match Player',
    icon: '⚽',
    providerCount: 45,
    image: '/images/Service Catagories/football match player.png',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-training-partner',
    title: 'Training Partner',
    icon: '⚽',
    providerCount: 22,
    image: '/images/Service Catagories/football training partner.png',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-coach',
    title: 'Football Coach',
    icon: '📋',
    providerCount: 32,
    image: '/images/Service Catagories/football coach.png',
    mostBooked: true,
    sport: 'Football'
  },
  {
    id: 'football-referee',
    title: 'Referee',
    icon: '🟨',
    providerCount: 15,
    image: '/images/Service Catagories/football referee.png',
    mostBooked: false,
    sport: 'Football'
  },
  {
    id: 'football-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 8,
    image: '/images/Service Catagories/football analyst.png',
    mostBooked: false,
    sport: 'Football'
  },
  {
    id: 'football-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 5,
    image: '/images/Service Catagories/football commentator.png',
    mostBooked: false,
    sport: 'Football'
  },
  {
    id: 'football-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 12,
    image: '/images/Service Catagories/football influencer.png',
    mostBooked: false,
    sport: 'Football'
  },

  // Badminton Services
  {
    id: 'badminton-match-player',
    title: 'Match Player',
    icon: '🏸',
    providerCount: 34,
    image: '/images/Service Catagories/badminton match player.png',
    mostBooked: true,
    sport: 'Badminton'
  },
  {
    id: 'badminton-practice-partner',
    title: 'Practice Partner',
    icon: '🏸',
    providerCount: 28,
    image: '/images/Service Catagories/badminton practice partner.png',
    mostBooked: false,
    sport: 'Badminton'
  },
  {
    id: 'badminton-coach',
    title: 'Badminton Coach',
    icon: '📋',
    providerCount: 45,
    image: '/images/Service Catagories/badminton coach.png',
    mostBooked: true,
    sport: 'Badminton'
  },
  {
    id: 'badminton-umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 12,
    image: '/images/Service Catagories/badminton umpire.png',
    mostBooked: false,
    sport: 'Badminton'
  },
  {
    id: 'badminton-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 8,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Badminton'
  },
  {
    id: 'badminton-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 5,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac618?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Badminton'
  },
  {
    id: 'badminton-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 12,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Badminton'
  },

  // Tennis Services
  {
    id: 'tennis-match-player',
    title: 'Match Player',
    icon: '🎾',
    providerCount: 30,
    image: '/images/Service Catagories/tennis match player.png',
    mostBooked: true,
    sport: 'Tennis'
  },
  {
    id: 'tennis-practice-partner',
    title: 'Practice Partner',
    icon: '🎾',
    providerCount: 25,
    image: '/images/Service Catagories/tennis practice partner.png',
    mostBooked: false,
    sport: 'Tennis'
  },
  {
    id: 'tennis-coach',
    title: 'Tennis Coach',
    icon: '📋',
    providerCount: 40,
    image: 'https://images.unsplash.com/photo-1626154628424-666324976c66?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Tennis'
  },
  {
    id: 'tennis-umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 15,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Tennis'
  },
  {
    id: 'tennis-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 6,
    image: 'https://images.unsplash.com/photo-1531685218883-29a721329fb8?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Tennis'
  },
  {
    id: 'tennis-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 4,
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Tennis'
  },
  {
    id: 'tennis-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 10,
    image: 'https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Tennis'
  },

  // Basketball Services
  {
    id: 'basketball-match-player',
    title: 'Match Player',
    icon: '🏀',
    providerCount: 40,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Basketball'
  },
  {
    id: 'basketball-practice-partner',
    title: 'Practice Partner',
    icon: '🏀',
    providerCount: 30,
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Basketball'
  },
  {
    id: 'basketball-coach',
    title: 'Basketball Coach',
    icon: '📋',
    providerCount: 35,
    image: 'https://images.unsplash.com/photo-1448387473223-5c37445527e7?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Basketball'
  },
  {
    id: 'basketball-referee',
    title: 'Referee',
    icon: '🟨',
    providerCount: 20,
    image: 'https://images.unsplash.com/photo-1595186937579-2708323a6369?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Basketball'
  },
  {
    id: 'basketball-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 10,
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3853247?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Basketball'
  },
  {
    id: 'basketball-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 6,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Basketball'
  },
  {
    id: 'basketball-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 15,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Basketball'
  },

  // Padel Services
  {
    id: 'padel-match-player',
    title: 'Match Player',
    icon: '🎾',
    providerCount: 25,
    image: 'https://plus.unsplash.com/premium_photo-1681832626188-7253d82f254b?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Padel'
  },
  {
    id: 'padel-practice-partner',
    title: 'Practice Partner',
    icon: '🎾',
    providerCount: 20,
    image: 'https://plus.unsplash.com/premium_photo-1681832626188-7253d82f254b?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Padel'
  },
  {
    id: 'padel-coach',
    title: 'Padel Coach',
    icon: '📋',
    providerCount: 15,
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae513ea?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Padel'
  },
  {
    id: 'padel-umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 8,
    image: 'https://images.unsplash.com/photo-1589315415701-d77d704944d5?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Padel'
  },
  {
    id: 'padel-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 4,
    image: 'https://images.unsplash.com/photo-1663185564858-6927d6d54d24?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Padel'
  },
  {
    id: 'padel-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 3,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Padel'
  },
  {
    id: 'padel-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 8,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Padel'
  },

  // Pickleball Services
  {
    id: 'pickleball-match-player',
    title: 'Match Player',
    icon: '🏓',
    providerCount: 28,
    image: 'https://images.unsplash.com/photo-1626242858807-6a4a1651556e?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-practice-partner',
    title: 'Practice Partner',
    icon: '🏓',
    providerCount: 22,
    image: 'https://images.unsplash.com/photo-1626242858807-6a4a1651556e?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-coach',
    title: 'Pickleball Coach',
    icon: '📋',
    providerCount: 18,
    image: 'https://images.unsplash.com/photo-1591123720664-323631489606?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-referee',
    title: 'Referee',
    icon: '☝️',
    providerCount: 10,
    image: 'https://images.unsplash.com/photo-1529668383828-5929656efda4?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 5,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 3,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac618?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Pickleball'
  },
  {
    id: 'pickleball-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 8,
    image: 'https://images.unsplash.com/photo-1611162617472-c28b63183b8c?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Pickleball'
  },

  // Table Tennis Services  
  {
    id: 'table-tennis-match-player',
    title: 'Match Player',
    icon: '🏓',
    providerCount: 25,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-practice-partner',
    title: 'Practice Partner',
    icon: '🏓',
    providerCount: 20,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-coach',
    title: 'Table Tennis Coach',
    icon: '📋',
    providerCount: 18,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-umpire',
    title: 'Umpire',
    icon: '☝️',
    providerCount: 10,
    image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 5,
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3853247?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 3,
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Table Tennis'
  },
  {
    id: 'table-tennis-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 6,
    image: 'https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Table Tennis'
  },


  // Combat Sports Services
  {
    id: 'combat-sports-fighter',
    title: 'Fighter',
    icon: '🥊',
    providerCount: 28,
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-sparring-partner',
    title: 'Sparring Partner',
    icon: '🥊',
    providerCount: 24,
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-coach',
    title: 'Combat Sports Coach',
    icon: '📋',
    providerCount: 26,
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop',
    mostBooked: true,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-referee',
    title: 'Referee',
    icon: '🟨',
    providerCount: 14,
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-analyst',
    title: 'Analyst',
    icon: '📊',
    providerCount: 6,
    image: 'https://images.unsplash.com/photo-1531685218883-29a721329fb8?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-commentator',
    title: 'Commentator',
    icon: '🎙️',
    providerCount: 5,
    image: 'https://images.unsplash.com/photo-1521345995540-1e5f84fc4763?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Combat Sports'
  },
  {
    id: 'combat-sports-influencer',
    title: 'Influencer',
    icon: '📱',
    providerCount: 10,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    mostBooked: false,
    sport: 'Combat Sports'
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

  return (
    <PopularServicesContext.Provider value={{ popularServices, loading, error, refreshServices }}>
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
