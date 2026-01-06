'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

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
    skills: string[];
    services: any[];
    portfolio: any[];
    clientReviews: any[];
    availability: any[];
    completedJobs: number;
    activeJobs: number;
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
    const supabase = createClient();

    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache

    const fetchProfile = useCallback(async (forceRefresh = false) => {
        const now = Date.now();

        // Use cache if available and not expired (unless force refresh)
        if (!forceRefresh && profileData && (now - lastFetch < CACHE_DURATION)) {
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
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const { profile } = await response.json();
            setProfileData(profile);
            setLastFetch(now);
            setError(null);
            console.log('✅ Profile data fetched and cached for 2 minutes');
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [profileData, lastFetch, supabase]);

    const refreshProfile = useCallback(async () => {
        console.log('🔄 Force refresh requested');
        await fetchProfile(true); // Force refresh
    }, [fetchProfile]);

    const updateLocalProfile = useCallback((data: Partial<FreelancerProfileData>) => {
        setProfileData(prev => prev ? { ...prev, ...data } : null);
        console.log('📝 Profile data updated locally');
    }, []);

    useEffect(() => {
        // Only fetch once on mount
        let mounted = true;

        if (mounted) {
            fetchProfile();
        }

        return () => {
            mounted = false;
        };
    }, []); // Empty deps - only run once

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
