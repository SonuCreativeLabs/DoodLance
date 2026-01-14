'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Experience {
  id: string;
  title: string;
  company: string;
}

interface ExperienceContextType {
  experiences: Experience[];
  updateExperiences: (experiences: Experience[]) => void;
  addExperience: (experience: Experience) => void;
  removeExperience: (experienceId: string) => void;
  updateExperience: (experienceId: string, updates: Partial<Experience>) => void;
  hydrateExperiences: (experiences: Experience[]) => void;
  hydrated: boolean;
  isLoading: boolean;
}

const initialExperiences: Experience[] = [];

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export interface ExperienceProviderProps {
  children: ReactNode;
  skipInitialFetch?: boolean;
}

export function ExperienceProvider({ children, skipInitialFetch = false }: ExperienceProviderProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const hydrateExperiences = useCallback((newExperiences: Experience[]) => {
    setExperiences(newExperiences);
    setIsLoading(false);
  }, []);

  // Load from Supabase on mount
  useEffect(() => {
    if (skipInitialFetch) return;

    const fetchExperiences = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/freelancer/experience');
        if (response.ok) {
          const data = await response.json();
          const dbExperiences = data.achievements;

          if (Array.isArray(dbExperiences)) {
            const mapped = dbExperiences.map((exp: any) => ({
              id: exp.id,
              title: exp.title,
              company: exp.company
            }));
            setExperiences(mapped);
          } else {
            // If achievements key is missing or not array, try legacy or default empty
            setExperiences([]);
          }
        }
      } catch (error) {
        console.error('Failed to load experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, [skipInitialFetch]);

  const addExperience = useCallback(async (experience: Experience) => {
    setExperiences(prev => [...prev, experience]);

    try {
      await fetch('/api/freelancer/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: experience.title,
          company: experience.company
        })
      });
    } catch (e) {
      console.error("Failed to add experience", e);
    }
  }, []);

  const removeExperience = useCallback(async (experienceId: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
    try {
      await fetch(`/api/freelancer/experience?id=${experienceId}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete experience", e);
    }
  }, []);

  const updateExperience = useCallback(async (experienceId: string, updates: Partial<Experience>) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === experienceId ? { ...exp, ...updates } : exp
    ));
    try {
      await fetch('/api/freelancer/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: experienceId, ...updates })
      });
    } catch (e) {
      console.error("Failed to update experience", e);
    }
  }, []);

  const updateExperiences = useCallback((newExperiences: Experience[]) => {
    setExperiences(newExperiences);
  }, []);

  // Save to localStorage whenever it changes (skip first paint)
  // No localStorage side effects needed. Data is persisted to DB.

  const value: ExperienceContextType = {
    experiences,
    updateExperiences,
    addExperience,
    removeExperience,
    updateExperience,
    hydrateExperiences,
    hydrated: !isLoading,
    isLoading,
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
