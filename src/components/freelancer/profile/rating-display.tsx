'use client';

import { Star } from "lucide-react";

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
      <section className="max-w-2xl mx-auto w-full px-2 md:px-0 text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-100 mb-6">Client Ratings</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold text-neutral-100">{averageRating.toFixed(1)}</div>
          <div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between border-b border-neutral-700 py-3">
              <div>
                <div className="font-medium text-neutral-100">{review.clientName}</div>
                <div className="text-xs text-neutral-400">{review.date}</div>
                <div className="text-sm text-neutral-300 mt-1">{review.comment}</div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}