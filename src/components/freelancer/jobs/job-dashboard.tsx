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
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform database job to JobCard expected format
  const transformJobForCard = (dbJob: any) => {
    // Map original job status to our 3-status system
    let displayStatus: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
    if (dbJob.status === 'completed') {
      displayStatus = 'completed';
    } else if (dbJob.status === 'cancelled') {
      displayStatus = 'cancelled';
    }
    // 'confirmed' and 'pending' default to 'upcoming'

    return {
      id: dbJob.id,
      title: dbJob.title,
      category: dbJob.category,
      date: new Date().toISOString().split('T')[0], // Use current date as fallback
      time: '09:00', // Default time
      jobDate: new Date().toISOString(),
      jobTime: '09:00',
      status: displayStatus, // Use the mapped status
      payment: dbJob.payment || 0,
      location: dbJob.location,
      description: dbJob.description,
      skills: dbJob.skills || [],
      duration: dbJob.duration || 'Flexible',
      experienceLevel: dbJob.experience || 'Intermediate',
      client: dbJob.client ? {
        name: dbJob.client.name,
        rating: 4.5, // Default rating
        jobsCompleted: 10, // Default value
        memberSince: '2023-01-01',
        phoneNumber: '+91 9876543210',
        image: dbJob.client.avatar,
        moneySpent: 50000,
        location: dbJob.client.location,
        joinedDate: '2023-01-01',
        freelancersWorked: 15,
        freelancerAvatars: []
      } : undefined,
      cancellationDetails: undefined,
      rating: undefined,
      clientRating: undefined,
      earnings: undefined,
      completedAt: undefined
    };
  };

  // Initialize with mock data instead of API calls
  useEffect(() => {
    const jobsWithUpdates = applyStoredJobUpdates();
    setJobs(jobsWithUpdates);
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  // Function to apply stored job updates from localStorage
  const applyStoredJobUpdates = () => {
    try {
      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
      const updatedJobs = mockUpcomingJobs.map(job => {
        if (storedUpdates[job.id]) {
          return { ...job, ...storedUpdates[job.id] };
        }
        return job;
      });
      return updatedJobs;
    } catch (error) {
      console.error('Error loading job updates from localStorage:', error);
      return mockUpcomingJobs;
    }
  };

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
    } else if (tabFromUrl === 'applications' && !['pending', 'accepted', 'rejected', 'withdrawn'].includes(statusFromUrl)) {
      statusFromUrl = 'pending';
    }

    // Update component state
    setActiveTab(tabFromUrl);
    setStatusFilter(statusFromUrl);
  }, [searchParams]);

  // Filter jobs and applications based on search and status
  const filteredJobs = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();

    if (!searchLower) {
      if (statusFilter === 'completed') {
        return jobs.filter(job => job.status === 'completed').map(transformJobForCard);
      } else if (statusFilter === 'cancelled') {
        return jobs.filter(job => job.status === 'cancelled').map(transformJobForCard);
      }
      // Default to upcoming (includes confirmed and pending)
      return jobs.filter(job => job.status === 'confirmed' || job.status === 'pending').map(transformJobForCard);
    }

    const filtered = jobs.filter(job => {
      const matchesSearch = [
        job.title,
        job.category,
        job.location,
        job.description,
        job.client?.name,
        job.payment?.toString()
      ].some(value => value && value.toString().toLowerCase().includes(searchLower));

      // Apply status filter if specified
      const matchesStatus = statusFilter === 'upcoming' ||
        (statusFilter === 'completed' && job.status === 'completed') ||
        (statusFilter === 'cancelled' && job.status === 'cancelled');

      return matchesSearch && matchesStatus;
    });

    return filtered.map(transformJobForCard);
  }, [jobs, searchQuery, statusFilter]);

  const filteredApplications = useMemo(() => {
    if (!applications || applications.length === 0) {
      return [];
    }

    const searchLower = searchQuery.trim().toLowerCase();

    if (!searchLower) {
      return applications.filter(app => {
        if (statusFilter === 'pending') return app.status === 'pending';
        if (statusFilter === 'accepted') return app.status === 'accepted';
        if (statusFilter === 'rejected') return app.status === 'rejected';
        if (statusFilter === 'withdrawn') return app.status === 'withdrawn';
        return true;
      });
    }

    return applications.filter(app => {
      const matchesSearch = [
        app.job?.title,
        app.job?.location,
        app.coverLetter,
        app.proposedRate?.toString()
      ].some(value => value && value.toString().toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      if (statusFilter === 'pending') return app.status === 'pending';
      if (statusFilter === 'accepted') return app.status === 'accepted';
      if (statusFilter === 'rejected') return app.status === 'rejected';
      if (statusFilter === 'withdrawn') return app.status === 'withdrawn';

      return true;
    });
  }, [applications, searchQuery, statusFilter]);

  // Calculate counts for each tab and status
  const tabCounts = useMemo(() => {
    const upcomingJobs = jobs.filter(job => job.status === 'confirmed' || job.status === 'pending');
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const cancelledJobs = jobs.filter(job => job.status === 'cancelled');

    const pendingApplications = applications.filter(app => app.status === 'pending');
    const acceptedApplications = applications.filter(app => app.status === 'accepted');
    const rejectedApplications = applications.filter(app => app.status === 'rejected');
    const withdrawnApplications = applications.filter(app => app.status === 'withdrawn');

    return {
      upcoming: upcomingJobs.length,
      completed: completedJobs.length,
      cancelled: cancelledJobs.length,
      applications: applications.length,
      pending: pendingApplications.length,
      accepted: acceptedApplications.length,
      rejected: rejectedApplications.length,
      withdrawn: withdrawnApplications.length,
    };
  }, [jobs, applications]);

  // Status filter options
  const statusOptions = useMemo(() => {
    if (activeTab === 'upcoming') {
      return [
        { value: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
        { value: 'completed', label: 'Completed', count: tabCounts.completed },
        { value: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled }
      ] as const;
    } else if (activeTab === 'applications') {
      return [
        { value: 'pending', label: 'Pending', count: tabCounts.pending },
        { value: 'accepted', label: 'Accepted', count: tabCounts.accepted },
        { value: 'rejected', label: 'Rejected', count: tabCounts.rejected },
        { value: 'withdrawn', label: 'Withdrawn', count: tabCounts.withdrawn }
      ] as const;
    }
    return [] as const;
  }, [activeTab, tabCounts]);

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

    // Auto-scroll the selected chip into view after a brief delay
    setTimeout(() => scrollSelectedChipIntoView(newFilter), 100);
  };

  const handleApplicationStatusChange = (applicationId: string, newStatus: string) => {
    if (newStatus === 'withdrawn') {
      // Update the applications array to reflect the status change
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app["#"] === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Automatically switch to withdrawn tab when application is withdrawn
      setStatusFilter('withdrawn');
      setActiveTab('applications');

      // Update URL to reflect the change
      const params = new URLSearchParams();
      params.set('tab', 'applications');
      params.set('status', 'withdrawn');
      router.push(`/freelancer/jobs?${params.toString()}`);
    }
  };

  const handleJobStatusChange = (jobId: string, newStatus: 'completed' | 'cancelled') => {
    console.log(`Updating job ${jobId} status to ${newStatus}`);

    // Update the jobs array to reflect the status change
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    // Automatically switch to the appropriate tab when job status changes
    if (newStatus === 'completed') {
      setStatusFilter('completed');
      setActiveTab('upcoming'); // Stay in upcoming tab but filter for completed

      // Update URL to reflect the change
      const params = new URLSearchParams();
      params.set('tab', 'upcoming');
      params.set('status', 'completed');
      router.push(`/freelancer/jobs?${params.toString()}`);
    } else if (newStatus === 'cancelled') {
      setStatusFilter('cancelled');
      setActiveTab('upcoming'); // Stay in upcoming tab but filter for cancelled

      // Update URL to reflect the change
      const params = new URLSearchParams();
      params.set('tab', 'upcoming');
      params.set('status', 'cancelled');
      router.push(`/freelancer/jobs?${params.toString()}`);
    }
  };

  // Handler for viewing application details (placeholder for now)
  const onViewDetails = (application: any) => {
    // Navigate to the application details page
    router.push(`/freelancer/proposals/${application["#"]}`);
  };

  // Ref for the status chips scroll container
  const statusChipsRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll selected chip into view
  const scrollSelectedChipIntoView = (selectedValue: string) => {
    if (statusChipsRef.current) {
      const selectedChip = statusChipsRef.current.querySelector(`[data-value="${selectedValue}"]`) as HTMLElement;
      if (selectedChip) {
        selectedChip.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  // Prevent wheel events on header from scrolling the page
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      // Allow wheel events inside scrollable content and the horizontal chips container
      if (target.closest('.scrollable-content')) return;
      if (target.closest('.allow-horizontal-scroll')) return;

      e.preventDefault();
      e.stopPropagation();
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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 h-10">
                <TabsTrigger value="upcoming">
                  My Jobs
                  {tabCounts.upcoming + tabCounts.completed + tabCounts.cancelled > 0 && (
                    <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      {tabCounts.upcoming + tabCounts.completed + tabCounts.cancelled}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="applications">
                  My Proposals
                  {tabCounts.applications > 0 && (
                    <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      {tabCounts.applications}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-3 min-w-0">
                <div className={`transition-all duration-300 ease-in-out ${showSearch ? 'flex-1 min-w-0' : 'w-10'}`}>
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
                  <div className="flex-shrink-0 w-80 sm:w-96">
                    <div
                      ref={statusChipsRef}
                      className="flex items-center gap-2 overflow-x-auto scrollbar-hide allow-horizontal-scroll"
                    >
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          data-value={option.value}
                          onClick={() => handleFilterChange(option.value)}
                          className={`px-2 py-1 text-xs rounded-full border transition-colors flex items-center gap-1 flex-shrink-0 ${
                            statusFilter === option.value
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800/50'
                          }`}
                        >
                          {option.label}
                          {option.count > 0 && (
                            <span className={`text-xs px-1 py-0.5 rounded-full ${
                              statusFilter === option.value
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-700 text-gray-400'
                            }`}>
                              {option.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
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
                            onStatusChange={handleJobStatusChange}
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
                            : 'Jobs will appear here once they are posted.'}
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
                            onStatusChange={handleApplicationStatusChange}
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
