import React from 'react';

export const CricketBall = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        {...props}
    >
        <circle cx="12" cy="12" r="10" className="text-red-600" fill="currentColor" />
        {/* Seam */}
        <path
            d="M12 2C14.5 2 16.5 6.47715 16.5 12C16.5 17.5228 14.5 22 12 22"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 2"
            fill="none"
            className="opacity-80"
        />
        <path
            d="M12 2C9.5 2 7.5 6.47715 7.5 12C7.5 17.5228 9.5 22 12 22"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4 2"
            fill="none"
            className="opacity-80"
        />
        {/* Shine/Reflection for depth */}
        <path
            d="M15 6C16 6 17 7 17 8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-30"
        />
    </svg>
);
