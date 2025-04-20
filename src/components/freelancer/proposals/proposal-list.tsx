'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, BuildingIcon } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  proposedRate: number;
  submittedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Full Stack Developer Needed for E-commerce Platform',
    company: 'Tech Solutions Inc.',
    location: 'United States',
    description: 'I have extensive experience in building e-commerce platforms using React and Node.js...',
    proposedRate: 45,
    submittedDate: '2 days ago',
    status: 'pending'
  },
  {
    id: '2',
    title: 'React Native Developer for Social Media App',
    company: 'Social Connect Ltd.',
    location: 'Canada',
    description: 'As a React Native developer with 4 years of experience...',
    proposedRate: 50,
    submittedDate: '1 week ago',
    status: 'accepted'
  },
  {
    id: '3',
    title: 'Backend Developer for API Development',
    company: 'Data Systems Corp',
    location: 'Germany',
    description: 'I specialize in building scalable APIs using Node.js and Express...',
    proposedRate: 40,
    submittedDate: '2 weeks ago',
    status: 'rejected'
  }
];

export function ProposalList() {
  const getStatusColor = (status: Proposal['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status];
  };

  return (
    <div className="space-y-4">
      {mockProposals.map((proposal) => (
        <Card key={proposal.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{proposal.title}</h3>
                  <Badge className={getStatusColor(proposal.status)}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <BuildingIcon className="w-4 h-4" />
                    {proposal.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {proposal.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    Submitted {proposal.submittedDate}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-2">{proposal.description}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Proposed Rate: <span className="font-semibold text-gray-900">${proposal.proposedRate}/hr</span>
                </div>
                {proposal.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Edit Proposal
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 