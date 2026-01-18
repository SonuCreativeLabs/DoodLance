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
  firstName?: string;
  lastName?: string;
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
  area?: string;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  isLoading: boolean;
  headerDataLoaded: boolean; // Track when header data is ready for immediate display
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => Promise<void>;
  refreshPersonalDetails: () => Promise<void>;
  toggleReadyToWork: () => void; // Re-added based on original context
}

const initialPersonalDetails: PersonalDetails = {
  name: "",
  firstName: "",
  lastName: "",
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
  postalCode: "",
  area: ""
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
  const [headerDataLoaded, setHeaderDataLoaded] = useState(false); // Track when header data is ready
  const hasHydrated = useRef(false);
  const supabase = createClient();
  const { refreshUser: refreshAuthUser, user } = useAuth();

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

      const result = await response.json();

      // Refresh session with returned data if available, or fetch fresh
      // Trigger AuthContext refresh to sync changes (like name/phone) across the app
      if (result.user) {
        await refreshAuthUser(result.user);
      } else {
        await refreshAuthUser();
      }

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

  // Phase 1: Fetch header data only (fast)
  const fetchHeaderData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true); // Start loading for header
      // Fetch only user data first (lightweight, no profile fetch)
      const userResponse = await fetch('/api/user/profile');
      if (!userResponse.ok) {
        console.error('Failed to fetch user profile from API');
        setIsLoading(false);
        return;
      }
      const userData = await userResponse.json();

      // Set header data immediately
      const headerDetails = {
        name: userData?.name || "",
        firstName: userData?.name?.split(' ')[0] || "",
        lastName: userData?.name?.split(' ').slice(1).join(' ') || "",
        title: userData?.freelancerProfile?.title || "",
        location: userData?.location || "",
        avatarUrl: userData?.avatar || "",
        username: userData?.username || "",
        displayId: userData?.displayId || "",
        isVerified: userData?.isVerified || false,
        coverImageUrl: userData?.freelancerProfile?.coverImage || "",
        // Now available in Phase 1 via freelancerProfile relation
        dateOfBirth: userData?.freelancerProfile?.dateOfBirth ? new Date(userData.freelancerProfile.dateOfBirth).toISOString().split('T')[0] : "",
        online: userData?.freelancerProfile?.isOnline ?? false,
        readyToWork: userData?.freelancerProfile?.isOnline ?? false,
        cricketRole: userData?.freelancerProfile?.cricketRole || "",

        email: userData?.email || "",
        phone: userData?.phone || "",
        area: userData?.area || "",
      };

      setPersonalDetails(prev => ({
        ...prev,
        ...headerDetails
      }));

      setHeaderDataLoaded(true); // Mark header as loaded
      setIsLoading(false); // Header data loaded, can render
    } catch (error) {
      console.error('Failed to fetch header data:', error);
      setIsLoading(false);
    }
  }, [user?.id]);

  // Phase 2: Fetch full profile data (background)
  const fetchFullProfileData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch freelancer profile from API
      const profileResponse = await fetch('/api/freelancer/profile');
      let profile = null;
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        profile = data.profile;
      }

      // Also re-fetch user data for complete details
      const userResponse = await fetch('/api/user/profile');
      const userData = userResponse.ok ? await userResponse.json() : null;

      // Map all fields from both sources
      const fullDetails = {
        name: userData?.name || "",
        firstName: userData?.name?.split(' ')[0] || "",
        lastName: userData?.name?.split(' ').slice(1).join(' ') || "",
        title: profile?.title || "",
        location: userData?.location || "",
        about: profile?.about || "",
        bio: userData?.bio || "",
        avatarUrl: userData?.avatar || "",
        coverImageUrl: profile?.coverImage || "",
        online: profile?.isOnline ?? false,
        readyToWork: profile?.isOnline ?? false,
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : (userData?.dateOfBirth || ""),
        cricketRole: profile?.cricketRole || "",
        battingStyle: profile?.battingStyle || "",
        bowlingStyle: profile?.bowlingStyle || "",
        responseTime: profile?.responseTime || "",
        deliveryTime: profile?.deliveryTime || "",
        completionRate: profile?.completionRate || 0,
        completedJobs: profile?.completedJobs || 0,
        activeJobs: profile?.activeJobs || 0,
        username: userData?.username || "",
        displayId: userData?.displayId || "",
        isVerified: userData?.isVerified || false,
        gender: userData?.gender || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
        city: userData?.city || "",
        state: userData?.state || "",
        postalCode: userData?.postalCode || "",
        area: userData?.area || ""
      };

      setPersonalDetails(prev => ({
        ...prev,
        ...fullDetails
      }));
      hasHydrated.current = true;
    } catch (error) {
      console.error('Failed to fetch full profile data:', error);
    }
  }, [user?.id]);

  // Combined refresh function for external use
  const refreshPersonalDetails = useCallback(async () => {
    if (!user?.id) {
      setPersonalDetails(initialPersonalDetails);
      setHeaderDataLoaded(false);
      setIsLoading(false);
      return;
    }
    // Trigger both phases
    await fetchHeaderData();
    await fetchFullProfileData();
  }, [user?.id, fetchHeaderData, fetchFullProfileData]);

  // Two-phase loading: header first, then full profile
  useEffect(() => {
    if (user?.id) {
      // Phase 1: Load header data immediately
      fetchHeaderData();

      // Phase 2: Load full profile in background after a short delay
      const timer = setTimeout(() => {
        fetchFullProfileData();
      }, 100); // Small delay to let header render first

      return () => clearTimeout(timer);
    } else {
      setPersonalDetails(initialPersonalDetails);
      setHeaderDataLoaded(false);
      setIsLoading(false);
    }
  }, [user?.id, fetchHeaderData, fetchFullProfileData]);

  const value: PersonalDetailsContextType = {
    personalDetails,
    updatePersonalDetails,
    toggleReadyToWork,
    refreshPersonalDetails, // Expose the combined refresh function
    isLoading,
    headerDataLoaded, // Expose header loaded state
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
