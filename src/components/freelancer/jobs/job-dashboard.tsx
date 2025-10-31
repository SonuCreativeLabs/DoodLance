'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Import components, types, utils, and mock data from our modular files
import { JobCard, ApplicationCard } from './index';
import { Application, JobCategory } from './types';
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
  const initialStatus = searchParams?.status || (initialTab === 'upcoming' ? 'ongoing' : 'pending');

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
    let displayStatus: 'upcoming' | 'completed' | 'cancelled' | 'ongoing' = 'upcoming';
    if (dbJob.status === 'completed') {
      displayStatus = 'completed';
    } else if (dbJob.status === 'cancelled') {
      displayStatus = 'cancelled';
    } else if (dbJob.status === 'started') {
      displayStatus = 'ongoing';
    }
    // 'confirmed' and 'pending' default to 'upcoming'

    return {
      id: dbJob.id || `job_${Date.now()}_${Math.random()}`,
      title: dbJob.title || 'Untitled Job',
      category: dbJob.category || 'Other',
      date: dbJob.date || new Date().toISOString().split('T')[0],
      time: dbJob.time || '09:00',
      jobDate: dbJob.date || new Date().toISOString(),
      jobTime: dbJob.time || '09:00',
      status: displayStatus,
      payment: Number(dbJob.payment) || 0,
      location: dbJob.location || 'Location not specified',
      description: dbJob.description || 'No description available',
      skills: Array.isArray(dbJob.skills) ? dbJob.skills : [],
      duration: dbJob.duration || 'Not specified',
      experienceLevel: dbJob.experienceLevel || 'Any',
      client: dbJob.client || {
        name: 'Unknown Client',
        rating: 4.5,
        jobsCompleted: 10,
        memberSince: new Date().toISOString().split('T')[0],
        phoneNumber: '+91 9876543210',
        image: '',
        moneySpent: 50000,
        location: 'Location not specified',
        joinedDate: new Date().toISOString().split('T')[0],
        freelancersWorked: 15,
        freelancerAvatars: []
      },
      cancellationDetails: dbJob.cancellationDetails,
      rating: dbJob.rating,
      clientRating: dbJob.clientRating,
      earnings: dbJob.earnings,
      completedAt: dbJob.completedAt,
      freelancerRating: dbJob.freelancerRating
    };
  };

  // Function to apply stored job updates from localStorage
  const applyStoredJobUpdates = () => {
    try {
      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

      // If localStorage is empty or corrupted, use only mock data
      if (!storedUpdates || Object.keys(storedUpdates).length === 0) {
        console.log('No stored updates found, using mock data only');
        return mockUpcomingJobs;
      }

      // Start with mock data as base
      let updatedJobs = [...mockUpcomingJobs];

      // If we have stored job data, merge it properly with mock data
      if (Object.keys(storedUpdates).length > 0) {
        // Update jobs with stored data
        updatedJobs = updatedJobs.map(originalJob => {
          const storedUpdate = storedUpdates[originalJob.id];
          if (storedUpdate) {
            // Merge stored updates with original job data, but prioritize original data
            return {
              ...originalJob,  // Start with complete original job data
              ...storedUpdate,  // Override with stored updates (status, timestamps, etc.)
              id: originalJob.id,  // Preserve original ID
              // Ensure title and other core data comes from original
              title: originalJob.title,
              category: originalJob.category,
              description: originalJob.description,
              client: originalJob.client,
              payment: originalJob.payment,
              location: originalJob.location,
              skills: originalJob.skills,
              duration: originalJob.duration,
              experienceLevel: originalJob.experienceLevel,
            };
          }
          return originalJob;
        });

        // Add any jobs that exist only in stored data (jobs that were completed/cancelled)
        Object.values(storedUpdates).forEach((storedJob: any) => {
          const existingIndex = updatedJobs.findIndex(job => job.id === storedJob.id);
          if (existingIndex === -1) {
            // This job only exists in stored data, add it with original data if available
            const originalJobData = mockUpcomingJobs.find(j => j.id === storedJob.id);
            if (originalJobData) {
              updatedJobs.push({
                ...originalJobData,  // Use original data as base
                ...storedJob,        // Override with stored status data
                id: storedJob.id,
              });
            }
          }
        });
      }

      // Filter out any potential duplicates and ensure unique IDs
      const uniqueJobs = updatedJobs.filter((job, index, self) =>
        index === self.findIndex(j => j.id === job.id)
      );

      // Add default freelancerRating to legacy completed jobs that don't have it
      const jobsWithRatings = uniqueJobs.map(job => {
        if (job.status === 'completed' && !job.freelancerRating) {
          // This is a legacy completed job without freelancerRating data
          return {
            ...job,
            freelancerRating: {
              stars: 0,
              review: '',
              feedbackChips: [],
              date: job.completedAt || new Date().toISOString()
            }
          };
        }
        return job;
      });

      console.log(`Loaded jobs: ${jobsWithRatings.length} total (${Object.keys(storedUpdates).length} stored, ${mockUpcomingJobs.length} mock)`);

      // Debug: Check if any completed jobs have rating/review data
      const completedJobsWithData = jobsWithRatings.filter(job => job.status === 'completed');
      completedJobsWithData.forEach(job => {
        const jobData = job as any; // Type assertion for dynamic properties
        if (jobData.freelancerRating) {
          console.log(`✅ Completed job ${job.id} has rating/review data:`, {
            freelancerRating: jobData.freelancerRating
          });
        } else {
          console.log(`❌ Completed job ${job.id} missing rating/review data:`, {
            freelancerRating: jobData.freelancerRating
          });
        }
      });

      return jobsWithRatings;
    } catch (error) {
      console.error('Error loading job updates from localStorage:', error);
      // If there's any error, fall back to mock data only
      return mockUpcomingJobs;
    }
  };

  // Initialize with mock data instead of API calls
  useEffect(() => {
    // Clean up any duplicate entries in localStorage first
    cleanupDuplicateJobs();

    const jobsWithUpdates = applyStoredJobUpdates();
    setJobs(jobsWithUpdates);
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  // Listen for localStorage changes to refresh jobs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jobStatusUpdates' && e.newValue) {
        console.log('localStorage updated, refreshing jobs...');

        // Clean up duplicates first
        cleanupDuplicateJobs();

        const jobsWithUpdates = applyStoredJobUpdates();
        setJobs(jobsWithUpdates);
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      console.log('Custom job status update event received:', e.detail);

      // Clean up duplicates first
      cleanupDuplicateJobs();

      const jobsWithUpdates = applyStoredJobUpdates();
      setJobs(jobsWithUpdates);

      // Auto-switch to appropriate tab if job was completed/cancelled, but delay to avoid race conditions
      setTimeout(() => {
        if (e.detail.newStatus === 'completed') {
          setStatusFilter('completed');
          setActiveTab('upcoming');
        } else if (e.detail.newStatus === 'cancelled') {
          setStatusFilter('cancelled');
          setActiveTab('upcoming');
        }
      }, 50);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jobStatusUpdated', handleCustomEvent as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jobStatusUpdated', handleCustomEvent as EventListener);
    };
  }, []);

  // Function to clean up duplicate entries in localStorage
  const cleanupDuplicateJobs = () => {
    try {
      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

      // Find and remove duplicate entries for the same job ID
      const jobIds = Object.keys(storedUpdates);
      const seenIds = new Set();
      const cleanedUpdates: {[key: string]: any} = {};

      jobIds.forEach(jobId => {
        if (!seenIds.has(jobId)) {
          seenIds.add(jobId);
          cleanedUpdates[jobId] = storedUpdates[jobId];
        } else {
          console.log(`Removing duplicate entry for job ${jobId}`);
        }
      });

      if (Object.keys(cleanedUpdates).length !== Object.keys(storedUpdates).length) {
        localStorage.setItem('jobStatusUpdates', JSON.stringify(cleanedUpdates));
        console.log(`Cleaned up localStorage: ${Object.keys(storedUpdates).length} → ${Object.keys(cleanedUpdates).length} unique jobs`);
      }

      return cleanedUpdates;
    } catch (error) {
      console.error('Error cleaning up duplicate jobs:', error);
      return {};
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
    let statusFromUrl = searchParams?.status || (tabFromUrl === 'upcoming' ? 'ongoing' : 'pending');

    // Validate status based on current tab
    if (tabFromUrl === 'upcoming' && !['upcoming', 'ongoing', 'completed', 'cancelled'].includes(statusFromUrl)) {
      statusFromUrl = 'ongoing';
    } else if (tabFromUrl === 'applications' && !['pending', 'accepted', 'rejected', 'withdrawn'].includes(statusFromUrl)) {
      statusFromUrl = 'pending';
    }

    // Update component state
    setActiveTab(tabFromUrl);
    setStatusFilter(statusFromUrl);
  }, [searchParams]);

  // Transform application to job-like format for display in upcoming section
  const transformApplicationForCard = (application: Application) => {
    return {
      id: application["#"],
      title: application.jobTitle,
      category: application.category as JobCategory,
      date: application.appliedDate,
      time: 'TBD',
      status: 'upcoming' as const,
      payment: `${application.budget.min} - ${application.budget.max}`,
      location: application.location,
      description: application.description,
      client: {
        name: application.clientName,
        rating: application.clientRating,
        image: application.clientImage,
        location: application.location,
        projectsCompleted: application.projectsCompleted,
        memberSince: application.clientSince,
        freelancersWorked: application.freelancersWorked,
        freelancerAvatars: application.freelancerAvatars,
        experienceLevel: application.experienceLevel
      },
      // Flag to identify this as a proposal/accepted application
      isProposal: true
    };
  };

  // Filter jobs and applications based on search and status
  const filteredJobs = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();

    if (!searchLower) {
      if (statusFilter === 'completed') {
        return jobs.filter(job => job.status === 'completed').map(transformJobForCard);
      } else if (statusFilter === 'cancelled') {
        return jobs.filter(job => job.status === 'cancelled').map(transformJobForCard);
      } else if (statusFilter === 'ongoing') {
        return jobs.filter(job => job.status === 'started').map(transformJobForCard);
      }
      // Default to upcoming (includes confirmed, pending jobs AND accepted applications)
      const regularJobs = jobs.filter(job => job.status === 'confirmed' || job.status === 'pending').map(transformJobForCard);
      const acceptedApplications = applications.filter(app => app.status === 'accepted').map(transformApplicationForCard);

      return [...regularJobs, ...acceptedApplications];
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
        (statusFilter === 'cancelled' && job.status === 'cancelled') ||
        (statusFilter === 'ongoing' && job.status === 'started');

      return matchesSearch && matchesStatus;
    });

    const filteredApplications = applications.filter(app => {
      const matchesSearch = [
        app.jobTitle,
        app.category,
        app.location,
        app.description,
        app.clientName
      ].some(value => value && value.toString().toLowerCase().includes(searchLower));

      const matchesStatus = statusFilter === 'upcoming' && app.status === 'accepted';

      return matchesSearch && matchesStatus;
    });

    return [...filtered.map(transformJobForCard), ...filteredApplications.map(transformApplicationForCard)];
  }, [jobs, applications, searchQuery, statusFilter]);

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
    const ongoingJobs = jobs.filter(job => job.status === 'started');
    const completedJobs = jobs.filter(job => job.status === 'completed');
    const cancelledJobs = jobs.filter(job => job.status === 'cancelled');

    const pendingApplications = applications.filter(app => app.status === 'pending');
    const acceptedApplications = applications.filter(app => app.status === 'accepted');
    const rejectedApplications = applications.filter(app => app.status === 'rejected');
    const withdrawnApplications = applications.filter(app => app.status === 'withdrawn');

    return {
      upcoming: upcomingJobs.length,
      ongoing: ongoingJobs.length,
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
        { value: 'ongoing', label: 'Ongoing', count: tabCounts.ongoing },
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
    } else if (newStatus === 'accepted') {
      // Handle acceptance: move to accepted status and create job
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app["#"] === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Import and use acceptProposalAndCreateJob function
      import('./mock-data').then(({ acceptProposalAndCreateJob }) => {
        const newJob = acceptProposalAndCreateJob(applicationId);

        if (newJob) {
          // Add the new job to the jobs state
          setJobs(prevJobs => [...prevJobs, newJob]);

          // Switch to My Jobs tab and upcoming status
          setActiveTab('upcoming');
          setStatusFilter('upcoming');

          // Update URL
          const params = new URLSearchParams();
          params.set('tab', 'upcoming');
          params.set('status', 'upcoming');
          router.push(`/freelancer/jobs?${params.toString()}`);

          alert('Proposal accepted! Job has been added to My Jobs.');
        } else {
          alert('Failed to accept proposal. Please try again.');
        }
      }).catch(error => {
        console.error('Error accepting proposal:', error);
        alert('Error accepting proposal. Please try again.');
      });
    }
  };

  const handleJobStatusChange = (jobId: string, newStatus: 'completed' | 'cancelled' | 'started', notes?: string) => {
    console.log(`Updating job ${jobId} status to ${newStatus}`);

    // Update the jobs array with complete data from localStorage
    const jobsWithUpdates = applyStoredJobUpdates();
    setJobs(jobsWithUpdates);

    // Save the status update to localStorage (in case it wasn't saved properly)
    try {
      // Clean up duplicates first
      cleanupDuplicateJobs();

      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

      // Check if this job already exists in stored updates
      const existingJobData = storedUpdates[jobId];
      if (!existingJobData || existingJobData.status !== newStatus) {
        // Get the original job data from mock data as fallback
        const originalJobData = mockUpcomingJobs.find(j => j.id === jobId) || jobs.find(j => j.id === jobId);

        if (originalJobData) {
          storedUpdates[jobId] = {
            ...originalJobData,  // Use original data as base
            status: newStatus,
            updatedAt: new Date().toISOString(),
            startedAt: newStatus === 'started' ? new Date().toISOString() : originalJobData.startedAt,
            ...(newStatus === 'cancelled' && {
              cancellationDetails: {
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'freelancer',
                notes: notes || 'Cancelled by freelancer'
              }
            }),
            ...(newStatus === 'completed' && {
              completedAt: new Date().toISOString(),
              // Don't override freelancerRating if it already exists
              ...(originalJobData.freelancerRating === undefined && {
                freelancerRating: {
                  stars: 0,
                  review: '',
                  feedbackChips: [],
                  date: new Date().toISOString()
                }
              })
            })
          };
        }

        localStorage.setItem('jobStatusUpdates', JSON.stringify(storedUpdates));
        console.log(`Updated job ${jobId} status to ${newStatus} in localStorage`);
      }
    } catch (error) {
      console.error('Error saving job status update to localStorage:', error);
    }

    // Automatically switch to the appropriate tab when job status changes
    if (newStatus === 'completed') {
      // Update filter but don't immediately change URL to avoid navigation issues
      setStatusFilter('completed');
      setActiveTab('upcoming');

      // Delay URL update to avoid race conditions
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set('tab', 'upcoming');
        params.set('status', 'completed');
        router.push(`/freelancer/jobs?${params.toString()}`);
      }, 100);
    } else if (newStatus === 'cancelled') {
      // Update filter but don't immediately change URL to avoid navigation issues
      setStatusFilter('cancelled');
      setActiveTab('upcoming');

      // Delay URL update to avoid race conditions
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set('tab', 'upcoming');
        params.set('status', 'cancelled');
        router.push(`/freelancer/jobs?${params.toString()}`);
      }, 100);
    } else if (newStatus === 'started') {
      // Update filter to ongoing and switch to My Jobs tab
      setStatusFilter('ongoing');
      setActiveTab('upcoming');

      // Delay URL update to avoid race conditions
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set('tab', 'upcoming');
        params.set('status', 'ongoing');
        router.push(`/freelancer/jobs?${params.toString()}`);
      }, 100);
    }
  };

  // Make handleJobStatusChange globally accessible for the job details page
  React.useEffect(() => {
    (window as any).dashboardHandleJobStatusChange = handleJobStatusChange;
    return () => {
      delete (window as any).dashboardHandleJobStatusChange;
    };
  }, []);

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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 py-2">
              <TabsList className="grid w-full sm:w-auto grid-cols-2 h-12 bg-transparent p-1 gap-1">
                <TabsTrigger
                  value="upcoming"
                  className="relative px-4 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B66D1] data-[state=active]:to-[#9B76E1] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#8B66D1]/25 data-[state=active]:rounded-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:bg-transparent data-[state=inactive]:rounded-lg data-[state=inactive]:border data-[state=inactive]:border-gray-600/50"
                >
                  My Jobs
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="relative px-4 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B66D1] data-[state=active]:to-[#9B76E1] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#8B66D1]/25 data-[state=active]:rounded-lg data-[state=inactive]:text-gray-300 data-[state=inactive]:bg-transparent data-[state=inactive]:rounded-lg data-[state=inactive]:border data-[state=inactive]:border-gray-600/50"
                >
                  My Proposals
                </TabsTrigger>
              </TabsList>
              
              <div className={`flex items-center gap-3 ${showSearch ? 'w-full' : 'min-w-0'}`}>
                <div className={`transition-all duration-300 ${showSearch ? 'ease-out' : 'ease-in'} ${showSearch ? 'flex-1' : 'w-10'}`}>
                  {showSearch ? (
                    <div className={`relative w-full flex items-center transition-all duration-300 ease-out ${showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                      <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 pr-10 w-full bg-[#111111] text-white h-10 border border-gray-600 focus:border-gray-500 transition-all duration-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="absolute right-2 h-6 w-6 p-0 text-gray-400 hover:text-white flex items-center justify-center transition-colors duration-200"
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
                      className={`h-10 w-10 p-0 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 ease-in ${!showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
                          className={`px-1.5 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1 flex-shrink-0 ${
                            statusFilter === option.value
                              ? 'bg-[#8B66D1]/20 border-[#8B66D1]/40 text-white'
                              : 'bg-transparent border-[var(--border)] text-[var(--foreground)]/70 hover:bg-[var(--card-background)]/50'
                          }`}
                        >
                          {option.label}
                          <span className={`text-xs px-0.5 py-0.5 rounded-full ${
                            statusFilter === option.value
                              ? 'text-gray-300'
                              : 'text-gray-500'
                          }`}>
                            {option.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="scrollable-content h-[calc(100vh-180px)] overflow-y-auto pt-2 pb-32 w-full scrollbar-hide">
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
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-gray-700/30">
                            <svg
                              className="h-10 w-10 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h3 className="text-xl font-semibold text-white">
                            No {statusFilter === 'upcoming' ? 'upcoming' : statusFilter === 'ongoing' ? 'ongoing' : statusFilter} jobs found
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {searchQuery
                              ? 'Try adjusting your search or filter to find what you\'re looking for.'
                              : 'Jobs will appear here once they are posted and available for you.'}
                          </p>
                        </div>
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
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-gray-700/30">
                            <svg
                              className="h-10 w-10 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h3 className="text-xl font-semibold text-white">
                            No {statusFilter} applications found
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {searchQuery
                              ? 'Try adjusting your search or filter to find what you\'re looking for.'
                              : 'When you submit proposals, they will appear here.'}
                          </p>
                        </div>
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
