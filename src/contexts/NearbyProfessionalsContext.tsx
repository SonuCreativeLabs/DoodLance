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
  currentCoordinates: { lat: number; lng: number } | null;
  currentLocation: { city: string; state: string } | null;
  refreshProfessionals: (lat?: number, lng?: number) => void;
  updateLocation: (lat: number, lng: number, city: string, state: string) => void;
}

const NearbyProfessionalsContext = createContext<NearbyProfessionalsContextType | undefined>(undefined);

// Create a default value for SSR
const defaultValue: NearbyProfessionalsContextType = {
  professionals: [],
  loading: false,
  error: null,
  currentCoordinates: null,
  currentLocation: null,
  refreshProfessionals: () => { },
  updateLocation: () => { }
};

// Initial state
// Data import removed
const initialProfessionals: Professional[] = [];

export function NearbyProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ city: string; state: string } | null>(null);

  const refreshProfessionals = async (lat?: number, lng?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (lat && lng) {
        params.append('lat', lat.toString());
        params.append('lng', lng.toString());
        setCurrentCoordinates({ lat, lng });
      }

      const queryString = params.toString();
      const url = `/api/freelancers${queryString ? `?${queryString}` : ''}`;

      // Fetch from API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }
      const data = await response.json();

      if (data && Array.isArray(data)) {
        console.log(`✅ Loaded ${data.length} professionals. First:`, data[0]?.name, 'Dist:', data[0]?.distance);
        setProfessionals(data);
      } else {
        setProfessionals([]);
      }

    } catch (err) {
      console.error('Error fetching professionals:', err);
      setError('Failed to load professionals');
      // Do not clear professionals on error, keep previous data if any
      if (professionals.length === 0) {
        setProfessionals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = (lat: number, lng: number, city: string, state: string) => {
    console.log('📍 updateLocation called:', { lat, lng, city, state });
    setCurrentCoordinates({ lat, lng });
    setCurrentLocation({ city, state });
    refreshProfessionals(lat, lng);
  };

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=neighborhood,locality,place,region`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const neighborhood = data.features.find((f: any) => f.place_type.includes('neighborhood'));
        const locality = data.features.find((f: any) => f.place_type.includes('locality'));
        const place = data.features.find((f: any) => f.place_type.includes('place'));
        const region = data.features.find((f: any) => f.place_type.includes('region'));

        const areaName = neighborhood?.text || locality?.text || place?.text || "Unknown Location";
        const cityName = place?.text || region?.text || "";

        return { city: areaName, state: cityName };
      }
      return { city: "Location not found", state: "" };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { city: "Error", state: "" };
    }
  };

  useEffect(() => {
    // Get location first, then fetch
    // Get location first, then fetch
    // Only fetch if we don't have coordinates yet (prevents reset on navigation)
    if (!currentCoordinates && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('✅ Geolocation success:', { latitude, longitude });

          // Reverse geocode to get city/state
          const locationData = await reverseGeocode(latitude, longitude);

          setCurrentCoordinates({ lat: latitude, lng: longitude });
          setCurrentLocation(locationData);
          refreshProfessionals(latitude, longitude);
        },
        (error) => {
          console.warn('⚠️ Geolocation error:', error.message);
          // Still try to fetch - API will use coordinates from request or default
          refreshProfessionals();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else if (!currentCoordinates) {
      console.warn('⚠️ Geolocation not available');
      refreshProfessionals();
    }
    // If coordinates exist, we do nothing - preserving state
  }, []);

  const value = {
    professionals,
    loading,
    error,
    currentCoordinates,
    currentLocation,
    refreshProfessionals,
    updateLocation
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
