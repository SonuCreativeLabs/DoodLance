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
  area?: string;
  city?: string;
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
  refreshProfessionals: (lat?: number, lng?: number) => void;
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

  const refreshProfessionals = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (lat) params.append('lat', lat.toString());
      if (lng) params.append('lng', lng.toString());

      const queryString = params.toString();
      const url = `/api/freelancers${queryString ? `?${queryString}` : ''}`;

      // Fetch from API
      const response = await fetch(url);
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
    // Get location first, then fetch
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✅ Geolocation success:', { latitude, longitude });
          refreshProfessionals(latitude, longitude);
        },
        (error) => {
          console.warn('⚠️ Geolocation error:', error.message);
          // Still try to fetch - API will use coordinates from request or default
          refreshProfessionals();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased from 5000ms to 10000ms
          maximumAge: 60000 // Use cached location up to 1 minute old
        }
      );
    } else {
      console.warn('⚠️ Geolocation not available');
      refreshProfessionals();
    }
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
