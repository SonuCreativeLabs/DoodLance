import { useState } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
  skills?: string[];
  url?: string;
}

interface PortfolioItemModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: PortfolioItem) => void;
}

export function PortfolioItemModal({ item, isOpen, onClose, onEdit }: PortfolioItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0F0F0F] flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full rounded-3xl shadow-2xl p-0 border border-white/10 overflow-hidden relative"
        style={{ background: '#000' }}>
        {/* Cancel (X) button inside card */}
        <button
          onClick={onClose}
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
