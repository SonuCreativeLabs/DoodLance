
'use client';

import React from 'react';
import { CricketComingSoon } from '@/components/common/CricketComingSoon';

interface ComingSoonOverlayProps {
    children: React.ReactNode;
    title?: string;
    description?: React.ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const ComingSoonOverlay = ({ children, title, description, showBackButton, onBack }: ComingSoonOverlayProps) => {
    return (
        <div className="relative w-full min-h-screen">
            {/* Blurred Content */}
            <div
                className="opacity-20 blur-sm pointer-events-none select-none"
                aria-hidden="true"
            >
                {children}
            </div>

            {/* Overlay Banner */}
            <div className="absolute inset-0 flex items-start justify-center pt-20 z-50">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-2xl">
                    <CricketComingSoon
                        title={title}
                        description={description}
                        showBackButton={showBackButton}
                        onBack={onBack}
                    />
                </div>
            </div>
        </div>
    );
};
