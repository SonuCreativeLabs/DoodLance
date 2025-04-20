'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

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

interface GigCardProps {
  gig: Gig;
  isSelected: boolean;
  onClick: () => void;
}

export function GigCard({ gig, isSelected, onClick }: GigCardProps) {
  return (
    <Card 
      className={`hover:shadow-lg transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{gig.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-2">{gig.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            ${gig.budget.min} - ${gig.budget.max}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{gig.client.rating}</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>{gig.location.address}</p>
          <p>{gig.distance.toFixed(1)} km away</p>
          <p>Posted {new Date(gig.postedTime).toLocaleDateString()}</p>
        </div>
        <div className="mt-2 text-sm">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {gig.category}
          </span>
        </div>
        <div className="mt-4">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
            Apply Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
} 