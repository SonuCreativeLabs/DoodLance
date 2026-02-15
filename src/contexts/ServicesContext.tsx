'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  videoUrls?: string[]; // Changed to array to support multiple videos
  type?: 'online' | 'in-person' | 'hybrid';
  features?: string[];
  category?: string;
  skill?: string;
  sport?: string;
}

interface ServicesContextType {
  services: ServicePackage[];
  updateServices: (services: ServicePackage[]) => void;
  addService: (service: ServicePackage) => void;
  removeService: (serviceId: string) => void;
  updateService: (serviceId: string, updates: Partial<ServicePackage>) => void;
  isLoading: boolean;
}

const initialServices: ServicePackage[] = [];

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function ServicesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<ServicePackage[]>(initialServices);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Load from API on mount
  useEffect(() => {
    // Only fetch if authenticated
    if (!isAuthenticated) return;

    const fetchServices = async () => {
      try {
        const response = await fetch('/api/freelancer/services', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [isAuthenticated]);

  const updateServices = useCallback(async (newServices: ServicePackage[]) => {
    setServices(newServices);
  }, []);

  const addService = useCallback(async (service: ServicePackage) => {
    try {
      console.log('🚀 Sending service to API:', service);
      setServices(prev => [...prev, service]); // Optimistic UI

      const response = await fetch('/api/freelancer/services', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Service created successfully:', data);
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, id: data.service.id } : s));
      } else {
        const errorData = await response.json();
        console.error('❌ Service creation failed:', errorData);
        setServices(prev => prev.filter(s => s.id !== service.id));
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setServices(prev => prev.filter(s => s.id !== service.id));
    }
  }, []);

  const removeService = useCallback(async (serviceId: string) => {
    const serviceToRemove = services.find(s => s.id === serviceId);
    if (!serviceToRemove) return;

    setServices(prev => prev.filter(svc => svc.id !== serviceId));

    try {
      const response = await fetch(`/api/freelancer/services/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        setServices(prev => [...prev, serviceToRemove]);
        console.error('Failed to delete service, reverting UI');
      }
    } catch (error) {
      setServices(prev => [...prev, serviceToRemove]);
      console.error('Error removing service:', error);
    }
  }, [services]);

  const updateService = useCallback(async (serviceId: string, updates: Partial<ServicePackage>) => {
    const previousServices = [...services];
    setServices(prev => prev.map(svc => svc.id === serviceId ? { ...svc, ...updates } : svc));

    try {
      const response = await fetch(`/api/freelancer/services/${serviceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        setServices(previousServices);
      }
    } catch (error) {
      setServices(previousServices);
      console.error('Error updating service:', error);
    }
  }, [services]);

  const value: ServicesContextType = {
    services,
    updateServices,
    addService,
    removeService,
    updateService,
    isLoading,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
