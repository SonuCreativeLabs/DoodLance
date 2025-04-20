'use client';

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  jobTitle: string;
}

export function RatingDisplay() {
  const reviews: Review[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent work! Very professional and completed the job ahead of schedule.',
      date: '2024-02-15',
      jobTitle: 'Bathroom Renovation'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      rating: 4,
      comment: 'Good quality work, but was a bit late on the first day.',
      date: '2024-01-20',
      jobTitle: 'Electrical Installation'
    }
  ];

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{review.clientName}</h3>
                <p className="text-sm text-gray-500">{review.jobTitle}</p>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
          </Card>
        ))}
      </div>
    </div>
  );
} 