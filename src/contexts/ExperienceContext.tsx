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

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const saved = localStorage.getItem('experiences');
        if (saved) {
          setExperiences(JSON.parse(saved));
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Fetch associated freelancer profile -> experiences relation
          // Note: Assuming 'experiences' is a JSON column or relation.
          // Since the previous code structure suggests it might be stored, let's check the schema logic.
          // Based on api/freelancer usage, it seems experiences are likely a relation or JSON.
          // Let's assume JSON for now based on how context saves to localStorage, OR fetches from profile.
          // In api/freelancers we saw `p.experience` used as string, but here it's an array.
          // Let's fetch from `freelancer_profiles` and check for an `experience` column that holds this JSON.

          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('experience') // Assuming column name is 'experience' holding JSON array, if it exists.
            .eq('userId', user.id)
            .maybeSingle();

          if (profile && profile.experience) {
            let dbExp = profile.experience;
            if (typeof dbExp === 'string') {
              try { dbExp = JSON.parse(dbExp); } catch (e) { }
            }
            if (Array.isArray(dbExp)) {
              setExperiences(dbExp);
              localStorage.setItem('experiences', JSON.stringify(dbExp));
            }
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
