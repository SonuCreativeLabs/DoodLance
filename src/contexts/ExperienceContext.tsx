'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

interface ExperienceContextType {
  experiences: Experience[];
  updateExperiences: (experiences: Experience[]) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (experienceId: string) => void;
  updateExperience: (experienceId: string, updates: Partial<Experience>) => void;
  hydrated: boolean;
}

const initialExperiences: Experience[] = [
  {
    id: '1',
    role: 'Cricketer (All-Rounder)',
    company: 'Professional Cricket',
    location: 'India',
    startDate: '2015-01-01',
    endDate: undefined,
    isCurrent: true,
    description: 'Professional cricketer specializing in top-order batting and off-spin bowling. Experienced in high-pressure matches with a focus on building strong team performances.'
  },
  {
    id: '2',
    role: 'Cricket Performance Consultant',
    company: 'Freelance Cricket Services',
    location: 'India',
    startDate: '2020-01-01',
    endDate: undefined,
    isCurrent: true,
    description: 'Providing cricket performance analysis and consulting services. Specializing in match strategy, player development, and team performance optimization. Working with clubs and individual players to enhance their cricket skills and competitive edge.'
  },
  {
    id: '3',
    role: 'Cricket Coach',
    company: 'Local Academy',
    location: 'India',
    startDate: '2018-01-01',
    endDate: '2020-12-31',
    isCurrent: false,
    description: 'Coached young cricketers in batting techniques, bowling skills, and match strategies. Helped develop the next generation of cricket talent with a focus on both technical skills and mental toughness.'
  }
];

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const hasHydrated = useRef(false);

  const updateExperiences = useCallback((newExperiences: Experience[]) => {
    setExperiences(newExperiences);
  }, []);

  const addExperience = useCallback((experience: Experience) => {
    setExperiences(prev => [...prev, experience]);
  }, []);

  const removeExperience = useCallback((experienceId: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
  }, []);

  const updateExperience = useCallback((experienceId: string, updates: Partial<Experience>) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === experienceId ? { ...exp, ...updates } : exp
    ));
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('experiences');
      if (saved) {
        setExperiences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to parse experiences:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever it changes (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('experiences', JSON.stringify(experiences));
  }, [experiences]);

  const value: ExperienceContextType = {
    experiences,
    updateExperiences,
    addExperience,
    removeExperience,
    updateExperience,
    hydrated: hasHydrated.current,
  };

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
