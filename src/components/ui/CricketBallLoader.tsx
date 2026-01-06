"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function CricketBallLoader() {
    return (
        <div className="h-screen w-full bg-[#0F0F0F] flex flex-col items-center justify-center">
            {/* Cricket Ball Animation */}
            <div className="relative">
                {/* Ball */}
                <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 relative"
                    animate={{
                        rotateZ: 360,
                        y: [-20, 20, -20],
                    }}
                    transition={{
                        rotateZ: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        y: {
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                >
                    {/* Seam */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-white/30 rounded-full" />
                    </div>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                        <div className="w-6 h-8 border-2 border-white/30 rounded-full border-t-transparent border-b-transparent rotate-90" />
                    </div>

                    {/* Shine effect */}
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm" />
                </motion.div>

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
                Loading your profile...
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
