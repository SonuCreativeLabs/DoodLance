'use client';

import { useState } from 'react';
import { GigCard } from '../gig/gig-card';

interface Gig {
  id: string;
  title: string;
  description: string;
  distance: number;
  postedTime: string;
  budget: {
    min: number;
    max: number;
  };
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  client: {
    id: string;
    name: string;
    rating: number;
    completedJobs: number;
  };
}

interface NeighborhoodFeedProps {
  gigs: Gig[];
  onGigSelect: (gigId: string) => void;
  selectedGigId: string | null;
}

export function NeighborhoodFeed({ gigs, onGigSelect, selectedGigId }: NeighborhoodFeedProps) {
  const [sortBy, setSortBy] = useState<'distance' | 'budget' | 'time'>('distance');
  const [filter, setFilter] = useState<string>('all');

  const sortedGigs = [...gigs].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'budget':
        return b.budget.max - a.budget.max;
      case 'time':
        return new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime();
      default:
        return 0;
    }
  });

  const filteredGigs = filter === 'all' 
    ? sortedGigs 
    : sortedGigs.filter(gig => gig.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('distance')}
            className={`px-3 py-1 rounded-full text-sm ${
              sortBy === 'distance'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Distance
          </button>
          <button
            onClick={() => setSortBy('budget')}
            className={`px-3 py-1 rounded-full text-sm ${
              sortBy === 'budget'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Budget
          </button>
          <button
            onClick={() => setSortBy('time')}
            className={`px-3 py-1 rounded-full text-sm ${
              sortBy === 'time'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Newest
          </button>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600"
        >
          <option value="all">All Categories</option>
          <option value="cleaning">Cleaning</option>
          <option value="moving">Moving</option>
          <option value="repairs">Repairs</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredGigs.map((gig) => (
          <GigCard
            key={gig.id}
            gig={gig}
            isSelected={selectedGigId === gig.id}
            onClick={() => onGigSelect(gig.id)}
          />
        ))}
      </div>
    </div>
  );
} 