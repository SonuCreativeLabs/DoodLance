
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
        <div className="fixed inset-0 z-[100] bg-[#111111] overflow-hidden">
            {/* Blurred Content */}
            <div
                className="opacity-20 blur-sm pointer-events-none select-none h-full w-full"
                aria-hidden="true"
            >
                {children}
            </div>

            {/* Overlay Banner */}
            <div className="absolute inset-0 flex items-center justify-center z-50 px-4">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-2xl max-w-md w-full">
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
