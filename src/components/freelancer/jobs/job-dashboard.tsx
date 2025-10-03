'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Import components, types, utils, and mock data from our modular files
import { JobCard, ApplicationCard } from './index';
import { Application } from './types';
import { mockUpcomingJobs, mockApplications } from './mock-data';

interface JobDashboardProps {
  searchParams?: {
    tab?: string;
    status?: string;
  };
}

export function JobDashboard({ searchParams }: JobDashboardProps) {
  // State management
  const router = useRouter();
  const initialTab = searchParams?.tab === 'applications' ? 'applications' : 'upcoming';
  const initialStatus = searchParams?.status || (initialTab === 'upcoming' ? 'upcoming' : 'pending');
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // Initialize state from URL params and update when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Extract tab from URL parameters
    let tabFromUrl = 'upcoming';
    if (searchParams?.tab === 'applications') {
      tabFromUrl = 'applications';
    }
    
    // Extract status from URL parameters with defaults
    let statusFromUrl = searchParams?.status || (tabFromUrl === 'upcoming' ? 'upcoming' : 'pending');
    
    // Validate status based on current tab
    if (tabFromUrl === 'upcoming' && !['upcoming', 'completed', 'cancelled'].includes(statusFromUrl)) {
      statusFromUrl = 'upcoming';
    } else if (tabFromUrl === 'applications' && !['pending', 'accepted', 'rejected'].includes(statusFromUrl)) {
      statusFromUrl = 'pending';
    }
    
    // Update component state
    setActiveTab(tabFromUrl);
    setStatusFilter(statusFromUrl);
  }, [searchParams]);

  // Filter jobs and applications based on search and status
  const filteredJobs = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();
    
    // If search query is empty, just filter by status
    if (!searchLower) {
      return mockUpcomingJobs.filter(job => {
        if (statusFilter === 'upcoming') return job.status === 'pending' || job.status === 'confirmed';
        if (statusFilter === 'completed') return job.status === 'completed';
        if (statusFilter === 'cancelled') return job.status === 'cancelled';
        return true;
      });
    }

    // Search across multiple job properties
    return mockUpcomingJobs.filter(job => {
      const matchesSearch = [
        job.title,
        job.category,
        job.location,
        job.description,
        job.client?.name,
        job.payment?.toString(),
        job.duration,
        job.experienceLevel,
        ...(job.skills || [])
      ].some(value => value && value.toString().toLowerCase().includes(searchLower));

      // Filter by status
      let statusMatches = true;
      if (statusFilter === 'upcoming') {
        statusMatches = job.status === 'pending' || job.status === 'confirmed' || job.status === 'upcoming';
      } else if (statusFilter === 'completed') {
        statusMatches = job.status === 'completed';
      } else if (statusFilter === 'cancelled') {
        statusMatches = job.status === 'cancelled';
      }
      
      return matchesSearch && statusMatches;
    });
  }, [searchQuery, statusFilter]);

  const filteredApplications = useMemo(() => {
    if (!mockApplications || mockApplications.length === 0) {
      return [];
    }
    
    const searchLower = searchQuery.trim().toLowerCase();
    
    // If search query is empty, just filter by status
    if (!searchLower) {
      return mockApplications.filter(app => {
        if (statusFilter === 'pending') return app.status === 'pending';
        if (statusFilter === 'accepted') return app.status === 'accepted';
        if (statusFilter === 'rejected') return app.status === 'rejected';
        return true;
      });
    }
    
    // Search across multiple application properties
    return mockApplications.filter(app => {
      const matchesSearch = [
        app.jobTitle,
        app.location,
        app.description,
        app.clientName,
        app.budget?.toString(),
        app.duration,
        app.appliedDate?.toString()
      ].some(value => value && value.toString().toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
      
      // Status filtering based on the current filter
      if (statusFilter === 'pending') return app.status === 'pending';
      if (statusFilter === 'accepted') return app.status === 'accepted';
      if (statusFilter === 'rejected') return app.status === 'rejected';
      
      return true;
    });
  }, [searchQuery, statusFilter]);

  // Status filter options
  const statusOptions = useMemo(() => {
    if (activeTab === 'upcoming') {
      return [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ] as const;
    } else if (activeTab === 'applications') {
      return [
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' }
      ] as const;
    }
    return [] as const;
  }, [activeTab]);

  // Event handlers
  const handleTabChange = (value: string) => {
    const newTab = value === 'applications' ? 'applications' : 'upcoming';
    const defaultStatus = newTab === 'applications' ? 'pending' : 'upcoming';
    
    // Update URL with new tab and status using Next.js router
    const params = new URLSearchParams();
    params.set('tab', newTab);
    params.set('status', defaultStatus);
    router.push(`/freelancer/jobs?${params.toString()}`);
    
    // Update state
    setActiveTab(newTab);
    setStatusFilter(defaultStatus);
  };

  const handleFilterChange = (newFilter: string) => {
    // Update URL with the new status filter using Next.js router
    const params = new URLSearchParams();
    params.set('tab', activeTab);
    params.set('status', newFilter);
    
    // Update state
    setStatusFilter(newFilter);
  };

  const onViewDetails = (application: Application) => {
    console.log('View details of application:', application);
  };

  // Prevent wheel events on header from scrolling the page
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.scrollable-content')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const header = document.querySelector('.fixed-header');
    if (header) {
      header.addEventListener('wheel', handleWheel as EventListener, { passive: false });
      return () => {
        header.removeEventListener('wheel', handleWheel as EventListener);
      };
    }
  }, []);

  return (
    <div className="w-full text-foreground bg-[#111111] min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed-header w-full bg-[#111111] fixed top-0 left-0 right-0 z-40 border-b border-gray-800">
        <div className="w-full px-2">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full pt-2"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 h-10">
                <TabsTrigger value="upcoming">My Jobs</TabsTrigger>
                <TabsTrigger value="applications">My Proposals</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center w-full sm:w-auto gap-3">
                <div className={`transition-all duration-300 ease-in-out ${showSearch ? 'flex-1' : 'w-10'}`}>
                  {showSearch ? (
                    <div className="relative w-full flex items-center">
                      <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 pr-10 w-full bg-gray-900 text-white h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="absolute right-2 h-6 w-6 p-0 text-gray-400 hover:text-white flex items-center justify-center"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearch(false);
                        }}
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Cancel search</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="h-10 w-10 p-0 text-gray-400 hover:text-white flex items-center justify-center"
                      onClick={() => setShowSearch(true)}
                    >
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </button>
                  )}
                </div>
                
                {activeTab !== 'earnings' && statusOptions.length > 0 && !showSearch && (
                  <div className="flex items-center gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange(option.value)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          statusFilter === option.value
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="scrollable-content h-[calc(100vh-180px)] overflow-y-auto pt-4 pb-32 w-full scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="w-full px-2"
                >
                  {/* Upcoming Jobs Tab */}
                  <TabsContent value="upcoming" className="mt-0 w-full">
                    {filteredJobs.length > 0 ? (
                      <div className="space-y-4 w-full">
                        {filteredJobs.map((job) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            index={filteredJobs.indexOf(job)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-800 p-4 rounded-full mb-4">
                          <svg
                            className="h-12 w-12 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-1">
                          No {statusFilter === 'upcoming' ? 'upcoming' : statusFilter} jobs found
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          {searchQuery
                            ? 'Try adjusting your search or filter to find what you\'re looking for.'
                            : 'When you have upcoming jobs, they will appear here.'}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Applications Tab */}
                  <TabsContent value="applications" className="mt-0 w-full">
                    {filteredApplications.length > 0 ? (
                      <div className="space-y-4 w-full">
                        {filteredApplications.map((application) => (
                          <ApplicationCard
                            key={application["#"]}
                            application={application}
                            index={filteredApplications.indexOf(application)}
                            onViewDetails={() => onViewDetails(application)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-800 p-4 rounded-full mb-4">
                          <svg
                            className="h-12 w-12 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-300 mb-1">
                          No {statusFilter} applications found
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          {searchQuery
                            ? 'Try adjusting your search or filter to find what you\'re looking for.'
                            : 'When you submit proposals, they will appear here.'}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
