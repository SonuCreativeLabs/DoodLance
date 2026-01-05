
'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CricketComingSoonProps {
    title?: string;
    description?: React.ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
}

export const CricketComingSoon = ({
    title = "Innings Break!",
    description = (
        <>
            The Inbox is currently in the pavilion getting padded up. <br />
            It will be out on the field shortly!
        </>
    ),
    showBackButton = false,
    onBack
}: CricketComingSoonProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="relative w-64 h-64 mb-8">
                {/* Stumps */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 items-end">
                    <div className="w-2 h-32 bg-yellow-100 rounded-t-sm shadow-lg border border-yellow-900/20" />
                    <div className="w-2 h-32 bg-yellow-100 rounded-t-sm shadow-lg border border-yellow-900/20" />
                    <div className="w-2 h-32 bg-yellow-100 rounded-t-sm shadow-lg border border-yellow-900/20" />
                    {/* Bails */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-yellow-200 -mt-1 rounded-full shadow-sm" />
                </div>

                {/* Bouncing Ball Animation */}
                <motion.div
                    className="absolute w-8 h-8 bg-red-600 rounded-full border-2 border-red-800 shadow-xl overflow-hidden z-10"
                    initial={{ x: -100, y: 0, opacity: 0 }}
                    animate={{
                        x: [null, -50, 0, 100],
                        y: [50, 200, 150, 250],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, 360, 720]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.7, 1]
                    }}
                >
                    {/* Seam */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/50 -translate-y-1/2 transform rotate-45" />
                    <div className="absolute top-0 left-1/2 h-full w-[2px] bg-white/50 -translate-x-1/2 transform rotate-45" />
                </motion.div>

                {/* Dust Effect on Pitch */}
                <motion.div
                    className="absolute bottom-10 left-1/2 w-12 h-4 bg-yellow-600/20 rounded-full blur-md"
                    animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        times: [0.3, 0.4, 0.5]
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
            >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    {title}
                </h2>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                    {description}
                </p>

                <div className="pt-6 flex flex-col items-center gap-4">
                    <span className="px-4 py-2 bg-white/5 rounded-full text-sm text-white/60 border border-white/10">
                        🚧 Under Construction
                    </span>

                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Go Back</span>
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
