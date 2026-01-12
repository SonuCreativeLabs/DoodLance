import React from 'react';

export const CricketBat = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {/* Handle Cap */}
        <path d="M10 2h4" />
        {/* Handle Grip */}
        <path d="M12 2v5" />
        {/* Blade */}
        <rect x="8" y="7" width="8" height="15" rx="1" />
        {/* Splice/Spine Detail */}
        <path d="M12 7v8" strokeOpacity="0.5" />
    </svg>
);
