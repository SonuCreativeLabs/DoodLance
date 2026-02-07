import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FreelancerProfileData {
    name: string;
    title: string;
    about: string;
    rating: number;
    reviewCount: number;
    responseTime: string;
    deliveryTime: string;
    completionRate: number;
    online: boolean;
    location: string;
    skills: (string | Record<string, unknown>)[];
    services: unknown[];
    clientReviews: unknown[];
    availability: unknown[];
    completedJobs: number;
    activeJobs: number;
    sportsDetails?: Record<string, unknown>;
}

interface FreelancerProfileContextType {
    profileData: FreelancerProfileData | null;
    loading: boolean;
    error: string | null;
    refreshProfile: () => Promise<void>;
    updateLocalProfile: (data: Partial<FreelancerProfileData>) => void;
}

const FreelancerProfileContext = createContext<FreelancerProfileContextType | undefined>(undefined);

export function FreelancerProfileProvider({ children }: { children: ReactNode }) {
    const [profileData, setProfileData] = useState<FreelancerProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<number>(0);
    const [supabase] = useState(() => createClient());

    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

    const profileDataRef = useRef<FreelancerProfileData | null>(null);
    const notFoundRef = useRef<boolean>(false);

    // Keep ref in sync with state for cache checks without triggering re-renders/loop
    useEffect(() => {
        profileDataRef.current = profileData;
    }, [profileData]);

    const fetchProfile = useCallback(async (forceRefresh = false) => {
        const now = Date.now();

        // Check if we already know this user has no profile (unless forcing to check again)
        if (!forceRefresh && notFoundRef.current) {
            console.log('ℹ️ Skipping profile fetch - known new user');
            setLoading(false);
            return;
        }

        // Use cache if available and not expired (unless force refresh)
        if (!forceRefresh && profileDataRef.current && (now - lastFetch < CACHE_DURATION)) {
            console.log('📦 Using cached profile data - no API call needed!');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            console.log('🔄 Fetching fresh profile data from API...');
            const response = await fetch('/api/freelancer/profile');

            // Handle 404 or other errors gracefully
            if (response.status === 404) {
                console.log('ℹ️ Profile not found (new user)');
                setProfileData(null);
                notFoundRef.current = true; // Mark as not found to prevent loops
                setLoading(false);
                return;
            }

            if (!response.ok) {
                console.error(`Status ${response.status}: Failed to fetch profile`);
                // Treat 500s as "no profile found" temporarily to break loops, or just stop invalidating
                // Ideally show error, but for "new user" 500 often means "DB record missing"
                setProfileData(null);
                notFoundRef.current = true; // Stop retrying
                setLoading(false);
                return;
            }

            const { profile } = await response.json();
            setProfileData(profile);
            notFoundRef.current = false; // Reset if found
            setLastFetch(now);
            setError(null);
            console.log('✅ Profile data fetched and cached for 2 minutes');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            // Do not set notFoundRef=true here, allows retry on next mount
        } finally {
            setLoading(false);
        }
    }, [lastFetch, supabase]); // Removed profileData from deps

    const refreshProfile = useCallback(async () => {
        console.log('🔄 Force refresh requested');
        await fetchProfile(true); // Force refresh
    }, [fetchProfile]);

    const updateLocalProfile = useCallback((data: Partial<FreelancerProfileData>) => {
        setProfileData(prev => prev ? { ...prev, ...data } : null);
        console.log('📝 Profile data updated locally');
    }, []);

    const { authUser } = useAuth();

    useEffect(() => {
        // Fetch when component mounts or when user ID changes (e.g. login/logout/switch user)
        // Wait for auth to be determined
        if (authUser === undefined) return;

        // Reset loading state when auth user changes to ensure skeleton shows immediately
        if (authUser?.id) {
            notFoundRef.current = false; // Reset for new user
            setLoading(true);
            fetchProfile();
        } else {
            // No user - clear profile data
            notFoundRef.current = false;
            setLoading(false);
            setProfileData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser?.id]); // Only depend on stable user ID, fetchProfile is accessed via closure

    const value = {
        profileData,
        loading,
        error,
        refreshProfile,
        updateLocalProfile
    };

    return (
        <FreelancerProfileContext.Provider value={value}>
            {children}
        </FreelancerProfileContext.Provider>
    );
}

export function useFreelancerProfile() {
    const context = useContext(FreelancerProfileContext);
    if (context === undefined) {
        throw new Error('useFreelancerProfile must be used within a FreelancerProfileProvider');
    }
    return context;
}
