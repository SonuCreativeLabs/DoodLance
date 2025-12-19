'use client';

import { ArrowLeft, Star, StarHalf, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from 'react';
import { useReviews } from '@/contexts/ReviewsContext';
import { reviews, getInitialRatingStats } from '@/data/reviewsData';

export default function ReviewsPage() {
  const { updateRating } = useReviews();

  // Calculate average rating and sync with ReviewsContext
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  useEffect(() => {
    // Update the reviews context with the calculated rating and review count
    updateRating(averageRating, totalReviews);
  }, [averageRating, totalReviews, updateRating]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-600" />);
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
          {/* Rating Summary */}
          <div className="flex items-center justify-between w-full py-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Average Rating</p>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-white mr-3">{averageRating.toFixed(1)}</span>
                <div className="flex">
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
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.avatar} alt={review.author} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white font-medium">
                          {review.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1.5">
                          <h4 className="font-semibold text-lg text-white leading-tight">{review.author}</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {review.role.split(',').map((role, idx) => (
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
                  
                  <div className="mt-3">
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                      <span className="ml-1.5 text-sm font-medium text-white/70">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-white/90 leading-relaxed italic mb-3">&quot;{review.comment}&quot;</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-white/40">
                        {new Date(review.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="flex items-center text-xs text-white/60 hover:text-purple-400 hover:bg-white/5 transition-colors px-3 py-1.5 rounded-full"
                          aria-label="Reply to review"
                        >
                          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                          <span>Reply</span>
                        </button>
                        <button 
                          className="flex items-center text-xs text-white/60 hover:text-purple-400 hover:bg-white/5 transition-colors px-3 py-1.5 rounded-full"
                          aria-label="Share review"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
