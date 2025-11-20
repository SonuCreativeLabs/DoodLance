'use client';
import { notFound } from 'next/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePortfolio } from '@/contexts/PortfolioContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { professionals } from '@/app/client/nearby/mockData';

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const freelancerId = searchParams.get('freelancerId');
  
  const { portfolio, isHydrated } = usePortfolio();
  const [item, setItem] = useState<any>(null);

  // Check if we're viewing a freelancer's portfolio item or user's own
  useEffect(() => {
    console.log('PortfolioDetailPage - freelancerId:', freelancerId, 'params.id:', params.id);
    
    if (freelancerId) {
      // Show freelancer's portfolio item
      const freelancer = professionals.find(p => p.id.toString() === freelancerId);
      console.log('Found freelancer:', freelancer?.name, 'portfolio:', freelancer?.portfolio);
      
      if (freelancer && freelancer.portfolio) {
        const portfolioItem = freelancer.portfolio.find((p) => p.id === String(params.id));
        console.log('Found portfolio item:', portfolioItem);
        setItem(portfolioItem);
      } else {
        console.log('Freelancer not found or no portfolio');
        setItem(null);
      }
    } else {
      // Show user's own portfolio item
      const portfolioItem = portfolio.find((p) => p.id === String(params.id));
      console.log('User portfolio item:', portfolioItem);
      setItem(portfolioItem);
    }
  }, [freelancerId, portfolio, params.id]);

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
      
      // Check if we're viewing a freelancer's portfolio
      const urlParams = new URLSearchParams(window.location.search);
      const freelancerId = urlParams.get('freelancerId');
      
      if (freelancerId) {
        // Go back to the freelancer detail page
        window.location.href = `/client/freelancer/${freelancerId}#portfolio`;
      } else {
        // Go back to user's profile
        window.history.back();
      }
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
          <div className="absolute bottom-3 left-3 bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs rounded-full border">
            {item.category}
          </div>
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
                {item.skills.map((skill: string, idx: number) => (
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
