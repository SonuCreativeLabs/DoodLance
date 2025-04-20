'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LocalMap } from '@/components/map/local-map';
import { NeighborhoodFeed } from '@/components/feed/neighborhood-feed';
import { categorizeJob } from '@/lib/services/job-categorization';

// Mock data for demonstration
const mockGigs = [
  {
    id: '1',
    title: 'House Cleaning Needed',
    description: 'Looking for a reliable cleaner for a 2-bedroom apartment',
    distance: 0.5,
    postedTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    budget: {
      min: 500,
      max: 1000
    },
    category: 'Cleaning',
    location: {
      lat: 13.0827,
      lng: 80.2707,
      address: 'Anna Nagar, Chennai, Tamil Nadu'
    },
    client: {
      id: 'c1',
      name: 'Priya Kumar',
      rating: 4.8,
      completedJobs: 12
    }
  },
  {
    id: '2',
    title: 'Garden Maintenance',
    description: 'Need help with weekly garden maintenance and pruning',
    distance: 1.2,
    postedTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    budget: {
      min: 800,
      max: 1500
    },
    category: 'Gardening',
    location: {
      lat: 13.0500,
      lng: 80.2121,
      address: 'T. Nagar, Chennai, Tamil Nadu'
    },
    client: {
      id: 'c2',
      name: 'Raj Sharma',
      rating: 4.9,
      completedJobs: 8
    }
  }
];

export default function DiscoverPage() {
  const [selectedGig, setSelectedGig] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'feed'>('map');
  const [gigs, setGigs] = useState(mockGigs);

  useEffect(() => {
    // Categorize jobs when they're loaded
    const categorizeJobs = async () => {
      const categorizedGigs = await Promise.all(
        gigs.map(async (gig) => {
          const category = await categorizeJob(gig.description);
          return {
            ...gig,
            category
          };
        })
      );
      setGigs(categorizedGigs);
    };

    categorizeJobs();
  }, []);

  const handleGigClick = (gig: any) => {
    setSelectedGig(gig.id);
    setViewMode('map');
  };

  const handleMarkerClick = (gigId: string) => {
    setSelectedGig(gigId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary to-primary-dark border-b border-white/10">
        <h1 className="text-xl font-semibold text-white">Discover Local Gigs</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'feed'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Feed
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {viewMode === 'map' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <LocalMap
              gigs={gigs}
              onMarkerClick={handleMarkerClick}
              selectedGigId={selectedGig}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full overflow-y-auto p-4"
          >
            <NeighborhoodFeed
              gigs={gigs}
              onGigSelect={handleGigClick}
              selectedGigId={selectedGig}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
} 