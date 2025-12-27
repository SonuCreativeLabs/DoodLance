'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { professionals as mockProfessionals } from '@/app/client/nearby/mockData';

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

// Use professionals from mockData - this would typically come from an API
const initialProfessionals: Professional[] = mockProfessionals as Professional[];

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

      // If API returns data, use it. Otherwise fallback to mock data combined (or just mock data if production requires specific behavior, but here we want real data)
      // Actually, let's mix them or prefer real data.
      // For now, let's assume the API returns the correct structure.
      // We'll merge real data with typical mock data structure if needed, or just use real data.

      // Note: The API might return a different shape, so we might need mapping.
      // But assuming /api/freelancers returns similar shape or we map it.
      // Let's assume the keys match for now or we map them.

      if (data && Array.isArray(data)) {
        setProfessionals(data); // Assuming API returns compatible Professional[]
      } else {
        // Fallback to mock if API returns empty/invalid
        setProfessionals(initialProfessionals);
      }

    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError('Failed to load professionals');
      setProfessionals(initialProfessionals); // Fallback
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
