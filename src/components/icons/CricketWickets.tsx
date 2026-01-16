import React from 'react';

export const CricketWickets = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
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
        {/* Stumps */}
        <path d="M8 21V6" />
        <path d="M12 21V6" />
        <path d="M16 21V6" />

        {/* Bails */}
        <path d="M8 6h4" />
        <path d="M12 6h4" />

        {/* Ground line (optional base) */}
        <path d="M4 21h16" />
    </svg>
);
