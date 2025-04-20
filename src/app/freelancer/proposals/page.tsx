"use client"

import { ProposalList } from '@/components/freelancer/proposals/proposal-list';

export default function ProposalsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Proposals</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Filter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            New Proposal
          </button>
        </div>
      </div>
      <ProposalList />
    </div>
  );
} 