'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { setSessionFlag, setSessionItem } from '@/utils/sessionStorage';
import { usePortfolio, type PortfolioItem } from '@/contexts/PortfolioContext';

import { PortfolioItemModal } from '@/components/common/PortfolioItemModal';

export default function PortfolioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');

  const { portfolio, isHydrated } = usePortfolio();
  const [overrideItems, setOverrideItems] = useState<PortfolioItem[] | null>(null);
  const portfolioItems = useMemo(() => overrideItems ?? portfolio, [overrideItems, portfolio]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  // Check if we're viewing a freelancer's portfolio or user's own portfolio
  useEffect(() => {
    if (freelancerId) {
      // Show freelancer's portfolio
      fetch(`/api/freelancers/${freelancerId}`)
        .then(res => res.json())
        .then(data => {
          const profile = data.freelancerProfile;
          if (profile && profile.portfolios) {
            const items = profile.portfolios.map((p: any) => ({
              id: p.id,
              title: p.title,
              category: p.category,
              image: p.imageUrl || p.images || '/placeholder.jpg', // Map image field
              images: p.images ? [p.images] : [],
              description: p.description,
              skills: p.skills ? (p.skills.startsWith('[') ? JSON.parse(p.skills) : [p.skills]) : []
            }));
            setOverrideItems(items);
          } else {
            setOverrideItems([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch portfolio", err);
          setOverrideItems([]);
        });
    } else {
      // Show user's own portfolio
      setOverrideItems(null); // Use context data
    }
  }, [freelancerId]);

  // Debug: Log portfolio changes
  useEffect(() => {
    console.log('Portfolio Preview Page - Portfolio items:', portfolio.length, portfolio);
  }, [portfolio]);

  // Prefer data passed from ProfilePreview via sessionStorage to avoid reload races
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFromPreview = window.location.hash === '#fromPreview';
    if (!isFromPreview) return;
    try {
      const stored = sessionStorage.getItem('portfolioPreviewData');
      if (stored) {
        const parsed = JSON.parse(stored) as PortfolioItem[];
        // Basic validation
        if (Array.isArray(parsed)) {
          setOverrideItems(parsed);
        }
        sessionStorage.removeItem('portfolioPreviewData');
      }
    } catch (e) {
      console.error('Failed to load preview portfolio from sessionStorage', e);
    }
  }, []);

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

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollToPortfolio', 'true');

      // Check if we're viewing a freelancer's portfolio
      if (freelancerId) {
        // Go back to the freelancer detail page
        const freelancerPath = `/client/freelancer/${freelancerId}`;
        setSessionItem(
          'returnToProfilePreview',
          `${window.location.origin}${freelancerPath}#portfolio`,
        );
        router.push(`${freelancerPath}#portfolio`);
      } else {
        // Go back to user's profile
        const returnPath = '/freelancer/profile';
        setSessionItem(
          'returnToProfilePreview',
          `${window.location.origin}${returnPath}#portfolio`,
        );
        router.push(`${returnPath}#portfolio`);
      }
    } else {
      router.back();
    }
  };

  // Wait for context to hydrate before showing content
  if (!isHydrated && !overrideItems) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
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
            <h1 className="text-lg font-semibold text-white">My Portfolio</h1>
            <p className="text-white/50 text-xs">Showcase of my best work and projects</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedPortfolioItem(item);
                  setIsModalOpen(true);
                }}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.currentTarget as HTMLImageElement;
                        target.src =
                          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIFRodW1ibmFpbCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
                    <div className="flex justify-between items-end mb-8">
                      <div className="pr-2 flex-1">
                        <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs rounded-full border max-w-[180px]">
                      {item.category}
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

      {/* Portfolio Item Modal */}
      <PortfolioItemModal
        item={selectedPortfolioItem}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPortfolioItem(null);
        }}
      />
    </div>
  );
}
