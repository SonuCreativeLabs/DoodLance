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
  const supabase = createClient();

  const updateSkills = useCallback(async (newSkills: SkillItem[]) => {
    setSkills(newSkills);

    // Persist to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('freelancer_profiles')
          .update({ skills: newSkills })
          .eq('userId', user.id);
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  }, [supabase]);

  const addSkill = useCallback(async (skill: SkillItem) => {
    setSkills(prev => {
      const newSkills = [...prev, skill];
      // Persist
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('freelancer_profiles')
              .update({ skills: newSkills })
              .eq('userId', user.id);
          }
        } catch (error) {
          console.error('Failed to save skills:', error);
        }
      })();
      return newSkills;
    });
  }, [supabase]);

  const removeSkill = useCallback(async (skillId: string) => {
    setSkills(prev => {
      const newSkills = prev.filter(s => s.id !== skillId);
      // Persist
      (async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('freelancer_profiles')
              .update({ skills: newSkills })
              .eq('userId', user.id);
          }
        } catch (error) {
          console.error('Failed to save skills:', error);
        }
      })();
      return newSkills;
    });
  }, [supabase]);

  const reorderSkills = useCallback(async (reorderedSkills: SkillItem[]) => {
    setSkills(reorderedSkills);
    // Persist
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('freelancer_profiles')
          .update({ skills: reorderedSkills })
          .eq('userId', user.id);
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  }, [supabase]);

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

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('skills')
            .eq('userId', user.id)
            .maybeSingle();

          if (profile && profile.skills) {
            let dbSkills = profile.skills;
            if (typeof dbSkills === 'string') {
              try { dbSkills = JSON.parse(dbSkills); } catch (e) { }
            }

            if (Array.isArray(dbSkills)) {
              // Check if it's string array or object array
              if (dbSkills.length > 0 && typeof dbSkills[0] === 'string') {
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
