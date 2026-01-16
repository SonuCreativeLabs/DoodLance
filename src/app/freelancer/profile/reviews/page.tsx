'use client';

import { ArrowLeft, Star, StarHalf, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from 'react';
import { useReviews } from '@/contexts/ReviewsContext';
import { Skeleton } from "@/components/ui/skeleton";
import { reviews, getInitialRatingStats } from '@/data/reviewsData';

export default function ReviewsPage() {
  const { reviewsData, updateRating, isLoading } = useReviews();
  const { reviews, averageRating, totalReviews } = reviewsData;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Link
                href="/freelancer/profile"
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                aria-label="Back to profile"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">Client Reviews</h1>
                <p className="text-white/50 text-xs">What your clients say about your work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Rating Summary Skeleton */}
            <div className="flex items-center justify-between w-full py-4 bg-[#1E1E1E] px-6 rounded-2xl border border-white/5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-12" />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-5 w-5 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16 ml-auto" />
                <Skeleton className="h-6 w-24 ml-auto" />
              </div>
            </div>

            {/* Reviews Grid Skeleton */}
            <div className="grid grid-cols-1 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-white/5 bg-[#1A1A1A] rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4 w-full">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <div className="flex gap-2">
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Skeleton key={s} className="h-4 w-4 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="pt-2 border-t border-white/5">
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // If we needed to sync local calcs back to context, we'd do it here, 
    // but context already manages this providing we used hydrateReviews/updateReviews correctly.
    // Actually, ReviewsContext calculates these itself when we hydrate. 
    // We just display what's in context.
  }, [reviewsData]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-white/20" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              aria-label="Back to profile"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Client Reviews</h1>
              <p className="text-white/50 text-xs">What your clients say about your work</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
              <p className="text-white/50 max-w-sm">
                Complete jobs efficiently to earn positive reviews and build your reputation.
              </p>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="flex items-center justify-between w-full py-4 bg-[#1E1E1E] px-6 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white/70 text-sm mb-1">Average Rating</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white mr-3">{averageRating.toFixed(1)}</span>
                    <div className="flex space-x-0.5">
                      {renderStars(averageRating)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Based on</p>
                  <p className="text-lg font-medium text-white">
                    {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                  </p>
                </div>
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 gap-5">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="border-white/5 bg-[#1A1A1A] hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12 border border-white/10">
                            {/* Assuming avatar URL might be missing, adding fallback */}
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.author}`} alt={review.author} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium">
                              {review.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="space-y-1.5">
                              <h4 className="font-semibold text-lg text-white leading-tight">{review.author}</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {(review.role || 'Client').split(',').map((role, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center h-5 text-[11px] font-medium px-2.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200"
                                  >
                                    {role.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center mb-3">
                          <div className="flex space-x-0.5">
                            {renderStars(review.rating)}
                          </div>
                          <span className="ml-2 text-sm font-medium text-white/70">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-white/90 leading-relaxed italic mb-4 text-base opacity-90">&quot;{review.comment}&quot;</p>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="text-xs text-white/40">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          {/* Removed action buttons as they are not functional yet */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
