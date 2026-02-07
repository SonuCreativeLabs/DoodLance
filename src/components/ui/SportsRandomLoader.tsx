"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SportsBalls = [
    {
        name: 'Cricket',
        component: () => (
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 relative"
                    animate={{ rotateZ: 360, y: [-20, 20, -20] }}
                    transition={{
                        rotateZ: { duration: 1.5, repeat: Infinity, ease: "linear" },
                        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-white/30 rounded-full" />
                    </div>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                        <div className="w-6 h-8 border-2 border-white/30 rounded-full border-t-transparent border-b-transparent rotate-90" />
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm" />
                </motion.div>
            </div>
        )
    },
    {
        name: 'Football',
        component: () => (
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full bg-white relative overflow-hidden border border-gray-300"
                    animate={{ rotateZ: 360, y: [-20, 20, -20] }}
                    transition={{
                        rotateZ: { duration: 2, repeat: Infinity, ease: "linear" },
                        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    {/* Pentagon pattern simplified */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                        <div className="bg-black/80 m-1 rounded-sm rotate-45" />
                        <div className="bg-black/80 m-1 rounded-sm -rotate-12" />
                        <div className="bg-black/80 m-1 rounded-sm rotate-12" />
                        <div className="bg-black/80 m-1 rounded-sm -rotate-45" />
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/60 rounded-full blur-sm" />
                </motion.div>
            </div>
        )
    },
    {
        name: 'Basketball',
        component: () => (
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 relative overflow-hidden"
                    animate={{ rotateZ: 360, y: [-20, 20, -20] }}
                    transition={{
                        rotateZ: { duration: 2.5, repeat: Infinity, ease: "linear" },
                        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    {/* Basketball lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-black/40" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-0.5 h-full bg-black/40" />
                    </div>
                    <div className="absolute inset-0 border-[6px] border-black/20 rounded-full" />
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full blur-sm" />
                </motion.div>
            </div>
        )
    },
    {
        name: 'Tennis',
        component: () => (
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full bg-[#ccff00] relative overflow-hidden shadow-inner"
                    animate={{ rotateZ: 360, y: [-20, 20, -20] }}
                    transition={{
                        rotateZ: { duration: 1.2, repeat: Infinity, ease: "linear" },
                        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    {/* Tennis ball curve */}
                    <div className="absolute inset-[-10%] border-2 border-white/60 rounded-[40%] rotate-45" />
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm" />
                </motion.div>
            </div>
        )
    },
    {
        name: 'Volleyball',
        component: () => (
            <div className="relative">
                <motion.div
                    className="w-16 h-16 rounded-full bg-white relative overflow-hidden border border-gray-200"
                    animate={{ rotateZ: 360, y: [-20, 20, -20] }}
                    transition={{
                        rotateZ: { duration: 1.8, repeat: Infinity, ease: "linear" },
                        y: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    {/* Volleyball panels simplified */}
                    <div className="absolute inset-0 flex flex-col justify-around py-1">
                        <div className="h-0.5 w-full bg-gray-300 rotate-12" />
                        <div className="h-0.5 w-full bg-gray-300 -rotate-12" />
                        <div className="h-0.5 w-full bg-gray-300 rotate-45" />
                    </div>
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/80 rounded-full blur-sm shadow-md" />
                </motion.div>
            </div>
        )
    }
];

export default function SportsRandomLoader({ text = "Loading your profile..." }: { text?: string }) {
    const [randomIndex, setRandomIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setRandomIndex(Math.floor(Math.random() * SportsBalls.length));
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const SelectedBall = SportsBalls[randomIndex].component;

    return (
        <div className="h-screen w-full bg-[#0F0F0F] flex flex-col items-center justify-center">
            {/* Random Ball Animation */}
            <div className="relative">
                <SelectedBall />

                {/* Shadow */}
                <motion.div
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black/40 rounded-full blur-md"
                    animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Loading Text */}
            <motion.div
                className="mt-12 text-white/70 text-sm font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {text}
            </motion.div>

            {/* Loading Dots */}
            <div className="flex gap-1.5 mt-3">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
