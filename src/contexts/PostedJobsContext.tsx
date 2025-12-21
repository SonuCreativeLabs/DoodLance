'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PostedJob {
    "#": string;
    title: string;
    category: string;
    description: string;
    budget: string;
    location: string;
    datePosted: string;
    status: 'open' | 'closed';
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
}



interface PostedJobsContextType {
    postedJobs: PostedJob[];
    loading: boolean;
    error: string | null;
    refreshPostedJobs: () => void;
    closeJob: (id: string) => Promise<void>;
    reopenJob: (id: string) => Promise<void>;
}

const PostedJobsContext = createContext<PostedJobsContextType | undefined>(undefined);

// Initial mock data - will be replaced with API calls
const initialPostedJobs: PostedJob[] = [];

const STORAGE_KEY = 'doodlance_posted_jobs';

export function PostedJobsProvider({ children }: { children: ReactNode }) {
    const [postedJobs, setPostedJobs] = useState<PostedJob[]>(initialPostedJobs);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setPostedJobs(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse posted jobs from localStorage:', e);
            }
        }
        // Fetch fresh data from API
        refreshPostedJobs();
    }, []);

    // Save to localStorage whenever postedJobs changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(postedJobs));
    }, [postedJobs]);

    // Listen for job posted events
    useEffect(() => {
        const handleJobPosted = (event: CustomEvent) => {
            console.log('🔔 JOB POSTED EVENT RECEIVED', event.detail);
            const { jobId } = event.detail;
            // Refresh posted jobs when a new job is posted
            refreshPostedJobs();
        };

        window.addEventListener('jobPosted', handleJobPosted as EventListener);
        return () => {
            window.removeEventListener('jobPosted', handleJobPosted as EventListener);
        };
    }, []);

    const refreshPostedJobs = async () => {
        console.log('🔄 REFRESHING POSTED JOBS...');
        setLoading(true);
        setError(null);
        try {
            // Get user session to know which client ID to filter by
            const sessionRes = await fetch('/api/auth/session');
            let clientId = 'user_123'; // fallback
            if (sessionRes.ok) {
                const session = await sessionRes.json();
                if (session.id) clientId = session.id;
            }
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
                status: job.status === 'OPEN' ? 'open' : 'closed',
                applicationCount: job._count?.applications || 0,
                viewCount: job.proposals || 0,
                // Map extended fields
                skills: job.skills || [],
                workMode: job.workMode || 'Remote',
                duration: job.duration || 'Hourly',
                experience: job.experience || 'Intermediate',
                scheduledAt: job.scheduledAt,
                type: job.type || 'freelance',
                acceptedCount: job.applications?.filter((a: any) => a.status === 'accepted' || a.status === 'hired').length || 0,
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

            // TODO: API call to update job status
            // await fetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'CLOSED' }) });
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

            // TODO: API call to update job status
            // await fetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'OPEN' }) });
        } catch (err) {
            // Revert on failure
            refreshPostedJobs();
            throw new Error('Failed to reopen job');
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
