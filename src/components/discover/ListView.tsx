'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ListViewProps {
  filters: {
    radius: number;
    category: string;
    priceRange: [number, number];
    rating: number;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  rating: number;
  distance: number;
}

export function ListView({ filters }: ListViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // TODO: Fetch jobs from API based on filters
    // This is a mock implementation
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Plumbing Repair',
        description: 'Need help with a leaking faucet in the kitchen',
        price: 150,
        location: 'San Francisco, CA',
        category: 'plumbing',
        rating: 4.5,
        distance: 2.5,
      },
      {
        id: '2',
        title: 'Math Tutoring',
        description: 'Looking for a math tutor for high school algebra',
        price: 50,
        location: 'Oakland, CA',
        category: 'tutoring',
        rating: 4.8,
        distance: 5.2,
      },
      // Add more mock jobs here
    ];

    setJobs(mockJobs);
  }, [filters]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{job.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">${job.price}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{job.rating}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>{job.location}</p>
                <p>{job.distance} km away</p>
              </div>
              <div className="mt-4">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  Apply Now
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 