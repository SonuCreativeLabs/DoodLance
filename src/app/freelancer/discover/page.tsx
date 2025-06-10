'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LocalMap } from '@/components/map/local-map';
import NeighborhoodFeed from '@/components/freelancer/feed/neighborhood-feed';
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
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have mock data

  useEffect(() => {
    // Skip categorization in development if there's an issue with the API
    if (process.env.NODE_ENV === 'development') {
      setIsLoading(false);
      return;
    }

    // Categorize jobs when they're loaded
    const categorizeJobs = async () => {
      try {
        const categorizedGigs = await Promise.all(
          gigs.map(async (gig) => {
            try {
              const category = await categorizeJob(gig.description);
              return {
                ...gig,
                category
              };
            } catch (error) {
              console.error(`Error categorizing gig ${gig.id}:`, error);
              return gig; // Keep the original category if categorization fails
            }
          })
        );
        setGigs(categorizedGigs);
      } catch (error) {
        console.error('Error categorizing jobs:', error);
      } finally {
        setIsLoading(false);
      }
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

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white shadow-md z-10">
        <h1 className="text-xl font-semibold text-gray-800">Discover Local Gigs</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'feed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="absolute inset-0"
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
              onGigClick={handleGigClick}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
} 