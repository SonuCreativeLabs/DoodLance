import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useSkills } from './SkillsContext';
import type { Job } from '@/app/freelancer/feed/types';

interface ForYouJobsContextType {
  forYouJobs: Job[];
  refreshForYouJobs: () => Promise<void>;
  isLoading: boolean;
}

const ForYouJobsContext = createContext<ForYouJobsContextType | undefined>(undefined);

export function ForYouJobsProvider({ children }: { children: ReactNode }) {
  const { skills } = useSkills();
  const [forYouJobs, setForYouJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create stable dependency for skills changes
  const skillsDependency = useMemo(() => {
    return skills.map(skill => skill.name).join(',');
  }, [skills]);

  const fetchForYouJobs = useCallback(async () => {
    console.log('🔄 [DEBUG] Fetching For You jobs with skills:', skillsDependency);
    console.trace('[DEBUG] fetchForYouJobs call stack:');

    // If no skills, we can't really filter "for you", so returns empty or all? 
    // Usually "For You" implies personalization. If no skills, maybe return empty or popular.
    // For now, if no skills, return empty to encourage adding skills.
    if (!skills || skills.length === 0) {
      setForYouJobs([]);
      return;
    }

    setIsLoading(true);
    try {
      // Pass skills as query parameter for server-side filtering
      const queryParams = new URLSearchParams();
      if (skillsDependency) {
        queryParams.append('skills', skillsDependency);
      }

      const response = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (response.ok) {
        const jobs = await response.json();
        console.log(`✅ Loaded ${jobs.length} For You jobs`);
        setForYouJobs(jobs);
      } else {
        console.error('Failed to fetch For You jobs');
        setForYouJobs([]);
      }
    } catch (error) {
      console.error('Error fetching For You jobs:', error);
      setForYouJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [skillsDependency, skills]);

  const refreshForYouJobs = useCallback(async () => {
    await fetchForYouJobs();
  }, [fetchForYouJobs]);

  useEffect(() => {
    fetchForYouJobs();
  }, [fetchForYouJobs]);

  // Listen for application creation events and refresh jobs
  useEffect(() => {
    const handleApplicationCreated = () => {
      refreshForYouJobs();
    };

    const handleJobPosted = () => {
      refreshForYouJobs();
    };

    window.addEventListener('applicationCreated', handleApplicationCreated as EventListener);
    window.addEventListener('jobPosted', handleJobPosted as EventListener);

    return () => {
      window.removeEventListener('applicationCreated', handleApplicationCreated as EventListener);
      window.removeEventListener('jobPosted', handleJobPosted as EventListener);
    };
  }, [refreshForYouJobs]);

  const value: ForYouJobsContextType = {
    forYouJobs,
    refreshForYouJobs,
    isLoading
  };

  return (
    <ForYouJobsContext.Provider value={value}>
      {children}
    </ForYouJobsContext.Provider>
  );
}

export function useForYouJobs() {
  const context = useContext(ForYouJobsContext);
  if (context === undefined) {
    throw new Error('useForYouJobs must be used within a ForYouJobsProvider');
  }
  return context;
}
