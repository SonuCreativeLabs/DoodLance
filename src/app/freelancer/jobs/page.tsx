"use client"

import { JobDashboard } from '@/components/freelancer/jobs/job-dashboard';

export default function JobsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">My Jobs</h1>
      <JobDashboard />
    </div>
  )
} 