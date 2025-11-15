'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  location: string;
  responseTime: string;
  image: string;
  avatar?: string;
  distance: number;
  price: number;
  budget?: number;
  priceUnit: string;
  coords: [number, number]; // [longitude, latitude]
  expertise: string[];
  experience: string;
  description?: string;
}

interface NearbyProfessionalsContextType {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  refreshProfessionals: () => void;
}

const NearbyProfessionalsContext = createContext<NearbyProfessionalsContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
const initialProfessionals: Professional[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "Fast Bowler",
    rating: 4.9,
    reviews: 245,
    completedJobs: 320,
    location: "Chepauk Stadium Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 1.2,
    price: 2500,
    priceUnit: "session",
    coords: [80.2095, 13.0850],
    expertise: ["Pace Bowling", "Yorkers", "Bouncers", "Death Overs", "Line & Length"],
    experience: "8 years"
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Batting Coach",
    rating: 5.0,
    reviews: 312,
    completedJobs: 450,
    location: "T Nagar Cricket Ground",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 2.1,
    price: 3000,
    priceUnit: "session",
    coords: [80.2341, 13.0418],
    expertise: ["Batting Technique", "Shot Selection", "Mental Training", "Fitness"],
    experience: "10 years"
  },
  {
    id: 3,
    name: "Arun Patel",
    service: "Sidearm Specialist",
    rating: 4.8,
    reviews: 189,
    completedJobs: 267,
    location: "Mylapore Cricket Club",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 3.4,
    price: 2200,
    priceUnit: "session",
    coords: [80.2661, 13.0325],
    expertise: ["Sidearm Bowling", "Control", "Variety", "Training"],
    experience: "6 years"
  },
  {
    id: 4,
    name: "Kavita Singh",
    service: "Sports Conditioning",
    rating: 4.9,
    reviews: 156,
    completedJobs: 203,
    location: "Adyar Sports Complex",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 4.2,
    price: 2500,
    priceUnit: "session",
    coords: [80.2565, 13.0064],
    expertise: ["Strength Training", "Agility", "Endurance", "Injury Prevention"],
    experience: "7 years"
  },
  {
    id: 5,
    name: "Suresh Reddy",
    service: "Cricket Analyst",
    rating: 4.7,
    reviews: 98,
    completedJobs: 145,
    location: "Velachery Sports Academy",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 5.8,
    price: 3500,
    priceUnit: "analysis",
    coords: [80.2206, 12.9758],
    expertise: ["Match Analysis", "Player Stats", "Strategy", "Video Analysis"],
    experience: "5 years"
  }
];

export function NearbyProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setProfessionals(initialProfessionals);
    } catch (err) {
      setError('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshProfessionals();
  }, []);

  const value = {
    professionals,
    loading,
    error,
    refreshProfessionals
  };

  return (
    <NearbyProfessionalsContext.Provider value={value}>
      {children}
    </NearbyProfessionalsContext.Provider>
  );
}

export function useNearbyProfessionals() {
  const context = useContext(NearbyProfessionalsContext);
  if (context === undefined) {
    throw new Error('useNearbyProfessionals must be used within a NearbyProfessionalsProvider');
  }
  return context;
}
