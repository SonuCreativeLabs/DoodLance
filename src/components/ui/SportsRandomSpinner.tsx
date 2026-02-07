"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Spinners = [
    {
        name: 'Cricket',
        component: ({ className }: { className: string }) => (
            <motion.div
                className={`rounded-full bg-white relative overflow-hidden flex-shrink-0 border border-gray-200 ${className}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                    <div className="w-full h-[15%] border-t border-b border-gray-400/50 bg-gray-100/30"></div>
                </div>
                <div className="absolute top-1 right-1 w-[30%] h-[30%] bg-white rounded-full opacity-80 blur-[0.5px]"></div>
            </motion.div>
        )
    },
    {
        name: 'Football',
        component: ({ className }: { className: string }) => (
            <motion.div
                className={`rounded-full bg-white relative overflow-hidden flex-shrink-0 border border-gray-300 ${className}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div className="bg-black/80 m-[10%] rounded-sm rotate-45" />
                    <div className="bg-black/80 m-[10%] rounded-sm -rotate-12" />
                    <div className="bg-black/80 m-[10%] rounded-sm rotate-12" />
                    <div className="bg-black/80 m-[10%] rounded-sm -rotate-45" />
                </div>
            </motion.div>
        )
    },
    {
        name: 'Basketball',
        component: ({ className }: { className: string }) => (
            <motion.div
                className={`rounded-full bg-orange-600 relative overflow-hidden flex-shrink-0 border border-orange-800 ${className}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[5%] bg-black/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[5%] h-full bg-black/40" />
                </div>
                <div className="absolute inset-0 border-[2px] border-black/20 rounded-full" />
            </motion.div>
        )
    },
    {
        name: 'Tennis',
        component: ({ className }: { className: string }) => (
            <motion.div
                className={`rounded-full bg-[#ccff00] relative overflow-hidden flex-shrink-0 border border-[#b2d900] ${className}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-[-10%] border border-white/60 rounded-[40%] rotate-45" />
            </motion.div>
        )
    }
];

export const SportsRandomSpinner = ({ className = "w-5 h-5" }: { className?: string }) => {
    const [randomIndex, setRandomIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setRandomIndex(Math.floor(Math.random() * Spinners.length));
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className={className} />;

    const SelectedSpinner = Spinners[randomIndex].component;

    return <SelectedSpinner className={className} />;
};
