'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LocalMap } from '@/components/map/local-map';
import NeighborhoodFeed from '@/components/freelancer/feed/neighborhood-feed';
import { categorizeJob } from '@/lib/services/job-categorization';

export default function DiscoverPage() {
  const [selectedGig, setSelectedGig] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'feed'>('map');
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const apiJobs = await response.json();

          // Transform API jobs to the format expected by Discover components
          const transformedGigs = apiJobs.map((job: any) => {
            let coords = { lat: 13.0827, lng: 80.2707 }; // Default Chennai
            if (job.coords && Array.isArray(job.coords) && job.coords.length === 2) {
              coords = { lat: job.coords[1], lng: job.coords[0] };
            } else if (job.coordinates && Array.isArray(job.coordinates) && job.coordinates.length === 2) {
              coords = { lat: job.coordinates[1], lng: job.coordinates[0] };
            }

            return {
              id: job.id,
              title: job.title,
              description: job.description,
              distance: job.distance || 0, // Distance might need calculation if not provided
              postedTime: job.createdAt || job.postedAt || new Date().toISOString(),
              budget: {
                min: job.budgetMin || job.budget || 0,
                max: job.budgetMax || job.budget || 0
              },
              category: job.category || 'General',
              location: {
                ...coords,
                address: job.location || 'Chennai, India'
              },
              client: {
                id: job.clientId || job.client?.id || 'unknown',
                name: job.clientName || job.client?.name || 'Anonymous',
                rating: job.clientRating || job.client?.rating || 0,
                completedJobs: job.clientJobs || job.client?.completedJobs || 0
              }
            };
          });

          setGigs(transformedGigs);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
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
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'feed'
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
