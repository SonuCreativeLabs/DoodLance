"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LocalMap from '@/components/map/local-map'
import NeighborhoodFeed from '@/components/feed/neighborhood-feed'
import { categorizeJob } from '@/lib/services/job-categorization'

// Mock data for demonstration
const mockGigs = [
  {
    id: '1',
    title: 'House Cleaning Needed',
    description: 'Looking for a reliable cleaner for a 2-bedroom apartment',
    distance: 0.5,
    postedTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    budget: {
      min: 50,
      max: 100
    },
    category: 'Cleaning',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Main St, San Francisco, CA'
    },
    client: {
      id: 'c1',
      name: 'John Doe',
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
      min: 80,
      max: 150
    },
    category: 'Gardening',
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: '456 Market St, San Francisco, CA'
    },
    client: {
      id: 'c2',
      name: 'Jane Smith',
      rating: 4.9,
      completedJobs: 8
    }
  }
]

export default function DiscoverPage() {
  const [selectedGig, setSelectedGig] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'feed'>('map')
  const [gigs, setGigs] = useState(mockGigs)

  useEffect(() => {
    // Categorize jobs when they're loaded
    const categorizeJobs = async () => {
      const categorizedGigs = await Promise.all(
        gigs.map(async (gig) => {
          const categories = await categorizeJob(gig.title, gig.description)
          const topCategory = categories[0]?.label || gig.category
          return {
            ...gig,
            category: topCategory
          }
        })
      )
      setGigs(categorizedGigs)
    }

    categorizeJobs()
  }, [])

  const handleGigClick = (gig: any) => {
    setSelectedGig(gig.id)
    setViewMode('map')
  }

  const handleMarkerClick = (gigId: string) => {
    setSelectedGig(gigId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">Discover Local Gigs</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'feed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
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
              onGigClick={handleGigClick}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
} 