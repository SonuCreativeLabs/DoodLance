'use client';

import { useRouter } from 'next/navigation';
import { JobDetailsModal } from '@/components/freelancer/jobs/job-details-modal';
import { mockUpcomingJobs } from '@/components/freelancer/jobs/mock-data';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Find the job with the matching ID from mock data
  const job = mockUpcomingJobs.find(job => job.id === params.id);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-white/60 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Ensure job has all required properties with default values
  const jobWithDefaults = {
    ...job,
    title: job.title || 'Untitled Job',
    description: job.description || 'No description provided',
    date: job.date || '',
    time: job.time || '',
    location: job.location || 'Location not specified',
    payment: job.payment || 0,
    duration: job.duration || 'Not specified',
    category: job.category || 'Other',
    experienceLevel: job.experienceLevel || 'Any',
    skills: job.skills || [],
    status: job.status || 'pending',
    client: {
      name: job.client?.name || 'Unknown Client',
      rating: job.client?.rating || 0,
      jobsCompleted: job.client?.jobsCompleted || 0,
      memberSince: job.client?.memberSince || new Date().toISOString().split('T')[0],
      phoneNumber: job.client?.phoneNumber,
      image: job.client?.image,
    },
  };

  const handleClose = () => {
    router.back();
  };

  return <JobDetailsModal job={jobWithDefaults} />;
}
