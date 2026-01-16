'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Achievement {
  id: string;
  title: string;
  company: string;
}

interface AchievementsContextType {
  achievements: Achievement[];
  updateAchievements: (achievements: Achievement[]) => void;
  addAchievement: (achievement: Achievement) => void;
  removeAchievement: (achievementId: string) => void;
  updateAchievement: (achievementId: string, updates: Partial<Achievement>) => void;
  hydrateAchievements: (achievements: Achievement[]) => void;
  hydrated: boolean;
  isLoading: boolean;
}

const initialAchievements: Achievement[] = [];

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

interface AchievementsProviderProps {
  children: ReactNode;
  skipInitialFetch?: boolean;
}

export function AchievementsProvider({ children, skipInitialFetch = false }: AchievementsProviderProps) {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const hydrateAchievements = useCallback((newAchievements: Achievement[]) => {
    console.log('🏗️ AchievementsContext: Hydrating with', newAchievements.length, 'items');
    setAchievements(newAchievements);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log('🏗️ AchievementsContext: Mounted. isLoading:', isLoading, 'achievements:', achievements.length);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load from Supabase on mount
  useEffect(() => {
    if (skipInitialFetch || !isAuthenticated) return;

    const fetchAchievements = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/freelancer/achievements');
        if (response.ok) {
          const data = await response.json();
          const dbAchievements = data.achievements;

          if (Array.isArray(dbAchievements)) {
            const mapped = dbAchievements.map((exp: any) => ({
              id: exp.id,
              title: exp.title,
              company: exp.company || ""
            }));
            setAchievements(mapped);
          } else {
            // If achievements key is missing or not array, try legacy or default empty
            setAchievements([]);
          }
        }
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [skipInitialFetch]);

  const addAchievement = useCallback(async (achievement: Achievement) => {
    setAchievements(prev => [...prev, achievement]);

    try {
      await fetch('/api/freelancer/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: achievement.title,
          company: achievement.company
        })
      });
    } catch (e) {
      console.error("Failed to add achievement", e);
    }
  }, []);

  const removeAchievement = useCallback(async (achievementId: string) => {
    setAchievements(prev => prev.filter(exp => exp.id !== achievementId));
    try {
      await fetch(`/api/freelancer/achievements?id=${achievementId}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete achievement", e);
    }
  }, []);

  const updateAchievement = useCallback(async (achievementId: string, updates: Partial<Achievement>) => {
    setAchievements(prev => prev.map(exp =>
      exp.id === achievementId ? { ...exp, ...updates } : exp
    ));
    try {
      await fetch('/api/freelancer/achievements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: achievementId, ...updates })
      });
    } catch (e) {
      console.error("Failed to update achievement", e);
    }
  }, []);

  const updateAchievements = useCallback((newAchievements: Achievement[]) => {
    setAchievements(newAchievements);
  }, []);

  const value: AchievementsContextType = {
    achievements,
    updateAchievements,
    addAchievement,
    removeAchievement,
    updateAchievement,
    hydrateAchievements,
    hydrated: !isLoading,
    isLoading,
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
}
