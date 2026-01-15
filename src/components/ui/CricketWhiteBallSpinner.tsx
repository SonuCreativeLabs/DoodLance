
import React from 'react';
import { motion } from 'framer-motion';

export const CricketWhiteBallSpinner = ({ className = "w-5 h-5" }: { className?: string }) => {
    return (
        <motion.div
            className={`rounded-full bg-white relative overflow-hidden flex-shrink-0 border border-gray-200 ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
            {/* Seam */}
            <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                <div className="w-full h-[15%] border-t border-b border-gray-400/50 bg-gray-100/30"></div>
            </div>

            {/* Texture/Shine */}
            <div className="absolute top-1 right-1 w-[30%] h-[30%] bg-white rounded-full opacity-80 blur-[0.5px]"></div>
        </motion.div>
    );
};
