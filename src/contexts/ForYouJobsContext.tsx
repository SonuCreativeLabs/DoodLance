'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSkills } from './SkillsContext';
import { jobs } from '@/app/freelancer/feed/data/jobs';
import type { Job } from '@/app/freelancer/feed/types';

interface ForYouJobsContextType {
  forYouJobs: Job[];
  refreshForYouJobs: () => Promise<void>;
}

const ForYouJobsContext = createContext<ForYouJobsContextType | undefined>(undefined);

export function ForYouJobsProvider({ children }: { children: ReactNode }) {
  const { skills } = useSkills();
  const [forYouJobs, setForYouJobs] = useState<Job[]>([]);

  const filterForYouJobs = async () => {
    // Filter jobs for recommended section based on user skills - exactly like the feed "For You" tab
    const userSkills = skills.map(skill => skill.name);

    // Filter jobs based on user's skills with percentage matching (same logic as feed page)
    const filteredJobs = jobs.filter(job => {
      // Calculate skill match percentage
      let totalMatchScore = 0;
      let maxPossibleScore = userSkills.length * 100; // 100 points per user skill

      // Check each user skill against job
      userSkills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        let skillMatchScore = 0;
        let hasExactMatch = false;
        let hasRelatedMatch = false;

        // 1. Exact skill match in job skills array (80 points)
        if (job.skills && job.skills.some(jobSkill =>
          jobSkill.toLowerCase().includes(skillLower) ||
          skillLower.includes(jobSkill.toLowerCase())
        )) {
          skillMatchScore = 80;
          hasExactMatch = true;
        }

        // 2. Partial match in job title/description (60 points) - only if no exact match
        if (!hasExactMatch && (job.title.toLowerCase().includes(skillLower) ||
            job.description.toLowerCase().includes(skillLower))) {
          skillMatchScore = 60;
        }

        // 3. Related skill mapping (40 points) - always check, but reduce if exact match exists
        const skillMappings = {
          'rh batsman': ['batting', 'batsman', 'batter', 'opening batsman', 'right-handed', 'rh'],
          'sidearm specialist': ['sidearm', 'side arm', 'side-arm', 'yorker', 'death overs'],
          'batting coach': ['batting coach', 'batting technique', 'batting training', 'batsman coach'],
          'analyst': ['analysis', 'analyst', 'video analysis', 'performance analysis', 'metrics'],
          'mystery spin': ['mystery spin', 'carrom ball', 'doosra', 'slider', 'teesra'],
          'off spin': ['off spin', 'off-spinner', 'orthodox spin', 'finger spin']
        };

        const relatedSkills = skillMappings[skillLower as keyof typeof skillMappings] || [];
        const relatedMatches = relatedSkills.filter(relatedSkill =>
          job.skills?.some(jobSkill => jobSkill.toLowerCase().includes(relatedSkill)) ||
          job.title.toLowerCase().includes(relatedSkill) ||
          job.description.toLowerCase().includes(relatedSkill)
        );

        if (relatedMatches.length > 0) {
          hasRelatedMatch = true;
          // If we have exact match, give 20 points for related matches, otherwise 40
          const relatedScore = hasExactMatch ? 20 : 40;
          // Bonus for multiple related matches
          const matchBonus = Math.min(relatedMatches.length - 1, 2) * 5; // Max +10 for multiple matches
          skillMatchScore += relatedScore + matchBonus;
        }

        // 4. Category bonus (only 10 points - considered last)
        if (skillMatchScore > 0 && job.category.toLowerCase().includes(skillLower.split(' ')[0])) {
          skillMatchScore += 10;
        }

        totalMatchScore += skillMatchScore;
      });

      // Calculate percentage match
      const matchPercentage = (totalMatchScore / maxPossibleScore) * 100;

      // Only include jobs with at least 15% match (reduced from 30% to be more inclusive)
      return matchPercentage >= 15;
    });

    // Filter out jobs user has already applied to (same as feed page)
    const { hasUserAppliedToJob } = await import('@/components/freelancer/jobs/mock-data');
    const finalJobs = filteredJobs.filter(job => !hasUserAppliedToJob(job.id));

    setForYouJobs(finalJobs);
  };

  const refreshForYouJobs = async () => {
    await filterForYouJobs();
  };

  useEffect(() => {
    filterForYouJobs();
  }, [skills]);

  // Listen for application creation events and refresh jobs
  useEffect(() => {
    const handleApplicationCreated = (event: CustomEvent) => {
      refreshForYouJobs();
    };

    window.addEventListener('applicationCreated', handleApplicationCreated as EventListener);

    return () => {
      window.removeEventListener('applicationCreated', handleApplicationCreated as EventListener);
    };
  }, []);

  const value: ForYouJobsContextType = {
    forYouJobs,
    refreshForYouJobs,
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
