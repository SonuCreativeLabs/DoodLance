'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { setSessionFlag, setSessionItem } from '@/utils/sessionStorage';
import { freelancerData } from '../../profileData';

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  tags?: string[];
};

export default function PortfolioPage() {
  const router = useRouter();
  const portfolioItems: PortfolioItem[] = freelancerData.portfolio;

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
      setSessionFlag('fromPortfolio', true);
      setSessionItem('lastVisitedSection', 'portfolio');
      setSessionFlag('scrollToPortfolio', true);

      const returnPath = '/freelancer/profile';
      setSessionItem(
        'returnToProfilePreview',
        `${window.location.origin}${returnPath}#portfolio`,
      );

      window.location.href = `${returnPath}#portfolio`;
    } else {
      router.back();
    }
  };

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
                  try {
                    sessionStorage.removeItem('returnToProfilePreview');
                  } catch {
                    // ignore storage errors
                  }
                  router.push(`/freelancer/profile/preview/portfolio/${item.id}`);
                }}
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.target as HTMLImageElement;
                        target.src =
                          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIFRodW1ibmFpbCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
                    <div className="flex justify-between items-end">
                      <div className="pr-2">
                        <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
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
