'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


export interface Professional {
  id: string | number;
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
  cricketRole?: string;

  // Additional fields
  services?: {
    id: string;
    title: string;
    description?: string;
    price: string | number;
    deliveryTime?: string;
    features?: string[];
    category?: string;
  }[];
  availability?: {
    day: string;
    available: boolean;
  }[];
  portfolio?: any[];
  reviewsData?: any[];
}

interface NearbyProfessionalsContextType {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  refreshProfessionals: () => void;
}

const NearbyProfessionalsContext = createContext<NearbyProfessionalsContextType | undefined>(undefined);

// Create a default value for SSR
const defaultValue: NearbyProfessionalsContextType = {
  professionals: [],
  loading: false,
  error: null,
  refreshProfessionals: () => { }
};

// Initial state
// Data import removed
const initialProfessionals: Professional[] = [];

export function NearbyProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from API
      const response = await fetch('/api/freelancers');
      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setProfessionals(data);
      } else {
        setProfessionals([]);
      }

    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError('Failed to load professionals');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    // Return default value for SSR or when context is not available
    return defaultValue;
  }
  return context;
}
