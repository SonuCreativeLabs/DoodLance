'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

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

const initialExperiences: Experience[] = [];

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const hasHydrated = useRef(false);
  const supabase = createClient();

  // Load from Supabase on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/freelancer/experience');
        if (response.ok) {
          const { experiences: dbExperiences } = await response.json();
          if (dbExperiences && dbExperiences.length > 0) {
            const mapped = dbExperiences.map((exp: any) => ({
              id: exp.id,
              role: exp.title,
              company: exp.company,
              location: exp.location,
              startDate: exp.startDate,
              endDate: exp.endDate,
              isCurrent: exp.current,
              description: exp.description
            }));
            setExperiences(mapped);
          }
        }
      } catch (error) {
        console.error('Failed to load experiences:', error);
      } finally {
        hasHydrated.current = true;
      }
    };

    fetchExperiences();
  }, []);

  const addExperience = useCallback(async (experience: Experience) => {
    setExperiences(prev => [...prev, experience]);

    try {
      await fetch('/api/freelancer/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: experience.role,
          company: experience.company,
          location: experience.location,
          startDate: experience.startDate,
          endDate: experience.endDate,
          current: experience.isCurrent,
          description: experience.description
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
