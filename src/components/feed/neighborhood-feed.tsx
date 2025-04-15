"use client";

import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
  onGigClick: (gig: Gig) => void;
}

export default function NeighborhoodFeed({ gigs, onGigClick }: NeighborhoodFeedProps) {
  const [sortedGigs, setSortedGigs] = useState<Gig[]>([]);

  useEffect(() => {
    // Sort gigs by distance (closest first)
    const sorted = [...gigs].sort((a, b) => a.distance - b.distance);
    setSortedGigs(sorted);
  }, [gigs]);

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatTime = (postedTime: string) => {
    const date = new Date(postedTime);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {sortedGigs.map((gig, index) => (
        <motion.div
          key={gig.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onGigClick(gig)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{gig.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{formatDistance(gig.distance)}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{gig.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatTime(gig.postedTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>${gig.budget.min} - ${gig.budget.max}</span>
            </div>
            
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-gray-500">{gig.client.rating}</span>
              <span className="text-gray-400 ml-1">({gig.client.completedJobs})</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 