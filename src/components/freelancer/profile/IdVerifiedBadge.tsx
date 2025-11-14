import React from 'react';

interface IdVerifiedBadgeProps {
  isVerified?: boolean;
  className?: string;
  isDesktop?: boolean;
}

export function IdVerifiedBadge({ isVerified = true, className = '', isDesktop = false }: IdVerifiedBadgeProps) {
  if (!isVerified) return null;

  // Desktop version matches GAME ON desktop sizing
  if (isDesktop) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border-2 shadow-xl whitespace-nowrap transform rotate-[1deg] bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 text-white shadow-blue-500/60 border-dashed ${className}`}>
        {/* Cricket Ball Icon */}
        <div className="relative">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="tracking-widest font-black">ID VERIFIED</span>
      </div>
    );
  }

  // Mobile version (default)
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-bold border-2 shadow-lg whitespace-nowrap transform rotate-[-2deg] bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 text-white shadow-blue-500/50 border-dashed ${className}`}>
      {/* Cricket Ball Icon */}
      <div className="relative">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9"/>
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="tracking-widest font-black">ID VERIFIED</span>
    </div>
  );
}
