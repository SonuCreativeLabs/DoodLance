'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface PostedJob {
    "#": string;
    title: string;
    category: string;
    description: string;
    budget: string;
    location: string;
    datePosted: string;
    status: 'open' | 'closed' | 'deleted';
    applicationCount: number;
    viewCount: number;
    // Extended fields
    skills: string[];
    workMode: string;
    duration: string;
    experience: string;
    scheduledAt: string | null;
    type: string;
    acceptedCount: number;
    peopleNeeded: number;
}



interface PostedJobsContextType {
    postedJobs: PostedJob[];
    loading: boolean;
    error: string | null;
    refreshPostedJobs: () => void;
    closeJob: (id: string) => Promise<void>;
    reopenJob: (id: string) => Promise<void>;
    deleteJob: (id: string) => Promise<void>;
    updateJob: (id: string, data: Partial<PostedJob>) => Promise<void>;
}

const PostedJobsContext = createContext<PostedJobsContextType | undefined>(undefined);

// Initial state
const initialPostedJobs: PostedJob[] = [];

const STORAGE_KEY = 'doodlance_posted_jobs';

export function PostedJobsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [postedJobs, setPostedJobs] = useState<PostedJob[]>(initialPostedJobs);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch fresh data when user ID changes (stable dependency)
    useEffect(() => {
        if (user?.id) {
            refreshPostedJobs();
        } else {
            // Clear jobs on logout/no user
            setPostedJobs([]);
        }
    }, [user?.id]); // Only depend on user.id to avoid loops

    // Listen for job posted and application updated events
    useEffect(() => {
        const handleJobPosted = (event: CustomEvent) => {
            console.log('🔔 JOB POSTED EVENT RECEIVED', event.detail);
            refreshPostedJobs();
        };

        const handleAppUpdated = () => {
            refreshPostedJobs();
        };

        window.addEventListener('jobPosted', handleJobPosted as EventListener);
        window.addEventListener('applicationUpdated', handleAppUpdated as EventListener);
        return () => {
            window.removeEventListener('jobPosted', handleJobPosted as EventListener);
            window.removeEventListener('applicationUpdated', handleAppUpdated as EventListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // refreshPostedJobs is accessed via closure, doesn't need to be a dependency



    const refreshPostedJobs = async () => {
        // If no user, or user not loaded, don't fetch yet or clear jobs
        if (!user) {
            if (loading) setLoading(false);
            return;
        }

        console.log('🔄 REFRESHING POSTED JOBS for user:', user.email);
        setLoading(true);
        setError(null);
        try {
            const clientId = user.id;
            console.log('👤 Fetching jobs for client:', clientId);

            const response = await fetch(`/api/jobs?clientId=${clientId}`, { cache: 'no-store' });
            if (!response.ok) throw new Error('Failed to fetch posted jobs');

            const data = await response.json();
            console.log('✅ Fetched jobs:', data);

            // Map API response to PostedJob interface
            const mappedJobs: PostedJob[] = data.map((job: any) => ({
                "#": job.id,
                title: job.title,
                category: job.category,
                description: job.description,
                budget: `₹${job.budget}`, // Format budget
                location: job.location,
                datePosted: job.createdAt,
                status: job.status === 'OPEN' ? 'open' : job.status === 'DELETED' ? 'deleted' : 'closed',
                applicationCount: job._count?.applications || 0,
                viewCount: job.proposals || 0,
                // Map extended fields
                skills: job.skills || [],
                workMode: job.workMode || 'Remote',
                duration: job.duration || 'Hourly',
                experience: job.experience || 'Intermediate',
                scheduledAt: job.scheduledAt,
                type: job.type || 'freelance',
                acceptedCount: job.applications?.filter((a: any) => a.status?.toLowerCase() === 'accepted' || a.status?.toLowerCase() === 'hired').length || 0,
                peopleNeeded: job.peopleNeeded || 1,
            }));

            setPostedJobs(mappedJobs);
        } catch (err) {
            console.error('❌ Error refreshing posted jobs:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch posted jobs');
        } finally {
            setLoading(false);
        }
    };

    const closeJob = async (id: string) => {
        try {
            // Optimistic update
            setPostedJobs(prev => prev.map(job =>
                job["#"] === id ? { ...job, status: 'closed' as const } : job
            ));


            // API call to update job status
            await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CLOSED' })
            });
        } catch (err) {
            // Revert on failure
            refreshPostedJobs();
            throw new Error('Failed to close job');
        }
    };

    const reopenJob = async (id: string) => {
        try {
            // Optimistic update
            setPostedJobs(prev => prev.map(job =>
                job["#"] === id ? { ...job, status: 'open' as const } : job
            ));

            // API call to update job status
            await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'OPEN' })
            });
        } catch (err) {
            // Revert on failure
            refreshPostedJobs();
            throw new Error('Failed to reopen job');
        }
    };

    const deleteJob = async (id: string) => {
        try {
            // Optimistic update - Soft Delete
            setPostedJobs(prev => prev.map(job =>
                job["#"] === id ? { ...job, status: 'deleted' as const } : job
            ));

            // API call to delete job (soft delete)
            await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'DELETED' })
            });
        } catch (err) {
            // Revert on failure
            refreshPostedJobs();
            throw new Error('Failed to delete job');
        }
    };

    const updateJob = async (id: string, data: Partial<PostedJob>) => {
        try {
            // Optimistic update
            setPostedJobs(prev => prev.map(job =>
                job["#"] === id ? { ...job, ...data } : job
            ));

            // API call
            await fetch(`/api/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (err) {
            refreshPostedJobs();
            throw new Error('Failed to update job');
        }
    };

    return (
        <PostedJobsContext.Provider
            value={{
                postedJobs,
                loading,
                error,
                refreshPostedJobs,
                closeJob,
                reopenJob,
                deleteJob,
                updateJob,
            }}
        >
            {children}
        </PostedJobsContext.Provider>
    );
}

export function usePostedJobs() {
    const context = useContext(PostedJobsContext);
    if (context === undefined) {
        throw new Error('usePostedJobs must be used within a PostedJobsProvider');
    }
    return context;
}
