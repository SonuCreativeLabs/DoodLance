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

export function SkillsProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<SkillItem[]>(defaultSkills);
  const hasHydrated = useRef(false);

  const updateSkills = useCallback((newSkills: SkillItem[]) => {
    setSkills(newSkills);
  }, []);

  const addSkill = useCallback((skill: SkillItem) => {
    setSkills(prev => [...prev, skill]);
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId));
  }, []);

  const reorderSkills = useCallback((reorderedSkills: SkillItem[]) => {
    setSkills(reorderedSkills);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userSkills');
      if (saved) {
        const parsedSkills = JSON.parse(saved);
        // Handle both string array and SkillItem array formats
        if (Array.isArray(parsedSkills)) {
          if (typeof parsedSkills[0] === 'string') {
            // Convert string array to SkillItem array
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
    } catch (error) {
      console.error('Failed to parse skills:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever skills change (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('userSkills', JSON.stringify(skills));
  }, [skills]);

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
