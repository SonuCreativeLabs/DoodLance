'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  skills?: string[];
  url?: string;
}

interface PortfolioContextType {
  portfolio: PortfolioItem[];
  isHydrated: boolean;
  updatePortfolio: (items: PortfolioItem[]) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  updatePortfolioItem: (itemId: string, updates: Partial<PortfolioItem>) => void;
}

const initialPortfolio: PortfolioItem[] = [];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [isHydrated, setIsHydrated] = useState(false);

  const updatePortfolio = useCallback((items: PortfolioItem[]) => {
    setPortfolio(items);
  }, []);

  const addPortfolioItem = useCallback((item: PortfolioItem) => {
    setPortfolio(prev => [...prev, item]);
  }, []);

  const removePortfolioItem = useCallback((itemId: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updatePortfolioItem = useCallback((itemId: string, updates: Partial<PortfolioItem>) => {
    setPortfolio(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const saved = localStorage.getItem('portfolioItems');
        if (saved) {
          setPortfolio(JSON.parse(saved));
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('portfolio')
            .eq('userId', user.id)
            .maybeSingle();

          if (profile && profile.portfolio) {
            // Parse if stored as string, or use directly if JSON
            let dbPortfolio = profile.portfolio;
            if (typeof dbPortfolio === 'string') {
              try { dbPortfolio = JSON.parse(dbPortfolio); } catch (e) { }
            }
            if (Array.isArray(dbPortfolio)) {
              setPortfolio(dbPortfolio);
              localStorage.setItem('portfolioItems', JSON.stringify(dbPortfolio));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchPortfolio();
  }, []);

  // Save to localStorage whenever it changes (skip first paint to avoid overwriting saved data)
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('portfolioItems', JSON.stringify(portfolio));
  }, [portfolio, isHydrated]);

  const value: PortfolioContextType = {
    portfolio,
    isHydrated,
    updatePortfolio,
    addPortfolioItem,
    removePortfolioItem,
    updatePortfolioItem,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
