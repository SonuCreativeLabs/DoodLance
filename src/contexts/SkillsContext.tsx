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
}

const defaultSkills: SkillItem[] = [];

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';

export function SkillsProvider({ children }: { children: ReactNode }) {
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
    const fetchSkills = async () => {
      try {
        const saved = localStorage.getItem('userSkills');
        if (saved) {
          const parsedSkills = JSON.parse(saved);
          if (Array.isArray(parsedSkills)) {
            if (typeof parsedSkills[0] === 'string') {
              const skillItems = parsedSkills.map((name: string, index: number) => ({
                id: `${index}`,
                name,
              }));
              setSkills(skillItems);
            } else {
              setSkills(parsedSkills);
            }
          }
        }

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
              localStorage.setItem('userSkills', JSON.stringify(skillItems));
            } else {
              setSkills(dbSkills);
              localStorage.setItem('userSkills', JSON.stringify(dbSkills));
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
  }, [supabase]);

  // Save to localStorage whenever skills change
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('userSkills', JSON.stringify(skills));
  }, [skills, isHydrated]);

  const value: SkillsContextType = {
    skills,
    updateSkills,
    addSkill,
    removeSkill,
    reorderSkills,
  };

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
