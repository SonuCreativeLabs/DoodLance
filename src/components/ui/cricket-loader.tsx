'use client'

import { motion } from 'framer-motion'

interface CricketLoaderProps {
  size?: number
  color?: 'red' | 'white'
  className?: string
}

export function CricketLoader({ size = 40, color = 'red', className = '' }: CricketLoaderProps) {
  const isRed = color === 'red'
  
  return (
    <motion.div
      className={`relative rounded-full overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      aria-label="Loading..."
    >
      {/* Ball Body */}
      <div 
        className={`absolute inset-0 w-full h-full rounded-full ${
          isRed 
            ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-800' 
            : 'bg-gradient-to-br from-white via-gray-100 to-gray-300'
        }`}
      />
      
      {/* Seam Container - Rotated slightly to look realistic */}
      <div className="absolute inset-0 flex items-center justify-center transform rotate-[25deg]">
        {/* Main Seam Band */}
        <div className={`h-full w-[18%] ${isRed ? 'bg-white/20' : 'bg-green-800/20'} border-x ${isRed ? 'border-white/90 border-dashed' : 'border-green-700/60 border-dashed'} flex items-center justify-center gap-[1px]`}>
             {/* Inner Stitching Details */}
             <div className={`h-full w-[0.5px] ${isRed ? 'bg-white/50' : 'bg-green-800/40'}`} />
             <div className={`h-full w-[0.5px] ${isRed ? 'bg-white/50' : 'bg-green-800/40'}`} />
        </div>
      </div>
      
      {/* Shine Effect */}
      <div className="absolute top-1 right-2 w-[30%] h-[30%] bg-white/20 rounded-full blur-[2px]" />
    </motion.div>
  )
}
