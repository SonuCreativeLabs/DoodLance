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
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-white/60 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    router.back();
  };

  return <JobDetailsModal job={job} />;
}
