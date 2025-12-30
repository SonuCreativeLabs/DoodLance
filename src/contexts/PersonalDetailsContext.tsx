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
  // Stats
  responseTime?: string;
  deliveryTime?: string;
  completionRate?: number;
  completedJobs?: number;
  activeJobs?: number;
  // Identity
  username?: string;
  displayId?: string;
  isVerified?: boolean;
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
  online: false,
  readyToWork: false,
  dateOfBirth: "",
  languages: "",
  cricketRole: "",
  battingStyle: "",
  bowlingStyle: "",
  responseTime: "",
  deliveryTime: "",
  completionRate: 0,
  completedJobs: 0,
  activeJobs: 0,
  username: "",
  displayId: "",
  isVerified: false
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType | undefined>(undefined);

import { createClient } from '@/lib/supabase/client';

export function PersonalDetailsProvider({ children }: { children: ReactNode }) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(initialPersonalDetails);
  const hasHydrated = useRef(false);
  const supabase = createClient();

  const updatePersonalDetails = useCallback(async (updates: Partial<PersonalDetails>) => {
    // 1. Optimistic update
    setPersonalDetails(prev => ({
      ...prev,
      ...updates
    }));

    try {
      // 2. Persist to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.about !== undefined) dbUpdates.about = updates.about;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar = updates.avatarUrl;
      if (updates.coverImageUrl !== undefined) dbUpdates.cover_image = updates.coverImageUrl;
      if (updates.online !== undefined) dbUpdates.online = updates.online;
      if (updates.readyToWork !== undefined) dbUpdates.ready_to_work = updates.readyToWork;
      if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
      if (updates.languages !== undefined) dbUpdates.languages = updates.languages;
      if (updates.cricketRole !== undefined) dbUpdates.cricket_role = updates.cricketRole;
      if (updates.battingStyle !== undefined) dbUpdates.batting_style = updates.battingStyle;
      if (updates.bowlingStyle !== undefined) dbUpdates.bowling_style = updates.bowlingStyle;

      if (Object.keys(dbUpdates).length > 0) {
        // 1. Update Freelancer Profile
        const { error: profileError } = await supabase
          .from('freelancer_profiles')
          .update(dbUpdates)
          .eq('userId', user.id);

        if (profileError) throw profileError;

        // 2. Update User table (shared fields)
        const userUpdates: any = {};
        if (updates.name !== undefined) userUpdates.name = updates.name;
        if (updates.location !== undefined) {
          userUpdates.location = updates.location;
          // If coords are available in updates or derived, they should be updated too, 
          // but for now keeping it simple to what's passed.
        }
        if (updates.avatarUrl !== undefined) userUpdates.avatar = updates.avatarUrl;

        if (Object.keys(userUpdates).length > 0) {
          const { error: userError } = await supabase
            .from('users')
            .update(userUpdates)
            .eq('id', user.id);

          if (userError) {
            console.error('Failed to sync user table:', userError);
          }
        }

        // 3. Update Supabase Auth Metadata (for session/auth context)
        const metadataUpdates: any = {};
        if (updates.name !== undefined) metadataUpdates.full_name = updates.name;
        if (updates.avatarUrl !== undefined) metadataUpdates.avatar_url = updates.avatarUrl;
        if (updates.location !== undefined) metadataUpdates.location = updates.location;

        if (Object.keys(metadataUpdates).length > 0) {
          const { error: authError } = await supabase.auth.updateUser({
            data: metadataUpdates
          });

          if (authError) {
            console.error('Failed to sync auth metadata:', authError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to persist personal details:', error);
      // We could revert state here if strict, but for now just log
    }
  }, [supabase]);

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
  // Fetch from Supabase on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch profile data
          const { data: profile } = await supabase
            .from('freelancer_profiles')
            .select('*')
            .eq('userId', user.id)
            .maybeSingle();

          // Fetch user data (username, displayId)
          const { data: userData } = await supabase
            .from('users')
            .select('username, displayId, isVerified')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            const newDetails = {
              name: profile.name || user.user_metadata?.full_name || "",
              title: profile.title || "",
              location: profile.location || user.user_metadata?.location || "",
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
              // Stats
              responseTime: profile.response_time || "",
              deliveryTime: profile.delivery_time || "",
              completionRate: profile.completion_rate || 0,
              completedJobs: profile.completed_jobs || 0,
              activeJobs: profile.active_jobs || 0,
              username: userData?.username || "",
              displayId: userData?.displayId || "",
              isVerified: userData?.isVerified || false
            };

            setPersonalDetails(prev => ({
              ...prev,
              ...newDetails
            }));
          } else {
            // If no profile exists yet, use auth metadata
            setPersonalDetails(prev => ({
              ...prev,
              name: user.user_metadata?.full_name || prev.name,
              avatarUrl: user.user_metadata?.avatar_url || prev.avatarUrl,
              username: userData?.username || ""
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
