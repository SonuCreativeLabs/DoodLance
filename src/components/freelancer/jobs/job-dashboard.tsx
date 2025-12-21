'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Import components, types, utils, and mock data from our modular files
import { JobCard, ApplicationCard } from './index';
import { Job, Application, EarningsData, JobCategory } from './types';
import { mockUpcomingJobs } from './mock-data';

// LocalStorage key for client bookings
const CLIENT_BOOKINGS_KEY = 'clientBookings';

// Convert client booking to freelancer job format
const convertBookingToJob = (booking: any): Job => {
  // Parse the date - handle both YYYY-MM-DD and formatted dates
  let jobDate = booking.date;
  if (booking.date && !booking.date.includes('-')) {
    // It's a formatted date, try to parse it
    const parsedDate = new Date(booking.date);
    if (!isNaN(parsedDate.getTime())) {
      jobDate = parsedDate.toISOString().split('T')[0];
    }
  }

  // Map booking status to job status
  // 'confirmed' bookings should show as 'pending' (upcoming) jobs
  // 'ongoing' bookings should show as 'started' jobs
  let jobStatus: 'pending' | 'started' | 'completed' | 'cancelled' = 'pending';
  if (booking.status === 'ongoing') {
    jobStatus = 'started';
  } else if (booking.status === 'completed') {
    jobStatus = 'completed';
  } else if (booking.status === 'cancelled') {
    jobStatus = 'cancelled';
  }

  // Generate a unique 4-digit OTP for this booking
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Check if we already have an OTP stored for this booking
  let storedOtp = '1234'; // Default for testing
  try {
    const otpStore = JSON.parse(localStorage.getItem('bookingOtps') || '{}');
    if (otpStore[booking['#']]) {
      storedOtp = otpStore[booking['#']];
    } else {
      storedOtp = generateOtp();
      otpStore[booking['#']] = storedOtp;
      localStorage.setItem('bookingOtps', JSON.stringify(otpStore));
    }
  } catch (e) {
    console.error('Error managing OTP:', e);
  }

  return {
    id: booking['#'] || `booking_${Date.now()}`,
    title: booking.service || 'Service Booking',
    category: (booking.category as JobCategory) || 'OTHER',
    date: jobDate,
    time: booking.time || '10:00 AM',
    jobDate: jobDate,
    jobTime: booking.time || '10:00 AM',
    status: jobStatus,
    payment: typeof booking.price === 'string'
      ? parseInt(booking.price.replace(/[₹,]/g, '')) || 0
      : booking.price || 0,
    location: booking.location || 'Location TBD',
    description: booking.notes || '', // Use notes as description for direct hire
    skills: [],
    duration: 'As per booking',
    experienceLevel: undefined,
    otp: storedOtp,
    // Direct hire specific fields
    isDirectHire: true,
    notes: booking.notes || '',
    services: booking.services || [],
    paymentMethod: booking.paymentMethod || 'cod',
    client: {
      name: 'Client', // In real app, this would come from client profile
      rating: 4.5,
      jobsCompleted: 10,
      memberSince: new Date().toISOString().split('T')[0],
      phoneNumber: '+91 9876543210',
      image: '',
      moneySpent: 50000,
      location: booking.location || 'Location TBD',
      joinedDate: new Date().toISOString().split('T')[0],
      freelancersWorked: 5,
      freelancerAvatars: []
    },
    isProposal: false
  };
};

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

  // Load client bookings from localStorage and convert to jobs
  const loadClientBookings = (): Job[] => {
    try {
      const storedBookings = localStorage.getItem(CLIENT_BOOKINGS_KEY);
      if (storedBookings) {
        const bookings = JSON.parse(storedBookings);
        // Only include confirmed/upcoming bookings
        return bookings
          .filter((b: any) => b.status === 'confirmed' || b.status === 'ongoing')
          .map(convertBookingToJob);
      }
    } catch (error) {
      console.error('Error loading client bookings:', error);
    }
    return [];
  };

  // Initialize with mock data and client bookings
  useEffect(() => {
    // Clean up any duplicate entries in localStorage first
    cleanupDuplicateJobs();

    const jobsWithUpdates = applyStoredJobUpdates();
    const clientBookingJobs = loadClientBookings();

    // Merge jobs, avoiding duplicates by ID
    const allJobs = [...jobsWithUpdates];
    clientBookingJobs.forEach(bookingJob => {
      if (!allJobs.some(j => j.id === bookingJob.id)) {
        allJobs.push(bookingJob);
      }
    });

    setJobs(allJobs);

    // Fetch real applications
    const fetchRealData = async () => {
      try {
        // Don't set loading true here as it's already true on mount, 
        // and we want to allow existing jobs to show if needed, but 
        // actually we should probably wait.

        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        const userId = session?.id;

        if (userId) {
          const appsRes = await fetch(`/api/applications?myApplications=true&userId=${userId}`);
          if (appsRes.ok) {
            const realApplications = await appsRes.json();
            if (Array.isArray(realApplications)) {
              setApplications(realApplications);
            }
          }
        } else {
          // Fallback
          const { mockApplications } = await import('./mock-data');
          setApplications(mockApplications);
        }
      } catch (e) {
        console.error(e);
        // Fallback
        const { mockApplications } = await import('./mock-data');
        setApplications(mockApplications);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  // Listen for localStorage changes to refresh jobs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jobStatusUpdates' && e.newValue) {
        console.log('localStorage updated, refreshing jobs...');

        // Clean up duplicates first
        cleanupDuplicateJobs();

        const jobsWithUpdates = applyStoredJobUpdates();
        const clientBookingJobs = loadClientBookings();

        // Merge jobs
        const allJobs = [...jobsWithUpdates];
        clientBookingJobs.forEach(bookingJob => {
          if (!allJobs.some(j => j.id === bookingJob.id)) {
            allJobs.push(bookingJob);
          }
        });

        setJobs(allJobs);
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      console.log('Custom job status update event received:', e.detail);

      // Clean up duplicates first
      cleanupDuplicateJobs();

      const jobsWithUpdates = applyStoredJobUpdates();
      const clientBookingJobs = loadClientBookings();

      // Merge jobs
      const allJobs = [...jobsWithUpdates];
      clientBookingJobs.forEach(bookingJob => {
        if (!allJobs.some(j => j.id === bookingJob.id)) {
          allJobs.push(bookingJob);
        }
      });

      setJobs(allJobs);

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

    // Listen for client booking updates
    const handleClientBookingUpdate = (e: CustomEvent) => {
      console.log('Client booking update received:', e.detail);

      const jobsWithUpdates = applyStoredJobUpdates();
      const clientBookingJobs = loadClientBookings();

      // Merge jobs
      const allJobs = [...jobsWithUpdates];
      clientBookingJobs.forEach(bookingJob => {
        if (!allJobs.some(j => j.id === bookingJob.id)) {
          allJobs.push(bookingJob);
        }
      });

      setJobs(allJobs);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jobStatusUpdated', handleCustomEvent as EventListener);
    window.addEventListener('clientBookingUpdated', handleClientBookingUpdate as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jobStatusUpdated', handleCustomEvent as EventListener);
      window.removeEventListener('clientBookingUpdated', handleClientBookingUpdate as EventListener);
    };
  }, []);

  // Function to clean up duplicate entries in localStorage
  const cleanupDuplicateJobs = () => {
    try {
      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

      // Find and remove duplicate entries for the same job ID
      const jobIds = Object.keys(storedUpdates);
      const seenIds = new Set();
      const cleanedUpdates: { [key: string]: any } = {};

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
    let statusFromUrl = searchParams?.status || (tabFromUrl === 'upcoming' ? 'upcoming' : 'pending');

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
      date: application.scheduledAt || application.postedDate, // Use scheduled date if available, otherwise posted date
      time: '09:00', // Default time for upcoming jobs
      status: 'upcoming' as const, // Accepted applications become upcoming jobs
      payment: application.proposal.proposedRate, // Use the agreed rate instead of budget range
      location: application.location,
      description: application.description,
      skills: application.proposal.skills,
      duration: `${application.proposal.estimatedDays} days`,
      experienceLevel: application.experienceLevel as 'Beginner' | 'Intermediate' | 'Expert' | undefined,
      client: {
        name: application.clientName,
        rating: application.clientRating,
        image: application.clientImage,
        location: application.location,
        projectsCompleted: application.projectsCompleted,
        memberSince: application.clientSince,
        freelancersWorked: application.freelancersWorked,
        freelancerAvatars: application.freelancerAvatars,
        experienceLevel: application.experienceLevel as 'Beginner' | 'Intermediate' | 'Expert' | undefined
      },
      // Add proposal history for timeline continuity
      proposalHistory: {
        postedAt: application.postedDate,
        appliedDate: application.appliedDate,
        clientSpottedDate: new Date(new Date(application.appliedDate).getTime() + 3600000).toISOString(),
        acceptedDate: new Date().toISOString()
      }
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
      if (statusFilter === 'rejected') return app.status === 'rejected';
      if (statusFilter === 'withdrawn') return app.status === 'withdrawn';

      return true;
    });
  }, [applications, searchQuery, statusFilter]);

  // Calculate counts for each tab and status
  const tabCounts = useMemo(() => {
    const upcomingJobs = jobs.filter(job => job.status === 'upcoming' || job.status === 'pending');
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
        { value: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
        { value: 'ongoing', label: 'Ongoing', count: tabCounts.ongoing },
        { value: 'completed', label: 'Completed', count: tabCounts.completed },
        { value: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled }
      ] as const;
    } else if (activeTab === 'applications') {
      return [
        { value: 'pending', label: 'Pending', count: tabCounts.pending },
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

  const handleJobStatusChange = async (jobId: string, newStatus: 'completed' | 'cancelled' | 'started', notes?: string) => {
    console.log(`Updating job ${jobId} status to ${newStatus}`);

    // Create optimistic update data
    const optimisticUpdate = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(newStatus === 'started' && { startedAt: new Date().toISOString() }),
      ...(newStatus === 'cancelled' && {
        cancellationDetails: {
          cancelledAt: new Date().toISOString(),
          cancelledBy: 'freelancer',
          notes: notes || 'Cancelled by freelancer'
        }
      }),
      ...(newStatus === 'completed' && {
        completedAt: new Date().toISOString()
      })
    };

    // 1. Optimistic Update in State
    // We update 'applications' if it's an application-based job, or 'jobs' if it's a direct booking
    // Actually, 'jobs' contains everything for the 'upcoming' tab logic in this component, except applications are separate array
    // but filteredJobs combines them.
    // If we update status, we need to update the source.

    // If it's an application (converted to job card), we need to update the application status in state
    setApplications(prevApps => prevApps.map(app =>
      app["#"] === jobId || app.id === jobId ? { ...app, status: newStatus === 'started' ? 'accepted' : newStatus } : app
    ));

    // Also update 'jobs' state for direct bookings or legacy mock jobs
    setJobs(prevJobs => prevJobs.map(job =>
      job.id === jobId ? { ...job, ...optimisticUpdate } : job
    ));

    // 2. Call API
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          notes,
          freelancerRating: null // We might want to pass rating if completing
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      const updatedJob = await response.json();
      console.log('Job updated via API:', updatedJob);

      // Update state with server response to be sure
      // (This might be redundant if optimistic update was accurate, but good for consistency)

      // Refresh data to ensure everything is synced
      // In a real app we might use SWR or React Query invalidation
      // Here we might just rely on the optimistic update unless we want to refetch

    } catch (error) {
      console.error('Error updating job status via API:', error);
      // Revert optimistic update if needed? 
      // For now, we'll keep the localStorage fallback as "offline support" logic
    }

    // 3. Update LocalStorage (Legacy/Offline Support)
    try {
      // Clean up duplicates first
      cleanupDuplicateJobs();

      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

      // Check if this job already exists in stored updates
      const existingJobData = storedUpdates[jobId];
      // Get the original job data from state
      const originalJobData = jobs.find(j => j.id === jobId) || mockUpcomingJobs.find(j => j.id === jobId);

      // Only save to localStorage if we have the base data or it's already there
      if (originalJobData || existingJobData) {
        storedUpdates[jobId] = {
          ...(existingJobData || originalJobData),
          ...optimisticUpdate
        };
        localStorage.setItem('jobStatusUpdates', JSON.stringify(storedUpdates));
      }
    } catch (error) {
      console.error('Error saving job status update to localStorage:', error);
    }

    // Automatically switch to the appropriate tab when job status changes
    if (newStatus === 'completed') {
      // Update filter but don't immediately change URL to avoid navigation issues
      setStatusFilter('completed');
      setActiveTab('upcoming');

      setTimeout(() => {
        const params = new URLSearchParams();
        params.set('tab', 'upcoming');
        params.set('status', 'completed');
        router.push(`/freelancer/jobs?${params.toString()}`);
      }, 100);
    } else if (newStatus === 'cancelled') {
      setStatusFilter('cancelled');
      setActiveTab('upcoming');
      setTimeout(() => {
        const params = new URLSearchParams();
        params.set('tab', 'upcoming');
        params.set('status', 'cancelled');
        router.push(`/freelancer/jobs?${params.toString()}`);
      }, 100);
    } else if (newStatus === 'started') {
      setStatusFilter('ongoing');
      setActiveTab('upcoming');
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
                          className={`px-1.5 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1 flex-shrink-0 ${statusFilter === option.value
                            ? 'bg-[#8B66D1]/20 border-[#8B66D1]/40 text-white'
                            : 'bg-transparent border-[var(--border)] text-[var(--foreground)]/70 hover:bg-[var(--card-background)]/50'
                            }`}
                        >
                          {option.label}
                          <span className={`text-xs px-0.5 py-0.5 rounded-full ${statusFilter === option.value
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
