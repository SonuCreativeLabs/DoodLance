'use client';

import { calculateJobEarnings } from '@/components/freelancer/jobs/utils';
import { mockUpcomingJobs, mockApplications } from '@/components/freelancer/jobs/mock-data';
import { useState, useMemo } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { JobDetailsModal } from '@/components/freelancer/jobs/JobDetailsModal';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Initialize updatedJobs with data from localStorage
  const [updatedJobs, setUpdatedJobs] = useState<{[key: string]: any}>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
        console.log('🔍 localStorage data loaded:', storedUpdates);
        // If we have stored job data, use it directly
        if (storedUpdates && Object.keys(storedUpdates).length > 0) {
          return storedUpdates;
        }
        return {};
      } catch (error) {
        console.error('❌ Error loading job updates from localStorage:', error);
        return {};
      }
    }
    return {};
  });
  
  // Add effect to force re-sync localStorage data on mount and when modal key changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 Storage change detected, re-syncing...');
      try {
        const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
        console.log('🔄 Re-synced localStorage data:', storedUpdates);
        setUpdatedJobs(storedUpdates);
      } catch (error) {
        console.error('❌ Error re-syncing localStorage:', error);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Also listen for our custom event
    window.addEventListener('jobStatusUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jobStatusUpdated', handleStorageChange);
    };
  }, []);

  // Force refresh localStorage data when component mounts
  React.useEffect(() => {
    console.log('🔄 Force refreshing localStorage data on mount...');
    try {
      const storedUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
      if (storedUpdates && Object.keys(storedUpdates).length > 0) {
        console.log('🔄 Force refresh found data:', storedUpdates);
        setUpdatedJobs(storedUpdates);
      }
    } catch (error) {
      console.error('❌ Error during force refresh:', error);
    }
  }, []);

  // Find the job with the matching ID from mock data, or check if it's an accepted application
  const job = mockUpcomingJobs.find(job => job.id === params.id);
  const acceptedApplication = mockApplications.find(app => app["#"] === params.id && app.status === 'accepted');

  // If it's an accepted application, transform it into a job-like object
  const transformedApplicationJob = acceptedApplication ? {
    id: acceptedApplication["#"],
    title: acceptedApplication.jobTitle,
    category: acceptedApplication.category as any,
    date: acceptedApplication.appliedDate,
    time: 'TBD',
    status: 'confirmed' as const,
    payment: acceptedApplication.proposal.proposedRate,
    location: acceptedApplication.location,
    description: acceptedApplication.description,
    skills: acceptedApplication.proposal.skills,
    duration: `${acceptedApplication.proposal.estimatedDays} days`,
    experienceLevel: 'Expert' as const,
    client: {
      name: acceptedApplication.clientName,
      rating: acceptedApplication.clientRating,
      jobsCompleted: acceptedApplication.projectsCompleted,
      memberSince: acceptedApplication.clientSince,
      phoneNumber: '+91 9876543210',
      image: acceptedApplication.clientImage,
      moneySpent: acceptedApplication.moneySpent,
      freelancersWorked: acceptedApplication.freelancersWorked,
      freelancerAvatars: acceptedApplication.freelancerAvatars,
      experienceLevel: acceptedApplication.experienceLevel
    },
    // Add proposal history for timeline continuity
    proposalHistory: {
      postedAt: acceptedApplication.postedDate,
      appliedDate: acceptedApplication.appliedDate,
      clientSpottedDate: new Date(new Date(acceptedApplication.appliedDate).getTime() + 3600000).toISOString(),
      acceptedDate: new Date().toISOString()
    }
  } : null;

  const baseJob = job || transformedApplicationJob;

  if (!baseJob) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-white/60 mb-6">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  // Check if action=complete is in URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'complete') {
      setShowCompleteDialog(true);
    }
  }, []);

  // Check if job has been updated, otherwise use original job data (prioritize original data)
  const currentJob = useMemo(() => {
    // First, try to get original job data from mock data
    const originalJobData = mockUpcomingJobs.find(j => j.id === baseJob.id);

    // If we have stored updates, merge them with original data but prioritize original
    if (updatedJobs[baseJob.id]) {
      const mergedJob = {
        // Start with original job data to ensure correct title and core info
        ...(originalJobData || {}),
        // Override with stored status updates only
        ...updatedJobs[baseJob.id],
        // Ensure ID is preserved
        id: baseJob.id,
      };

      console.log('🔄 Using merged job data:', {
        originalTitle: originalJobData?.title,
        storedTitle: updatedJobs[baseJob.id]?.title,
        finalTitle: mergedJob.title,
        rating: mergedJob.freelancerRating,
        review: mergedJob.review,
        feedbackChips: mergedJob.feedbackChips
      });

      return mergedJob;
    }

    // If no stored updates, use original job data
    console.log('📋 Using original job data:', originalJobData?.title);
    return originalJobData || baseJob;
  }, [updatedJobs, baseJob.id, baseJob]);

  // Ensure job has all required properties with default values
  const jobWithDefaults = useMemo(() => ({
    ...currentJob,
    title: currentJob.title || 'Untitled Job',
    description: currentJob.description || 'No description provided',
    date: currentJob.date || '',
    time: currentJob.time || '',
    location: currentJob.location || 'Location not specified',
    payment: currentJob.payment || 0,
    duration: currentJob.duration || 'Not specified',
    category: currentJob.category || 'Other',
    experienceLevel: currentJob.experienceLevel || 'Any',
    skills: currentJob.skills || [],
    status: currentJob.status || 'pending',
    client: {
      name: currentJob.client?.name || 'Unknown Client',
      rating: currentJob.client?.rating || 0,
      jobsCompleted: currentJob.client?.jobsCompleted || Math.floor(Math.random() * 50) + 1, // Random number between 1-50
      moneySpent: currentJob.client?.moneySpent || Math.floor(Math.random() * 100000) + 10000, // Random number between 10,000-110,000
      memberSince: currentJob.client?.memberSince || new Date(Date.now() - Math.floor(Math.random() * 5) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in last 5 years
      phoneNumber: currentJob.client?.phoneNumber || `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
      image: currentJob.client?.image,
      freelancersWorked: currentJob.client?.freelancersWorked || Math.floor(Math.random() * 15) + 1, // 1-15 freelancers
      freelancerAvatars: currentJob.client?.freelancerAvatars || [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/75.jpg',
        'https://randomuser.me/api/portraits/women/63.jpg',
        'https://randomuser.me/api/portraits/men/22.jpg'
      ].slice(0, Math.floor(Math.random() * 4) + 1), // 1-5 random avatars
    },
  }), [currentJob]);

  const [modalKey, setModalKey] = useState(0);

  const handleJobUpdate = async (jobId: string, newStatus: 'completed' | 'cancelled' | 'started', notes?: string, completionData?: {rating: number, review: string, feedbackChips: string[]}) => {
    console.log(`🔄 Updating job ${jobId} status to ${newStatus}`, { completionData, notes });

    if (completionData) {
      console.log('📝 Completion data received:', {
        rating: completionData.rating,
        review: completionData.review,
        feedbackChips: completionData.feedbackChips
      });
    }

    try {
      // For started jobs, update the job status via API
      if (newStatus === 'started') {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'started',
            startedAt: new Date().toISOString(),
            otpVerified: true
          }),
        });

        if (response.ok) {
          const updatedJobData = await response.json();
          console.log('✅ Job started successfully via API:', updatedJobData);

          // Update local state with complete job data
          setUpdatedJobs(prev => {
            // Get the original job data to preserve all fields
            const originalJobData = mockUpcomingJobs.find(j => j.id === jobId);

            return {
              ...prev,
              [jobId]: {
                ...updatedJobData,
                startedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Preserve original job data fields that might be missing from API response
                ...(originalJobData && {
                  title: originalJobData.title,
                  payment: originalJobData.payment,
                  category: originalJobData.category,
                  description: originalJobData.description,
                  location: originalJobData.location,
                  duration: originalJobData.duration,
                  experienceLevel: originalJobData.experienceLevel,
                  skills: originalJobData.skills,
                  client: originalJobData.client,
                  proposalHistory: originalJobData.proposalHistory
                })
              }
            };
          });

          // Update localStorage with complete job data from API
          const existingUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

          // Get the original job data to preserve all fields
          const originalJobData = mockUpcomingJobs.find(j => j.id === jobId);

          const updatedData = {
            ...existingUpdates,
            [jobId]: {
              // Use API response data as primary source
              ...updatedJobData,
              // Preserve original job data fields that might be missing from API response
              ...(originalJobData && {
                title: originalJobData.title,
                payment: originalJobData.payment,
                category: originalJobData.category,
                description: originalJobData.description,
                location: originalJobData.location,
                duration: originalJobData.duration,
                experienceLevel: originalJobData.experienceLevel,
                skills: originalJobData.skills,
                client: originalJobData.client,
                proposalHistory: originalJobData.proposalHistory
              }),
              // Ensure we have the correct ID
              id: jobId,
              // Update timestamp
              updatedAt: new Date().toISOString(),
              startedAt: new Date().toISOString()
            }
          };
          localStorage.setItem('jobStatusUpdates', JSON.stringify(updatedData));

          console.log('💾 Job started data saved to localStorage:', updatedData[jobId]);

          // Force dashboard refresh by dispatching a custom event
          window.dispatchEvent(new CustomEvent('jobStatusUpdated', {
            detail: { jobId, newStatus }
          }));

          // Also call dashboard's handleJobStatusChange if available
          if ((window as any).dashboardHandleJobStatusChange) {
            (window as any).dashboardHandleJobStatusChange(jobId, newStatus);
          }

          // Force modal re-render with updated data
          setTimeout(() => {
            setModalKey(prev => prev + 1);
          }, 50);
          return;
        }
      }

      // For completed jobs, fetch the updated job data from API to get rating and review
      if (newStatus === 'completed') {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
            rating: completionData?.rating || 0,
            review: completionData?.review || '',
            feedbackChips: completionData?.feedbackChips || [],
            // Pass the original job data so API can use it
            originalJobData: baseJob
          }),
        });

        if (response.ok) {
          const updatedJobData = await response.json();
          console.log('✅ Fetched updated job data from API:', updatedJobData);

          // Calculate earnings for the completed job
          const earningsData = calculateJobEarnings(baseJob);
          console.log('💰 Calculated earnings for completed job:', earningsData);

          // Update local state with complete job data
          setUpdatedJobs(prev => ({
            ...prev,
            [jobId]: {
              ...updatedJobData,
              earnings: earningsData,
              completedAt: new Date().toISOString(),
              ...(completionData && {
                freelancerRating: {
                  stars: completionData.rating,
                  review: completionData.review,
                  feedbackChips: completionData.feedbackChips,
                  date: new Date().toISOString()
                }
              })
            }
          }));

          // Update localStorage with complete job data from API (API now returns correct titles)
          const existingUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');

          const updatedData = {
            ...existingUpdates,
            [jobId]: {
              // Use API response data as primary source (API now returns correct titles)
              ...updatedJobData,
              // Ensure we have the correct ID
              id: jobId,
              // Update timestamp
              updatedAt: new Date().toISOString(),
              // Include calculated earnings
              earnings: earningsData,
              completedAt: new Date().toISOString(),
              // Include rating/review data from completion in freelancerRating format
              ...(completionData && {
                freelancerRating: {
                  stars: completionData.rating,
                  review: completionData.review,
                  feedbackChips: completionData.feedbackChips,
                  date: new Date().toISOString()
                }
              })
            }
          };
          localStorage.setItem('jobStatusUpdates', JSON.stringify(updatedData));

          console.log('💾 Job completion data saved to localStorage:', updatedData[jobId]);
          console.log('💾 localStorage updated with:', updatedData[jobId]);

          // Force dashboard refresh by dispatching a custom event
          window.dispatchEvent(new CustomEvent('jobStatusUpdated', {
            detail: { jobId, newStatus }
          }));

          // Also call dashboard's handleJobStatusChange if available
          if ((window as any).dashboardHandleJobStatusChange) {
            (window as any).dashboardHandleJobStatusChange(jobId, newStatus);
          }

          // Force modal re-render with updated data
          setTimeout(() => {
            setModalKey(prev => prev + 1);
          }, 50);
          return;
        }
      }

      // For cancelled jobs or if API fetch fails, use local state update
      setUpdatedJobs(prev => ({
        ...prev,
        [jobId]: {
          // Use the updated job data if available from API, otherwise use original job data
          ...(prev[jobId] || baseJob),
          status: newStatus,
          // Add timestamp for completed jobs
          ...(newStatus === 'completed' && {
            completedAt: new Date().toISOString(),
            ...calculateJobEarnings(prev[jobId] || baseJob)
          }),
          // Add cancellation details for cancelled jobs
          ...(newStatus === 'cancelled' && {
            cancellationDetails: {
              cancelledBy: 'freelancer',
              cancelledAt: new Date().toISOString(),
              notes: notes || 'Cancelled by freelancer'
            }
          }),
          // Include rating/review data from completion in freelancerRating format
          ...(completionData && newStatus === 'completed' && {
            freelancerRating: {
              stars: completionData.rating,
              review: completionData.review,
              feedbackChips: completionData.feedbackChips,
              date: new Date().toISOString()
            }
          })
        }
      }));

      // Force modal re-render by updating the key
      setModalKey(prev => prev + 1);

      // Update localStorage for fallback case
      const existingUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
      const currentJobData = existingUpdates[jobId];

      // Get the original job data from mock data to ensure correct info
      const originalJobData = mockUpcomingJobs.find(j => j.id === jobId);

      // Calculate earnings for completed jobs
      const earningsData = newStatus === 'completed' ? calculateJobEarnings(originalJobData || currentJobData || baseJob) : null;

      const updatedData = {
        ...existingUpdates,
        [jobId]: {
          // Use original job data as base to ensure correct title and core info
          ...(originalJobData || {}),
          // Override with current job data (which should have status updates)
          ...currentJobData,
          // Update status and timestamp
          status: newStatus,
          updatedAt: new Date().toISOString(),
          // Include calculated earnings for completed jobs
          ...(earningsData && {
            earnings: earningsData,
            completedAt: new Date().toISOString()
          }),
          ...(newStatus === 'cancelled' && {
            cancellationDetails: {
              cancelledBy: 'freelancer',
              cancelledAt: new Date().toISOString(),
              notes: notes || 'Cancelled by freelancer'
            }
          }),
          // Include rating/review data from completion in freelancerRating format
          ...(completionData && newStatus === 'completed' && {
            freelancerRating: {
              stars: completionData.rating,
              review: completionData.review,
              feedbackChips: completionData.feedbackChips,
              date: new Date().toISOString()
            }
          })
        }
      };
      localStorage.setItem('jobStatusUpdates', JSON.stringify(updatedData));

      console.log('💾 Final fallback: Job data saved to localStorage:', updatedData[jobId]);
      console.log('💰 Final fallback earnings included:', earningsData);

      // Force dashboard refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('jobStatusUpdated', {
        detail: { jobId, newStatus }
      }));

      // Also call dashboard's handleJobStatusChange if available
      if ((window as any).dashboardHandleJobStatusChange) {
        (window as any).dashboardHandleJobStatusChange(jobId, newStatus);
      }
    } catch (error) {
      console.error('❌ Error updating job status:', error);
      // Fallback to local state update if API fails
      setUpdatedJobs(prev => {
        const currentJobData = prev[jobId] || baseJob;
        const originalJobData = mockUpcomingJobs.find(j => j.id === jobId);

        // Calculate earnings for completed jobs
        const earningsData = newStatus === 'completed' ? calculateJobEarnings(originalJobData || currentJobData) : null;

        return {
          ...prev,
          [jobId]: {
            // Use original job data as base to ensure correct title and core info
            ...(originalJobData || {}),
            // Override with current job data
            ...currentJobData,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            // Add timestamp for completed jobs
            ...(newStatus === 'completed' && {
              completedAt: new Date().toISOString(),
              earnings: earningsData
            }),
            // Include rating/review data from completion
            ...(completionData && newStatus === 'completed' && {
              freelancerRating: {
                stars: completionData.rating,
                review: completionData.review,
                feedbackChips: completionData.feedbackChips,
                date: new Date().toISOString()
              }
            }),
            // Add cancellation details for cancelled jobs
            ...(newStatus === 'cancelled' && {
              cancellationDetails: {
                cancelledBy: 'freelancer',
                cancelledAt: new Date().toISOString(),
                notes: notes || 'Cancelled by freelancer'
              }
            })
          }
        };
      });

      // Force modal re-render by updating the key
      setModalKey(prev => prev + 1);

      // Update localStorage for fallback case
      const existingUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
      const currentJobData = existingUpdates[jobId];

      // Get the original job data from mock data to ensure correct info
      const originalJobData = mockUpcomingJobs.find(j => j.id === jobId);

      // Calculate earnings for completed jobs
      const earningsData = newStatus === 'completed' ? calculateJobEarnings(originalJobData || currentJobData || baseJob) : null;

      const updatedData = {
        ...existingUpdates,
        [jobId]: {
          // Use original job data as base to ensure correct title and core info
          ...(originalJobData || {}),
          // Override with current job data (which should have status updates)
          ...currentJobData,
          // Update status and timestamp
          status: newStatus,
          updatedAt: new Date().toISOString(),
          // Include calculated earnings for completed jobs
          ...(earningsData && {
            earnings: earningsData,
            completedAt: new Date().toISOString()
          }),
          ...(newStatus === 'cancelled' && {
            cancellationDetails: {
              cancelledBy: 'freelancer',
              cancelledAt: new Date().toISOString(),
              notes: notes || 'Cancelled by freelancer'
            }
          }),
          // Include rating/review data from completion in freelancerRating format
          ...(completionData && newStatus === 'completed' && {
            freelancerRating: {
              stars: completionData.rating,
              review: completionData.review,
              feedbackChips: completionData.feedbackChips,
              date: new Date().toISOString()
            }
          })
        }
      };
      localStorage.setItem('jobStatusUpdates', JSON.stringify(updatedData));

      console.log('💾 Final fallback: Job data saved to localStorage:', updatedData[jobId]);
      console.log('💰 Final fallback earnings included:', earningsData);

      // Force dashboard refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('jobStatusUpdated', {
        detail: { jobId, newStatus }
      }));

      // Also call dashboard's handleJobStatusChange if available
      if ((window as any).dashboardHandleJobStatusChange) {
        (window as any).dashboardHandleJobStatusChange(jobId, newStatus);
      }
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  // Create a fresh job object reference to force modal re-render when status changes
  // Use updated job data if available, otherwise use original job data
  const modalJob = useMemo(() => {
    // Get the updated job data if it exists
    const updatedJobData = updatedJobs[currentJob.id];

    // Use updated data if available, otherwise fall back to original job data
    const baseJob = updatedJobData || jobWithDefaults;

    // Ensure we have the latest completion data
    const jobWithCompletionData = {
      ...baseJob,
      ...(updatedJobData && {
        freelancerRating: updatedJobData.freelancerRating,
        rating: updatedJobData.rating,
        review: updatedJobData.review,
        feedbackChips: updatedJobData.feedbackChips,
        completedAt: updatedJobData.completedAt,
        earnings: updatedJobData.earnings,
        cancellationDetails: updatedJobData.cancellationDetails,
        status: updatedJobData?.status || (updatedJobData?.freelancerRating ? 'completed' : updatedJobData?.startedAt ? 'started' : baseJob.status),
        // Ensure payment is included for earnings calculation
        payment: updatedJobData?.payment || baseJob.payment || 0
      })
    };

    console.log('Modal job construction:', {
      baseJobId: baseJob.id,
      updatedJobData: updatedJobData,
      updatedJobDataEarnings: updatedJobData?.earnings,
      finalEarnings: jobWithCompletionData.earnings,
      baseJobEarnings: baseJob.earnings,
      hasFreelancerRating: !!updatedJobData?.freelancerRating,
      freelancerRating: updatedJobData?.freelancerRating
    });

    console.log('Modal job data:', {
      id: jobWithCompletionData.id,
      status: jobWithCompletionData.status,
      hasFreelancerRating: !!jobWithCompletionData.freelancerRating,
      freelancerRating: jobWithCompletionData.freelancerRating,
      hasRating: !!jobWithCompletionData.rating,
      rating: jobWithCompletionData.rating
    });

    return jobWithCompletionData;
  }, [jobWithDefaults, updatedJobs, currentJob.id, currentJob.status]);

  return <JobDetailsModal key={`${currentJob.status}-${currentJob.id}-${modalKey}`} job={modalJob} onClose={handleCloseModal} onJobUpdate={handleJobUpdate} initialShowComplete={showCompleteDialog} />;
}
