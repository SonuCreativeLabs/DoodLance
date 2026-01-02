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
  gender?: string;
  email?: string;
  phone?: string;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
  toggleReadyToWork: () => void;
  refreshUser: () => Promise<void>;
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
  isVerified: false,
  gender: "",
  email: "",
  phone: ""
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType | undefined>(undefined);

function isValidEmail(email: string | null | undefined): boolean {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
      // 2. Persist to API (Bypassing RLS and handling Split Tables)
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/freelancer/profile/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Supabase client handles auth cookies automatically, but we ensure session exists
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh session if needed, or just let optimistic update hold

    } catch (error) {
      console.error('Failed to persist personal details:', error);
      // We could revert state here if strict, but for now just log
    }
  }, [supabase]);

  const toggleReadyToWork = useCallback(() => {
    // Calculate new status based on current state
    setPersonalDetails(prev => {
      const newStatus = !prev.readyToWork;

      // Persist to DB
      // We perform this side effect here to access the calculated newStatus easily
      // without needing checks on the previous state in a separate effect
      updatePersonalDetails({
        readyToWork: newStatus,
        online: newStatus
      });

      return {
        ...prev,
        readyToWork: newStatus,
        online: newStatus,
      };
    });
  }, [updatePersonalDetails]);

  // Refactored fetch logic to be reusable
  const fetchUserData = useCallback(async () => {
    try {
      // Use API route instead of direct Supabase query to bypass RLS
      const response = await fetch('/api/freelancer/profile');

      if (!response.ok) {
        console.error('Failed to fetch profile from API');
        return;
      }

      const { profile } = await response.json();

      // Also fetch user data from Supabase Users table (this works)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('username, displayId, isVerified, gender, email, phone, name, location, avatar, bio')
        .eq('id', user.id)
        .maybeSingle();

      // Always populate data, even if freelancer profile doesn't exist yet
      const newDetails = {
        name: userData?.name || user.user_metadata?.full_name || "",
        title: profile?.title || "",
        location: userData?.location || user.user_metadata?.location || "",
        about: profile?.about || "",
        bio: userData?.bio || "",
        avatarUrl: userData?.avatar || user.user_metadata?.avatar_url || "",
        coverImageUrl: profile?.coverImage || "",
        online: profile?.isOnline ?? true,
        readyToWork: profile?.isOnline ?? false,
        dateOfBirth: "",
        languages: profile?.languages || "",
        cricketRole: profile?.cricketRole || "",
        battingStyle: profile?.battingStyle || "",
        bowlingStyle: profile?.bowlingStyle || "",
        responseTime: profile?.responseTime || "",
        deliveryTime: profile?.deliveryTime || "",
        completionRate: profile?.completionRate || 0,
        completedJobs: profile?.completedJobs || 0,
        activeJobs: 0,
        username: userData?.username || "",
        displayId: userData?.displayId || "",
        isVerified: userData?.isVerified || false,
        gender: userData?.gender || "",
        email: userData?.email || user.email || "",
        phone: userData?.phone || ""
      };

      setPersonalDetails(prev => ({
        ...prev,
        ...newDetails
      }));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [supabase]);

  // Initial load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const value: PersonalDetailsContextType = {
    personalDetails,
    updatePersonalDetails,
    toggleReadyToWork,
    refreshUser: fetchUserData,
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
