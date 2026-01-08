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
  // Address fields
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
  toggleReadyToWork: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
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
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: ""
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType | undefined>(undefined);

function isValidEmail(email: string | null | undefined): boolean {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

export function PersonalDetailsProvider({ children }: { children: ReactNode }) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(initialPersonalDetails);
  const [isLoading, setIsLoading] = useState(true);
  const hasHydrated = useRef(false);
  const supabase = createClient();
  const { refreshUser: refreshAuthUser } = useAuth();

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
      // Trigger AuthContext refresh to sync changes (like name/phone) across the app
      await refreshAuthUser();

    } catch (error) {
      console.error('Failed to persist personal details:', error);
      // We could revert state here if strict, but for now just log
    }
  }, [refreshAuthUser]);

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
      setIsLoading(true);
      // Fetch user data from API (bypasses RLS issues)
      const userResponse = await fetch('/api/user/profile');
      if (!userResponse.ok) {
        console.error('Failed to fetch user profile from API');
        return;
      }
      const userData = await userResponse.json();

      // Fetch freelancer profile from API
      const profileResponse = await fetch('/api/freelancer/profile');
      let profile = null;
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        profile = data.profile;
      }

      // Map all fields from both sources
      const newDetails = {
        name: userData?.name || "",
        title: profile?.title || "",
        location: userData?.location || "",
        about: profile?.about || "",
        bio: userData?.bio || "",
        avatarUrl: userData?.avatar || "",
        coverImageUrl: profile?.coverImage || "",
        online: profile?.isOnline ?? true,
        readyToWork: profile?.isOnline ?? false,
        dateOfBirth: profile?.dateOfBirth || "",
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
        email: userData?.email || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
        city: userData?.city || "",
        state: userData?.state || "",
        postalCode: userData?.postalCode || ""
      };

      setPersonalDetails(prev => ({
        ...prev,
        ...newDetails
      }));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
      hasHydrated.current = true;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const value: PersonalDetailsContextType = {
    personalDetails,
    updatePersonalDetails,
    toggleReadyToWork,
    refreshUser: fetchUserData,
    isLoading,
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
