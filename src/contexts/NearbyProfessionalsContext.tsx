'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

const SESSION_KEY = 'bails_user_location';


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
  mainSport?: string;
  otherSports?: string[];
  username?: string;

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
  reviewsData?: unknown[];
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


export function NearbyProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ city: string; state: string } | null>(null);
  // Tracks whether the user explicitly set a location (prevents geolocation from overriding it)
  const userSetLocationRef = useRef(false);

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
    // Mark that user explicitly set a location — prevent geolocation from overriding
    userSetLocationRef.current = true;
    // Persist to sessionStorage so it survives navigation within the same session
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ lat, lng, city, state }));
    } catch (e) { /* ignore */ }
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
    // Step 1: If user previously set a location manually in this session, restore it and skip geolocation
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const { lat, lng, city, state } = JSON.parse(saved);
        console.log('📍 Restoring user-set location from session:', { lat, lng, city, state });
        userSetLocationRef.current = true;
        setCurrentCoordinates({ lat, lng });
        setCurrentLocation({ city, state });
        refreshProfessionals(lat, lng);
        return; // Don't auto-geolocate — honour the user's manual choice
      }
    } catch (e) { /* ignore */ }

    // Step 2: Auto-geolocate only if user hasn't manually picked a location
    if (!currentCoordinates && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Don't override if user set location between the time we called getCurrentPosition and it resolved
          if (userSetLocationRef.current) return;
          const { latitude, longitude } = position.coords;
          console.log('✅ Geolocation success:', { latitude, longitude });

          const locationData = await reverseGeocode(latitude, longitude);
          setCurrentCoordinates({ lat: latitude, lng: longitude });
          setCurrentLocation(locationData);
          refreshProfessionals(latitude, longitude);
        },
        (error) => {
          if (userSetLocationRef.current) return;
          console.warn('⚠️ Geolocation error:', error.message);

          // Default to Chennai, India if location access is denied or fails
          const fallbackLat = 13.0827;
          const fallbackLng = 80.2707;
          console.log('Using default location (Chennai, India):', { lat: fallbackLat, lng: fallbackLng });

          setCurrentCoordinates({ lat: fallbackLat, lng: fallbackLng });
          setCurrentLocation({ city: 'Chennai', state: 'Tamil Nadu' });
          refreshProfessionals(fallbackLat, fallbackLng);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else if (!currentCoordinates) {
      if (userSetLocationRef.current) return;
      console.warn('⚠️ Geolocation not available on device');
      const fallbackLat = 13.0827;
      const fallbackLng = 80.2707;
      setCurrentCoordinates({ lat: fallbackLat, lng: fallbackLng });
      setCurrentLocation({ city: 'Chennai', state: 'Tamil Nadu' });
      refreshProfessionals(fallbackLat, fallbackLng);
    }
    // If coordinates already exist, do nothing — preserving state
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
