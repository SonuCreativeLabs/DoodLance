'use client';

import { useRouter } from 'next/navigation';
import { JobDetailsModal } from '@/components/freelancer/jobs/JobDetailsModal';
import { mockUpcomingJobs } from '@/components/freelancer/jobs/mock-data';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
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
      jobsCompleted: job.client?.jobsCompleted || Math.floor(Math.random() * 50) + 1, // Random number between 1-50
      moneySpent: job.client?.moneySpent || Math.floor(Math.random() * 100000) + 10000, // Random number between 10,000-110,000
      memberSince: job.client?.memberSince || new Date(Date.now() - Math.floor(Math.random() * 5) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in last 5 years
      phoneNumber: job.client?.phoneNumber || `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
      image: job.client?.image,
      freelancersWorked: job.client?.freelancersWorked || Math.floor(Math.random() * 15) + 1, // 1-15 freelancers
      freelancerAvatars: job.client?.freelancerAvatars || [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/75.jpg',
        'https://randomuser.me/api/portraits/women/63.jpg',
        'https://randomuser.me/api/portraits/men/22.jpg'
      ].slice(0, Math.floor(Math.random() * 4) + 1), // 1-5 random avatars
    },
  };

  return <JobDetailsModal job={jobWithDefaults} />;
}
