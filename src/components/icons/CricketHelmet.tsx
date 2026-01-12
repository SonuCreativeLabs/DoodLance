import React from 'react';

export const CricketHelmet = ({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) => (
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
        {/* Dome and Back Flap */}
        <path d="M4 12V9a8 8 0 0 1 16 0v2" />
        <path d="M4 12h16" />
        <path d="M4 12v3a3 3 0 0 0 3 3h3" />

        {/* Peak/Visor */}
        <path d="M20 11h2" />

        {/* Grille (Face Guard) */}
        <path d="M22 13v4a2 2 0 0 1-2 2h-4" />
        <path d="M18 19v-4" />

        {/* Ear protection detail */}
        <circle cx="9" cy="13.5" r="1.5" />
    </svg>
);
