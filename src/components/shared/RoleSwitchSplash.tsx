'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, Briefcase, Users, Zap, Target } from 'lucide-react';

interface RoleSwitchSplashProps {
  targetRole: 'client' | 'freelancer';
  isVisible: boolean;
}

export function RoleSwitchSplash({ targetRole, isVisible }: RoleSwitchSplashProps) {
  if (!isVisible) return null;

  const isFreelancer = targetRole === 'freelancer';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Backgrounds */}
          {isFreelancer ? (
            // Freelancer Theme (Green/Field)
            <div className="absolute inset-0 bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-[#0a0a0a] to-[#0a0a0a]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.05]" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-900/20 to-transparent" />
            </div>
          ) : (
            // Client Theme (Purple/Stadium)
            <div className="absolute inset-0 bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a0a] to-[#0a0a0a]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.05]" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>
          )}

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-4">
            
            {/* Animated Icon/Graphic */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-8 relative"
            >
              {isFreelancer ? (
                // Freelancer Graphic
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-green-500/30"
                  />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    <Users className="w-12 h-12 text-white -rotate-45" />
                  </motion.div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-green-500/50 px-4 py-1.5 rounded-full text-green-400 text-xs font-bold flex items-center gap-1.5 shadow-lg z-20 whitespace-nowrap">
                    <Zap className="w-3 h-3 fill-current" />
                    PLAYER MODE
                  </div>
                </div>
              ) : (
                // Client Graphic
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
                  />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 border border-purple-500/50 px-4 py-1.5 rounded-full text-purple-400 text-xs font-bold flex items-center gap-1.5 shadow-lg z-20 whitespace-nowrap">
                    <Target className="w-3 h-3" />
                    CAPTAIN MODE
                  </div>
                </div>
              )}
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {isFreelancer ? (
                  <span>Padding Up...</span>
                ) : (
                  <span>Taking the Toss...</span>
                )}
              </h2>
              
              <p className={`text-lg font-medium ${isFreelancer ? 'text-green-400' : 'text-purple-400'}`}>
                {isFreelancer ? 'Switching to Player Profile' : 'Switching to Client Dashboard'}
              </p>

              {/* Loading Indicator */}
              <div className="flex justify-center gap-1 mt-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.2
                    }}
                    className={`w-3 h-3 rounded-full ${
                      isFreelancer ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Gamified Stats/Tips (Optional Flavor) - Positioned absolute to viewport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-12 left-0 right-0 z-20 text-center px-4"
          >
            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">
              {isFreelancer ? 'Game Tip' : 'Captain\'s Note'}
            </p>
            <p className="text-white/60 text-sm italic max-w-md mx-auto">
              {isFreelancer 
                ? '"Showcase your stats to get picked by top teams."' 
                : '"Scout the best talent for your next big match."'
              }
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
