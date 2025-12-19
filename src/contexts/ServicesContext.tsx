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

const initialServices: ServicePackage[] = [
  {
    id: '1',
    title: 'Net Bowling Sessions',
    description: 'Professional net bowling sessions with personalized coaching',
    price: '₹500',
    type: 'online',
    deliveryTime: '1 hour',
    features: [
      '1-hour net session',
      'Ball analysis',
      'Technique improvement',
      'Q&A session'
    ],
    category: 'Net Bowler'
  },
  {
    id: '2',
    title: 'Match Player',
    description: 'Professional match player ready to play for your team per match',
    price: '₹1,500',
    type: 'in-person',
    deliveryTime: 'Per match',
    features: [
      'Full match participation',
      'Team contribution',
      'Match commitment',
      'Performance guarantee'
    ],
    category: 'Match Player'
  },
  {
    id: '3',
    title: 'Match Videography',
    description: 'Professional match videography and reel content creation during games',
    price: '₹800',
    type: 'in-person',
    deliveryTime: 'Same day',
    features: [
      'Full match recording',
      'Highlight reel creation',
      'Social media content',
      'Priority editing'
    ],
    category: 'Cricket Photo / Videography'
  },
  {
    id: '4',
    title: 'Sidearm Bowling',
    description: 'Professional sidearm bowler delivering 140km/h+ speeds for practice sessions',
    price: '₹1,500',
    type: 'in-person',
    deliveryTime: 'per hour',
    features: [
      '140km/h+ sidearm bowling',
      'Practice session delivery',
      'Consistent speed & accuracy',
      'Training session support'
    ],
    category: 'Sidearm specialist'
  },
  {
    id: '5',
    title: 'Batting Coaching',
    description: 'Professional batting technique training and skill development',
    price: '₹1,200',
    type: 'in-person',
    deliveryTime: 'per hour',
    features: [
      'Batting technique analysis',
      'Footwork drills',
      'Shot selection training',
      'Mental preparation coaching'
    ],
    category: 'Batting coach'
  },
  {
    id: '6',
    title: 'Performance Analysis',
    description: 'Comprehensive cricket performance analysis and improvement recommendations',
    price: '₹2,000',
    type: 'online',
    deliveryTime: '2-3 weeks',
    features: [
      'Match statistics review',
      'Strength/weakness analysis',
      'Improvement recommendations',
      'Progress tracking'
    ],
    category: 'Analyst'
  }
];

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServicePackage[]>(initialServices);
  const hasHydrated = useRef(false);

  const updateServices = useCallback((newServices: ServicePackage[]) => {
    setServices(newServices);
  }, []);

  const addService = useCallback((service: ServicePackage) => {
    setServices(prev => [...prev, service]);
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setServices(prev => prev.filter(svc => svc.id !== serviceId));
  }, []);

  const updateService = useCallback((serviceId: string, updates: Partial<ServicePackage>) => {
    setServices(prev => prev.map(svc => 
      svc.id === serviceId ? { ...svc, ...updates } : svc
    ));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('services');
      if (saved) {
        setServices(JSON.parse(saved));
      } else {
        // Fallback: hydrate from legacy 'userPackages' if present
        const legacy = localStorage.getItem('userPackages');
        if (legacy) {
          try {
            const pkgArr = JSON.parse(legacy);
            if (Array.isArray(pkgArr)) {
              const mapped = pkgArr.map((pkg: any) => ({
                id: String(pkg.id ?? crypto.randomUUID?.() ?? Date.now().toString()),
                title: String(pkg.name ?? pkg.title ?? 'Package'),
                description: String(pkg.description ?? ''),
                price: String(pkg.price ?? '' ).startsWith('₹') ? String(pkg.price) : `₹${pkg.price ?? ''}`,
                deliveryTime: String(pkg.deliveryTime ?? ''),
                features: Array.isArray(pkg.features) ? pkg.features : [],
                type: pkg.type === 'online' || pkg.type === 'in-person' || pkg.type === 'hybrid' ? pkg.type : undefined,
                category: pkg.category,
                skill: pkg.skill,
              })) as ServicePackage[];
              setServices(mapped);
            }
          } catch (e) {
            console.error('Failed to parse legacy userPackages:', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse services:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever it changes (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

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
