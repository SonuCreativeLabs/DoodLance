'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobDetailsModal } from '@/components/freelancer/jobs/JobDetailsModal';
import { Job } from '@/components/freelancer/jobs/types';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const jobId = decodeURIComponent(params.id);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Job not found');
        throw new Error('Failed to load job details');
      }
      const data = await res.json();

      // Transform API data to Job interface
      const mappedJob: Job = {
        id: data.id,
        title: data.title,
        category: data.category,
        description: data.description,
        status: data.status === 'OPEN' ? 'upcoming' : (data.status.toLowerCase() as any),
        payment: data.payment || data.budget || 0,
        location: data.location || 'Remote',
        date: data.scheduledAt ? new Date(data.scheduledAt).toLocaleDateString() : 'TBD',
        time: data.scheduledAt ? new Date(data.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
        duration: data.duration,
        workMode: data.workMode,
        experience: data.experience,
        skills: typeof data.skills === 'string' ? data.skills.split(',') : (data.skills || []),
        client: {
          name: data.client?.name || 'Unknown Client',
          image: data.client?.avatar || data.client?.image || '/placeholder-user.jpg',
          rating: data.client?.rating || 4.5,
          location: data.client?.location || '',
          jobsCompleted: 10, // Placeholder if not in API
          memberSince: '2023', // Placeholder
        },
        otp: data.otp,
        startedAt: data.startedAt,
        completedAt: data.completedAt,
        freelancerRating: data.freelancerRating, // Assuming API returns this object structure
        clientRating: data.clientRating
      };

      setJob(mappedJob);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleJobUpdate = async (id: string, newStatus: 'completed' | 'cancelled' | 'started', notes?: string, completionData?: any) => {
    // Optimistic update
    if (job) {
      setJob({ ...job, status: newStatus as any });

      // For real update, the Modal component (JobDetailsModal) actually handles the API call internally in 'confirmStartJob' etc.
      // But we should refresh the data here just in case, or trust the modal calls.
      // Looking at JobDetailsModal implementation, it *does* make API calls.
      // So here we primarily update local state to reflect changes immediately if the modal doesn't close effectively or if we need to sync.

      // Re-fetch to be sure
      fetchJob();
      setModalKey(prev => prev + 1);
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4" />
        <p className="text-white/60">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
        <p className="text-white/60 mb-6">{error || "The job you're looking for doesn't exist or has been removed."}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <JobDetailsModal
      key={`${job.status}-${job.id}-${modalKey}`}
      job={job}
      onClose={handleCloseModal}
      onJobUpdate={handleJobUpdate}
    />
  );
}
