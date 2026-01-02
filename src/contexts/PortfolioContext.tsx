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

  // Save to Supabase helper
  const supabase = createClient();

  // Load from Supabase on mount
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const saved = localStorage.getItem('portfolioItems');
        if (saved) {
          setPortfolio(JSON.parse(saved));
        }

        const response = await fetch('/api/freelancer/portfolio');
        if (!response.ok) {
          console.error('Failed to fetch portfolio API');
          return;
        }

        const { portfolio: dbPortfolio } = await response.json();

        if (dbPortfolio) {
          const mapped = dbPortfolio.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            image: item.images, // API returns directly what's in DB
            skills: typeof item.skills === 'string' ? item.skills.split(',') : (Array.isArray(item.skills) ? item.skills : [])
          }));
          setPortfolio(mapped);
          localStorage.setItem('portfolioItems', JSON.stringify(mapped));
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchPortfolio();
  }, []);

  const addPortfolioItem = useCallback(async (item: PortfolioItem) => {
    setPortfolio(prev => [...prev, item]);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('freelancer_profiles')
          .select('id')
          .eq('userId', user.id)
          .maybeSingle();

        if (profile) {
          await supabase.from('portfolios').insert({
            profileId: profile.id,
            title: item.title,
            category: item.category,
            description: item.description,
            images: item.image,
            skills: Array.isArray(item.skills) ? item.skills.join(',') : item.skills
          });
        }
      }
    } catch (e) {
      console.error("Failed to add portfolio item", e);
    }
  }, []);

  const removePortfolioItem = useCallback(async (itemId: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== itemId));
    try {
      const supabase = createClient();
      await supabase.from('portfolios').delete().eq('id', itemId);
    } catch (e) {
      console.error("Failed to delete portfolio item", e);
    }
  }, []);

  const updatePortfolioItem = useCallback(async (itemId: string, updates: Partial<PortfolioItem>) => {
    setPortfolio(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
    try {
      const supabase = createClient();
      const updateData: any = { ...updates };
      if (updates.image) updateData.images = updates.image;
      if (updates.skills) updateData.skills = Array.isArray(updates.skills) ? updates.skills.join(',') : updates.skills;

      await supabase.from('portfolios').update(updateData).eq('id', itemId);
    } catch (e) {
      console.error("Failed to update portfolio item", e);
    }
  }, []);

  const updatePortfolio = useCallback((items: PortfolioItem[]) => {
    setPortfolio(items);
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
