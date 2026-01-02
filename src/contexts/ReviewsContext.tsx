'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { getInitialRatingStats, reviews as reviewsDataMock } from '@/data/reviewsData';
import { createClient } from '@/lib/supabase/client';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  role?: string;
  isVerified?: boolean;
}

export interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

interface ReviewsContextType {
  reviewsData: ReviewsData;
  updateReviews: (reviews: Review[]) => void;
  updateRating: (rating: number, reviewCount: number) => void;
  addReview: (review: Review) => void;
  removeReview: (reviewId: string) => void;
}



const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviewsData, setReviewsData] = useState<ReviewsData>({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  });
  const hasHydrated = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/freelancer/reviews');
        if (!response.ok) return;

        const { reviews: data } = await response.json();

        if (data) {
          const formattedReviews: Review[] = data.map((r: any) => ({
            id: r.id,
            author: r.client?.name || 'Anonymous', // Use joined client data
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.createdAt).toISOString().split('T')[0],
            role: 'Client', // Default role since clientRole is not in schema often
            isVerified: r.isVerified
          }));

          const totalRating = formattedReviews.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating = formattedReviews.length > 0 ? totalRating / formattedReviews.length : 0;

          setReviewsData({
            reviews: formattedReviews,
            averageRating: parseFloat(avgRating.toFixed(1)),
            totalReviews: formattedReviews.length
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const updateReviews = useCallback((reviews: Review[]) => {
    setReviewsData(prev => ({
      ...prev,
      reviews,
    }));
  }, []);

  const updateRating = useCallback((rating: number, reviewCount: number) => {
    setReviewsData(prev => ({
      ...prev,
      averageRating: rating,
      totalReviews: reviewCount,
    }));
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviewsData(prev => ({
      ...prev,
      reviews: [...prev.reviews, review],
    }));
  }, []);

  const removeReview = useCallback((reviewId: string) => {
    setReviewsData(prev => ({
      ...prev,
      reviews: prev.reviews.filter(r => r.id !== reviewId),
    }));
  }, []);

  const value: ReviewsContextType = {
    reviewsData,
    updateReviews,
    updateRating,
    addReview,
    removeReview,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
