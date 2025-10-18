'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { JobDetailsModal } from '@/components/freelancer/jobs/JobDetailsModal';
import { mockUpcomingJobs } from '@/components/freelancer/jobs/mock-data';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [updatedJobs, setUpdatedJobs] = useState<{[key: string]: any}>({});

  // Find the job with the matching ID from mock data
  const job = mockUpcomingJobs.find(job => job.id === params.id);

  if (!job) {
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

  // Check if job has been updated, otherwise use original job
  const currentJob = updatedJobs[job.id] || job;

  // Ensure job has all required properties with default values
  const jobWithDefaults = {
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
  };

  const [modalKey, setModalKey] = useState(0);

  const handleJobUpdate = (jobId: string, newStatus: 'completed' | 'cancelled') => {
    console.log(`Updating job ${jobId} status to ${newStatus}`);

    // Update local state
    setUpdatedJobs(prev => ({
      ...prev,
      [jobId]: {
        ...prev[jobId] || job,
        status: newStatus,
        // Add timestamp for completed jobs
        ...(newStatus === 'completed' && {
          completedAt: new Date().toISOString(),
          earnings: {
            amount: jobWithDefaults.payment,
            platformFee: Math.round(jobWithDefaults.payment * 0.1),
            total: Math.round(jobWithDefaults.payment * 0.9)
          }
        }),
        // Add cancellation details for cancelled jobs
        ...(newStatus === 'cancelled' && {
          cancellationDetails: {
            cancelledBy: 'freelancer',
            cancelledAt: new Date().toISOString(),
            notes: 'Cancelled by freelancer'
          }
        })
      }
    }));

    // Force modal re-render by updating the key
    setModalKey(prev => prev + 1);

    // Persist to localStorage so JobDashboard can pick up the changes
    const existingUpdates = JSON.parse(localStorage.getItem('jobStatusUpdates') || '{}');
    const updatedData = {
      ...existingUpdates,
      [jobId]: {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === 'completed' && {
          completedAt: new Date().toISOString(),
          earnings: {
            amount: jobWithDefaults.payment,
            platformFee: Math.round(jobWithDefaults.payment * 0.1),
            total: Math.round(jobWithDefaults.payment * 0.9)
          }
        }),
        ...(newStatus === 'cancelled' && {
          cancellationDetails: {
            cancelledBy: 'freelancer',
            cancelledAt: new Date().toISOString(),
            notes: 'Cancelled by freelancer'
          }
        })
      }
    };
    localStorage.setItem('jobStatusUpdates', JSON.stringify(updatedData));
  };

  const handleCloseModal = () => {
    router.back();
  };

  // Create a fresh job object reference to force modal re-render when status changes
  const modalJob = { ...jobWithDefaults };

  return <JobDetailsModal key={`${currentJob.status}-${currentJob.id}-${modalKey}`} job={modalJob} onClose={handleCloseModal} onJobUpdate={handleJobUpdate} />;
}
