'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { getInitialRatingStats, reviews as reviewsData } from '@/data/reviewsData';

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

const initialReviewsData: ReviewsData = (() => {
  const { averageRating, totalReviews } = getInitialRatingStats();
  return {
    reviews: reviewsData as Review[],
    averageRating,
    totalReviews,
  };
})();

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviewsData, setReviewsData] = useState<ReviewsData>(initialReviewsData);
  const hasHydrated = useRef(false);

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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reviewsData');
      if (saved) {
        setReviewsData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to parse reviews data:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever it changes (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('reviewsData', JSON.stringify(reviewsData));
  }, [reviewsData]);

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
