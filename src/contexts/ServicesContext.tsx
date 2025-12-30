'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  type?: 'online' | 'in-person' | 'hybrid';
  features?: string[];
  category?: string;
  skill?: string;
}

interface ServicesContextType {
  services: ServicePackage[];
  updateServices: (services: ServicePackage[]) => void;
  addService: (service: ServicePackage) => void;
  removeService: (serviceId: string) => void;
  updateService: (serviceId: string, updates: Partial<ServicePackage>) => void;
}

const initialServices: ServicePackage[] = [];

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServicePackage[]>(initialServices);
  const [isHydrated, setIsHydrated] = useState(false);
  const supabase = createClient();

  const updateServices = useCallback(async (newServices: ServicePackage[]) => {
    // This method is less useful now that we have individual CRUD.
    // If used for reordering, we need an endpoint.
    // For now, we'll just set local state.
    setServices(newServices);
  }, []);

  const addService = useCallback(async (service: ServicePackage) => {
    try {
      setServices(prev => [...prev, service]); // Optimistic UI

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace the optimistic one (with temp ID) with real one
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, id: data.service.id } : s));
      } else {
        // Revert on failure
        setServices(prev => prev.filter(s => s.id !== service.id));
        console.error('Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setServices(prev => prev.filter(s => s.id !== service.id));
    }
  }, []);

  const removeService = useCallback(async (serviceId: string) => {
    // Optimistic
    const previousServices = [...services];
    setServices(prev => prev.filter(svc => svc.id !== serviceId));

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setServices(previousServices); // Revert
      }
    } catch (error) {
      setServices(previousServices); // Revert
      console.error('Error removing service:', error);
    }
  }, [services]);

  const updateService = useCallback(async (serviceId: string, updates: Partial<ServicePackage>) => {
    // Optimistic
    const previousServices = [...services];
    setServices(prev => prev.map(svc => svc.id === serviceId ? { ...svc, ...updates } : svc));

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        setServices(previousServices); // Revert
      }
    } catch (error) {
      setServices(previousServices); // Revert
      console.error('Error updating service:', error);
    }
  }, [services]);

  // Load from API on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services'); // Fetches for current user by default
        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchServices();
  }, []);

  // Removed localStorage usage completely

  const value: ServicesContextType = {
    services,
    updateServices,
    addService,
    removeService,
    updateService,
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
