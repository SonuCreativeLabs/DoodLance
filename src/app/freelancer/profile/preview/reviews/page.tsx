'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Star, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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
  const searchParams = useSearchParams();

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [freelancerName, setFreelancerName] = useState('My');
  const [returnUrl, setReturnUrl] = useState('');

  useEffect(() => {
    // Check if we're coming from the profile preview modal
    const isFromPreview = window.location.hash === '#fromPreview';
    
    if (isFromPreview) {
      // Get data from session storage
      const storedReviews = sessionStorage.getItem('reviewsPreviewData');
      const storedName = sessionStorage.getItem('freelancerName');
      
      if (storedReviews) {
        try {
          const parsedReviews = JSON.parse(storedReviews);
          console.log('Loaded reviews from session storage:', parsedReviews);
          setReviews(parsedReviews);
          
          // Clear the stored data after using it
          sessionStorage.removeItem('reviewsPreviewData');
        } catch (error) {
          console.error('Error parsing reviews data from session storage:', error);
        }
      }
      
      if (storedName) {
        setFreelancerName(storedName);
        sessionStorage.removeItem('freelancerName');
      }
      
      // Set return URL to go back to the profile page
      setReturnUrl('/freelancer/profile');
    } else {
      // Fallback to URL parameters if not coming from preview
      const reviewsParam = searchParams.get('reviews');
      const nameParam = searchParams.get('freelancerName');
      const returnUrlParam = searchParams.get('returnUrl');
      
      console.log('Raw reviews param:', reviewsParam);
      
      // Mock reviews data in case URL parameter is missing
      const mockReviews: Review[] = [
        {
          id: '1',
          author: 'Rahul Sharma',
          role: 'U-19 Cricket Team Captain',
          rating: 5,
          comment: 'Sonu transformed my batting technique completely. His one-on-one sessions helped me improve my average by 35% in just 3 months. His knowledge of the game is exceptional!',
          date: '2024-05-10',
          isVerified: true
        },
        {
          id: '2',
          author: 'Neha Patel',
          role: 'Startup Founder',
          rating: 5,
          comment: 'The AI solution developed by Sonu automated our customer service, reducing response time by 80%. His technical expertise and problem-solving skills are top-notch!',
          date: '2024-04-18',
          isVerified: true
        },
        {
          id: '3',
          author: 'Amit Kumar',
          role: 'Cricket Academy Director',
          rating: 4,
          comment: 'Sonu\'s coaching methods are innovative and effective. He has a unique way of breaking down complex techniques into simple, actionable steps.',
          date: '2024-03-29',
          isVerified: true
        },
        {
          id: '4',
          author: 'Priya Singh',
          role: 'Tech Entrepreneur',
          rating: 5,
          comment: 'Working with Sonu was a game-changer for our business. His technical solutions are not just effective but also scalable. Highly recommended!',
          date: '2024-03-15',
          isVerified: true
        },
        {
          id: '5',
          author: 'Vikram Mehta',
          role: 'Cricket Enthusiast',
          rating: 5,
          comment: 'The best coach I\'ve ever worked with. Sonu\'s attention to detail and personalized approach helped me correct years of bad batting habits.',
          date: '2024-02-28',
          isVerified: true
        }
      ];

      if (reviewsParam) {
        try {
          const decodedReviews = decodeURIComponent(reviewsParam);
          console.log('Decoded reviews:', decodedReviews);
          const parsedReviews = JSON.parse(decodedReviews);
          console.log('Parsed reviews:', parsedReviews);
          setReviews(parsedReviews);
        } catch (error) {
          console.error('Error parsing reviews data:', error);
          // Fallback to mock data if there's an error
          setReviews(mockReviews);
        }
      } else {
        // Use mock data if no reviews parameter is provided
        console.log('Using mock reviews data');
        setReviews(mockReviews);
      }
      
      if (nameParam) {
        setFreelancerName(decodeURIComponent(nameParam));
      } else {
        // Default name if not provided
        setFreelancerName("Sonu's");
      }
      
      if (returnUrlParam) {
        setReturnUrl(decodeURIComponent(returnUrlParam));
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      // Store a flag to indicate we want to scroll to reviews
      sessionStorage.setItem('scrollToReviews', 'true');
      
      // Check if we have a return URL from the profile preview
      const returnUrl = sessionStorage.getItem('returnToProfilePreview');
      
      if (returnUrl) {
        // Navigate back to the exact URL that was stored when opening reviews
        window.location.href = returnUrl;
      } else {
        // Fallback to history back if no return URL is found
        window.history.back();
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
