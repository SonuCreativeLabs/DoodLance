'use client';
import { notFound } from 'next/navigation';
import { usePortfolio } from '@/contexts/PortfolioContext';
import Image from 'next/image';
import { useEffect } from 'react';
import { CategoryBadge } from '@/components/common/CategoryBadge';

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const { portfolio, isHydrated } = usePortfolio();
  const item = portfolio.find((p) => p.id === String(params.id));

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

  // Wait for context to hydrate before checking if item exists
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!item) {
    notFound();
    return null;
  }

  const handleCancel = () => {
    // Scroll to portfolio section in the profile preview
    if (typeof window !== 'undefined') {
      // Store scroll position before navigating back
      sessionStorage.setItem('scrollToPortfolio', 'true');
      // Navigate back to the portfolio page
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center py-12 px-4 relative">
      <div className="max-w-2xl w-full rounded-3xl shadow-2xl p-0 border border-white/10 overflow-hidden relative"
        style={{ background: '#000' }}>
        {/* Cancel (X) button inside card */}
        <button
          onClick={handleCancel}
          aria-label="Close portfolio detail"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition shadow-md backdrop-blur-md"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 6L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {/* Floating image */}
        <div className="relative w-full aspect-video">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover rounded-t-3xl shadow-lg"
            style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-3xl" />
          {/* Category tag on image */}
          <CategoryBadge
            category={item.category}
            type="portfolio"
            size="sm"
            className="absolute bottom-3 left-3"
          />
        </div>
        {/* Card Content */}
        <div className="p-8 pt-6 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg text-left leading-tight">{item.title}</h1>
          {item.description && (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-1 mt-3">Description</h3>
              <p className="text-white/80 text-base leading-relaxed mb-2">
                {item.description}
              </p>
            </>
          )}
          {item.skills && item.skills.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-1 mt-4">Skills Used</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium border shadow-sm backdrop-blur-md"
                    style={{
                      background: 'var(--purple-dark, #4C1D95)',
                      color: '#FFF',
                      borderColor: 'var(--purple, #8B66D1)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
