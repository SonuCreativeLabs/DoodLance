"use client"

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JobDashboard } from '@/components/freelancer/jobs/job-dashboard';
import { ProposalList } from '@/components/freelancer/proposals/proposal-list';

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <Tabs defaultValue="jobs" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="jobs" className="text-lg">My Jobs</TabsTrigger>
            <TabsTrigger value="proposals" className="text-lg">My Proposals</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Filter
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              {activeTab === 'jobs' ? 'Post a Job' : 'New Proposal'}
            </button>
          </div>
        </div>

        <TabsContent value="jobs" className="mt-0">
          <JobDashboard />
        </TabsContent>

        <TabsContent value="proposals" className="mt-0">
          <ProposalList />
        </TabsContent>
      </Tabs>
    </div>
  );
} 