"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
            <Image
              src="/logo.svg"
              alt="DoodLance Logo"
              fill
              className="object-contain"
              priority
            />
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