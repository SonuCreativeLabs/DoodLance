'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, User, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useReviews } from '@/contexts/ReviewsContext';
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';

export type Review = {
  id: string;
  author: string;
  role?: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
};

export default function ReviewsPage() {
  const router = useRouter();
  const { reviewsData: contextReviewsData } = useReviews();
  const { personalDetails } = usePersonalDetails();
  const [reviews, setReviews] = useState<Review[]>(contextReviewsData.reviews);
  const [freelancerName, setFreelancerName] = useState(personalDetails.name);

  // Hide header and navbar for this page
  useEffect(() => {
    const header = document.querySelector('header');
    const navbar = document.querySelector('nav');
    
    if (header) header.style.display = 'none';
    if (navbar) navbar.style.display = 'none';
    
    return () => {
      if (header) header.style.display = '';
      if (navbar) navbar.style.display = '';
    };
  }, []);

  // Sync reviews from context
  useEffect(() => {
    setReviews(contextReviewsData.reviews);
    setFreelancerName(personalDetails.name);
  }, [contextReviewsData.reviews, personalDetails.name]);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollToReviews', 'true');
      const returnUrl = sessionStorage.getItem('returnToProfilePreview');
      if (returnUrl) {
        try {
          const u = new URL(returnUrl);
          const relative = `${u.pathname}${u.search}${u.hash}`;
          router.push(relative);
          return;
        } catch {
          // fall through to default path
        }
      }
      // Fallbacks
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/freelancer/profile');
      }
    } else {
      router.back();
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Sticky Header with back button and title */}
      <div className="sticky top-0 z-50 px-4 py-2 border-b border-white/5 bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            aria-label="Back to profile preview"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">Client Reviews</h1>
            <p className="text-white/50 text-xs">What clients say about working with {freelancerName}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <div className="flex items-center bg-gradient-to-r from-amber-400 to-yellow-400 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-amber-800 fill-current mr-1" />
              <span className="text-sm font-bold text-amber-900">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const averageRating = reviews.length > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                    : 0;
                  const fillPercentage = Math.min(Math.max(0, averageRating - (star - 1)), 1) * 100;
                  
                  return (
                    <div key={star} className="relative h-4 w-4">
                      <Star className="absolute h-4 w-4 text-gray-400" />
                      <div 
                        className="absolute h-4 overflow-hidden" 
                        style={{ width: `${fillPercentage}%` }}
                      >
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="ml-2 text-sm font-medium text-white/80">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{review.author}</h4>
                      {review.role && (
                        <div className="text-xs text-white/60 truncate">
                          {review.role}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-white/40 whitespace-nowrap ml-2">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-white/80 flex-1">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 rounded-3xl border border-white/10 bg-white/5">
            <MessageSquare className="h-12 w-12 mx-auto text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white">No reviews yet</h3>
            <p className="text-white/60 mt-1">Be the first to leave a review</p>
          </div>
        )}
      </div>
    </div>
  );
}
