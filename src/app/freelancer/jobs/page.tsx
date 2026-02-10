"use client"

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { JobDashboard } from '@/components/freelancer/jobs/job-dashboard';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTutorial, TutorialConfig } from '@/contexts/TutorialContext';
import { useEffect, useMemo } from 'react';

interface PageProps {
  searchParams: {
    tab?: string;
    status?: string;
  };
}

export default function JobsPage({ searchParams: initialSearchParams }: PageProps) {
  // Use the useSearchParams hook to get the current URL search params
  const searchParamsObj = useSearchParams();
  const { startTutorial, hasSeenTutorial, isOpen } = useTutorial();

  // Get the current tab and status from URL or use defaults
  const tab = searchParamsObj?.get('tab') || initialSearchParams?.tab || 'upcoming';
  const status = searchParamsObj?.get('status') || initialSearchParams?.status || 'upcoming';

  // Create a stable searchParams object to pass to JobDashboard
  const stableSearchParams = React.useMemo(() => ({
    tab,
    status
  }), [tab, status]);

  const jobsTutorial: TutorialConfig = useMemo(() => ({
    id: 'jobs-tour',
    steps: [
      {
        targetId: 'jobs-tabs',
        title: 'Your Jobs Dashboard',
        description: 'Switch between "My Jobs" (confirmed bookings) and "My Proposals" (applications you\'ve submitted).',
        position: 'bottom'
      },
      {
        targetId: 'jobs-status-filters',
        title: 'Filter by Status',
        description: 'Quickly find jobs by status: Upcoming, Ongoing, Marked (completed by you), Completed, or Cancelled.',
        position: 'bottom'
      },
      {
        targetId: 'first-job-card,first-skeleton-card,jobs-empty-state,applications-status-container',
        title: 'Job Cards',
        description: 'Tap to view session details. Get the 4-digit OTP from the client to start the job.',
        position: 'top'
      }
    ]
  }), []);

  useEffect(() => {
    const shouldStart = !hasSeenTutorial('jobs-tour') || searchParamsObj?.get('tutorial') === 'jobs-tour';
    if (shouldStart && !isOpen) {
      const timer = setTimeout(() => {
        startTutorial(jobsTutorial);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParamsObj, hasSeenTutorial, startTutorial, jobsTutorial, isOpen]);
  return (
    <div className="min-h-screen bg-[#111111] pt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-screen-xl mx-auto px-4 pb-24 md:pb-0 pt-0"
      >
        <div className="w-full flex flex-col items-center pt-0">
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group"
            >
              <Plus className="w-4 h-4 text-white/90 group-hover:text-white transition-colors duration-300" />
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                Post a Job
              </span>
            </motion.button>
          </div>
        </div>

        <JobDashboard searchParams={stableSearchParams} />
      </motion.div>
    </div>
  );
}