'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  tags?: string[];
};

export default function PortfolioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [freelancerName, setFreelancerName] = useState('My');
  const [returnUrl, setReturnUrl] = useState('');

  useEffect(() => {
    // Check if we're coming from the profile preview modal
    const isFromPreview = window.location.hash === '#fromPreview';
    
    if (isFromPreview) {
      // Get data from session storage
      const storedPortfolio = sessionStorage.getItem('portfolioPreviewData');
      const storedName = sessionStorage.getItem('freelancerName');
      
      if (storedPortfolio) {
        try {
          const parsedPortfolio = JSON.parse(storedPortfolio);
          setPortfolioItems(parsedPortfolio);
          
          // Clear the stored data after using it
          sessionStorage.removeItem('portfolioPreviewData');
        } catch (error) {
          console.error('Error parsing portfolio data from session storage:', error);
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
      const portfolioParam = searchParams.get('portfolio');
      const nameParam = searchParams.get('freelancerName');
      const returnUrlParam = searchParams.get('returnUrl');
      
      if (portfolioParam) {
        try {
          const decodedPortfolio = decodeURIComponent(portfolioParam);
          const parsedPortfolio = JSON.parse(decodedPortfolio);
          setPortfolioItems(parsedPortfolio);
        } catch (error) {
          console.error('Error parsing portfolio data from URL:', error);
        }
      }
      
      if (nameParam) {
        setFreelancerName(decodeURIComponent(nameParam));
      }
      
      if (returnUrlParam) {
        setReturnUrl(decodeURIComponent(returnUrlParam));
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    console.log('Back button clicked');
    // Check if we have a stored URL to return to the profile preview
    const returnToPreview = sessionStorage.getItem('returnToProfilePreview');
    console.log('Stored return URL:', returnToPreview);
    
    if (returnToPreview) {
      console.log('Navigating back to profile preview');
      // Clear the stored URL
      sessionStorage.removeItem('returnToProfilePreview');
      // Navigate back to the profile preview with the stored URL
      window.location.href = returnToPreview;
    } else if (window.history.length > 1) {
      // Fallback to browser history if available
      router.back();
    } else {
      // Fallback to the profile page
      router.push('/freelancer/profile');
    }
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
            <h1 className="text-lg font-semibold text-white">{freelancerName}'s Portfolio</h1>
            <p className="text-white/50 text-xs">Showcase of my best work and projects</p>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIFRodW1ibmFpbCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
                    <div className="flex justify-between items-end">
                      <div className="pr-2">
                        <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
                        <p className="text-xs text-white/80 mt-0.5">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/60">No portfolio items to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
