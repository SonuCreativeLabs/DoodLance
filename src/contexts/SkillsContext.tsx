'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface SkillItem {
  id: string;
  name: string;
  description?: string;
  experience?: string;
  level?: 'Beginner' | 'Intermediate' | 'Expert';
}

interface SkillsContextType {
  skills: SkillItem[];
  updateSkills: (skills: SkillItem[]) => void;
  addSkill: (skill: SkillItem) => void;
  removeSkill: (skillId: string) => void;
  reorderSkills: (skills: SkillItem[]) => void;
  hydrateSkills: (skills: SkillItem[]) => void;
  isLoading: boolean;
}

const defaultSkills: SkillItem[] = [];

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';

export interface SkillsProviderProps {
  children: ReactNode;
  skipInitialFetch?: boolean;
}

export function SkillsProvider({ children, skipInitialFetch = false }: SkillsProviderProps) {
  const [skills, setSkills] = useState<SkillItem[]>(defaultSkills);
  const [isHydrated, setIsHydrated] = useState(false);
  const supabase = React.useMemo(() => createClient(), []);

  const updateSkills = useCallback(async (newSkills: SkillItem[]) => {
    setSkills(newSkills);

    // Persist via API
    try {
      await fetch('/api/freelancer/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: newSkills })
      });
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  }, []);

  const hydrateSkills = useCallback((newSkills: SkillItem[]) => {
    setSkills(newSkills);
    setIsHydrated(true);
  }, []);

  const addSkill = useCallback(async (skill: SkillItem) => {
    setSkills(prev => {
      const newSkills = [...prev, skill];
      // Persist
      (async () => {
        try {
          await fetch('/api/freelancer/skills', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: newSkills })
          });
        } catch (error) {
          console.error('Failed to save skills:', error);
        }
      })();
      return newSkills;
    });
  }, []);

  const removeSkill = useCallback(async (skillId: string) => {
    setSkills(prev => {
      const newSkills = prev.filter(s => s.id !== skillId);
      // Persist
      (async () => {
        try {
          await fetch('/api/freelancer/skills', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: newSkills })
          });
        } catch (error) {
          console.error('Failed to save skills:', error);
        }
      })();
      return newSkills;
    });
  }, []);

  const reorderSkills = useCallback(async (reorderedSkills: SkillItem[]) => {
    setSkills(reorderedSkills);
    // Persist
    try {
      await fetch('/api/freelancer/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: reorderedSkills })
      });
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  }, []);

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    if (skipInitialFetch) return;

    const fetchSkills = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/freelancer/skills');
        if (response.ok) {
          const { skills: dbSkills } = await response.json();

          if (Array.isArray(dbSkills) && dbSkills.length > 0) {
            // Check if it's string array or object array
            if (typeof dbSkills[0] === 'string') {
              const skillItems = dbSkills.map((name: string, index: number) => ({
                id: `${Date.now()}-${index}`,
                name,
              }));
              setSkills(skillItems);
            } else {
              setSkills(dbSkills);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchSkills();
  }, [supabase, skipInitialFetch]);

  // Save to localStorage whenever skills change
  // No localStorage side effects needed. Data is persisted to DB.

  const value: SkillsContextType = React.useMemo(() => ({
    skills,
    updateSkills,
    hydrateSkills,
    addSkill,
    removeSkill,
    reorderSkills,
    isLoading: !isHydrated,
  }), [skills, updateSkills, hydrateSkills, addSkill, removeSkill, reorderSkills, isHydrated]);

  return (
    <SkillsContext.Provider value={value}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
}
