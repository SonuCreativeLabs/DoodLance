'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

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
  updatePortfolio: (items: PortfolioItem[]) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  updatePortfolioItem: (itemId: string, updates: Partial<PortfolioItem>) => void;
}

const initialPortfolio: PortfolioItem[] = [
  {
    id: '1',
    title: '3x Division Cricket Champion',
    category: 'Cricket Achievement',
    description: 'Won the Division Level Cricket Tournament three consecutive years (2020, 2021, 2022) as a top-order batsman and off-spin bowler. Demonstrated exceptional leadership and performance under pressure.',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    skills: ['Cricket', 'Leadership', 'Batting', 'Off-Spin Bowling', 'Team Player']
  },
  {
    id: '2',
    title: 'State Level College Champion',
    category: 'Cricket Achievement',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Led college team to victory in the State Level Inter-College Cricket Tournament. Scored 3 consecutive half-centuries in the knockout stages and took crucial wickets in the final match.',
    skills: ['Cricket', 'Strategy', 'Batting', 'Bowling']
  },
  {
    id: '3',
    title: 'Sports Quota Scholar',
    category: 'Academic Achievement',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Awarded sports scholarship for outstanding cricket performance at the state level. Balanced academic responsibilities with rigorous training schedules while maintaining excellent performance in both areas.',
    skills: ['Cricket', 'Time Management', 'Academics']
  },
  {
    id: '4',
    title: 'Cricket Performance Analytics',
    category: 'Cricket Analytics',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Developed comprehensive cricket performance analytics tracking player statistics, match data, and performance metrics. Created detailed reports for coaches and players to improve game strategies.',
    skills: ['Cricket Analytics', 'Performance Metrics', 'Data Analysis', 'Strategy']
  },
  {
    id: '5',
    title: 'Live Cricket Scoring System',
    category: 'Cricket Technology',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Built a real-time cricket scoring platform that tracks live match statistics, player performance, and generates comprehensive match reports. Used by local cricket clubs for tournament management.',
    skills: ['Cricket Scoring', 'Live Analytics', 'Match Management', 'Data Visualization']
  }
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const hasHydrated = useRef(false);

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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolioItems');
      if (saved) {
        setPortfolio(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to parse portfolio:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever it changes (skip first paint to avoid overwriting saved data)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('portfolioItems', JSON.stringify(portfolio));
  }, [portfolio]);

  const value: PortfolioContextType = {
    portfolio,
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
