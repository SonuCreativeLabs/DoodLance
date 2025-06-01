"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { JobDashboard } from '@/components/freelancer/jobs/job-dashboard';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface PageProps {
  searchParams?: {
    tab?: string;
    status?: string;
  };
}

export default function JobsPage({ searchParams: initialSearchParams }: PageProps) {
  // Use the useSearchParams hook to get the current URL search params
  const searchParamsObj = useSearchParams();
  
  // Get the current tab and status from URL or use defaults
  const tab = searchParamsObj?.get('tab') || initialSearchParams?.tab || 'upcoming';
  const status = searchParamsObj?.get('status') || initialSearchParams?.status || 
                (tab === 'upcoming' ? 'upcoming' : 'pending');
  
  // Create a stable searchParams object to pass to JobDashboard
  const stableSearchParams = React.useMemo(() => ({
    tab,
    status
  }), [tab, status]);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-screen-xl mx-auto px-4 bg-[#111111] min-h-screen"
    >
      <div className="w-full flex flex-col items-center">
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
  );
}