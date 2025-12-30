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
        const saved = localStorage.getItem('experiences');
        if (saved) {
          setExperiences(JSON.parse(saved));
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Get profile ID
          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('id')
            .eq('userId', user.id)
            .maybeSingle();

          if (profile) {
            // 2. Fetch experiences
            const { data: dbExperiences } = await supabase
              .from('experiences')
              .select('*')
              .eq('profileId', profile.id);

            if (dbExperiences) {
              const mapped = dbExperiences.map((exp: any) => ({
                id: exp.id,
                role: exp.role,
                company: exp.company,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                isCurrent: exp.isCurrent,
                description: exp.description
              }));
              setExperiences(mapped);
              localStorage.setItem('experiences', JSON.stringify(mapped));
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
  }, [supabase]);

  const addExperience = useCallback(async (experience: Experience) => {
    // Optimistic update
    setExperiences(prev => [...prev, experience]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('freelancer_profiles')
          .select('id')
          .eq('userId', user.id)
          .maybeSingle();

        if (profile) {
          await supabase.from('experiences').insert({
            profileId: profile.id,
            role: experience.role,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate,
            isCurrent: experience.isCurrent,
            description: experience.description
          });
          // Refetch to get real ID if needed, but for now optimistic is fine or we update ID
        }
      }
    } catch (e) {
      console.error("Failed to add experience", e);
    }
  }, [supabase]);

  const removeExperience = useCallback(async (experienceId: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
    try {
      await supabase.from('experiences').delete().eq('id', experienceId);
    } catch (e) {
      console.error("Failed to delete experience", e);
    }
  }, [supabase]);

  const updateExperience = useCallback(async (experienceId: string, updates: Partial<Experience>) => {
    setExperiences(prev => prev.map(exp =>
      exp.id === experienceId ? { ...exp, ...updates } : exp
    ));
    try {
      await supabase.from('experiences').update({
        ...updates
      }).eq('id', experienceId);
    } catch (e) {
      console.error("Failed to update experience", e);
    }
  }, [supabase]);

  const updateExperiences = useCallback((newExperiences: Experience[]) => {
    setExperiences(newExperiences);
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
