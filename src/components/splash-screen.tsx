"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start transition after 3 seconds (as per blueprint)
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete after animation finishes (0.5s)
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative w-40 h-40 mb-8"
          >
            <svg width="160" height="160" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="object-contain">
              <circle cx="256" cy="256" r="240" stroke="#4F46E5" strokeWidth="16" strokeDasharray="20,10"/>
              <path d="M256 140C200 140 160 180 160 240C160 280 180 310 220 330L220 370C220 380 230 390 240 390L272 390C282 390 292 380 292 370L292 330C332 310 352 280 352 240C352 180 312 140 256 140Z" fill="#4F46E5"/>
              <circle cx="200" cy="200" r="30" fill="#4F46E5"/>
              <circle cx="312" cy="200" r="30" fill="#4F46E5"/>
              <circle cx="256" cy="260" r="15" fill="white"/>
              <path d="M236 280 L276 280" stroke="white" strokeWidth="8" strokeLinecap="round"/>
              <path d="M160 100A10 10 0 0 1 180 100A10 10 0 0 1 160 100" fill="#4F46E5" transform="rotate(45, 170, 100)"/>
              <path d="M332 100A10 10 0 0 1 352 100A10 10 0 0 1 332 100" fill="#4F46E5" transform="rotate(-45, 342, 100)"/>
            </svg>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-white text-center mb-3"
          >
            DoodLance
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg text-gray-400 text-center max-w-xs"
          >
            Connect with skilled professionals
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 