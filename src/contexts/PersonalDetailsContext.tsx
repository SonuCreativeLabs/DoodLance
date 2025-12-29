'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface PersonalDetails {
  name: string;
  title: string;
  location: string;
  about: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  online: boolean;
  readyToWork: boolean;
  dateOfBirth?: string;
  languages?: string;
  cricketRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
  toggleReadyToWork: () => void;
}

const initialPersonalDetails: PersonalDetails = {
  name: "",
  title: "",
  location: "",
  about: "",
  bio: "",
  avatarUrl: "",
  coverImageUrl: "",
  online: true,
  readyToWork: true,
  dateOfBirth: "",
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';

export function PersonalDetailsProvider({ children }: { children: ReactNode }) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(initialPersonalDetails);
  const hasHydrated = useRef(false);
  const supabase = createClient();

  const updatePersonalDetails = useCallback((updates: Partial<PersonalDetails>) => {
    setPersonalDetails(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const toggleReadyToWork = useCallback(() => {
    setPersonalDetails(prev => {
      const newStatus = !prev.readyToWork;
      return {
        ...prev,
        readyToWork: newStatus,
        online: newStatus, // Sync online status with ready to work
      };
    });
  }, []);

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 1. Try to load from localStorage first for immediate UI
        const saved = localStorage.getItem('personalDetails');
        if (saved) {
          setPersonalDetails(JSON.parse(saved));
        }

        // 2. Fetch fresh data from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch profile data
          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('*')
            .eq('userId', user.id)
            .maybeSingle();

          if (profile) {
            const newDetails = {
              name: profile.name || user.user_metadata?.full_name || "",
              title: profile.title || "",
              location: profile.location || "",
              about: profile.about || "",
              bio: profile.bio || "",
              avatarUrl: profile.avatar || user.user_metadata?.avatar_url || "",
              coverImageUrl: profile.cover_image || "",
              online: profile.online ?? true,
              readyToWork: profile.ready_to_work ?? true,
              dateOfBirth: profile.date_of_birth || "",
              languages: profile.languages || "",
              cricketRole: profile.cricket_role || "",
              battingStyle: profile.batting_style || "",
              bowlingStyle: profile.bowling_style || "",
            };

            setPersonalDetails(prev => ({
              ...prev,
              ...newDetails
            }));

            // Update localStorage with fresh data
            localStorage.setItem('personalDetails', JSON.stringify(newDetails));
          } else {
            // If no profile exists yet, use auth metadata
            setPersonalDetails(prev => ({
              ...prev,
              name: user.user_metadata?.full_name || prev.name,
              avatarUrl: user.user_metadata?.avatar_url || prev.avatarUrl
            }));
          }
        }
      } catch (error) {
        console.error('Failed to initialize personal details:', error);
      } finally {
        hasHydrated.current = true;
      }
    };

    initializeData();
  }, [supabase]);

  // Save to localStorage whenever it changes (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
  }, [personalDetails]);

  const value: PersonalDetailsContextType = {
    personalDetails,
    updatePersonalDetails,
    toggleReadyToWork,
  };

  return (
    <PersonalDetailsContext.Provider value={value}>
      {children}
    </PersonalDetailsContext.Provider>
  );
}

export function usePersonalDetails() {
  const context = useContext(PersonalDetailsContext);
  if (context === undefined) {
    throw new Error('usePersonalDetails must be used within a PersonalDetailsProvider');
  }
  return context;
}
