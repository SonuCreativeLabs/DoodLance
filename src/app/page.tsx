"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Activity, Trophy, Users, PlayCircle } from 'lucide-react'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-purple-500/30">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-32 bg-[#0a0a0a]"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
              <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(120,50,255,0.15),transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.03]" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 w-64 h-64 mb-0 overflow-hidden"
            >
               <Image
                src="/images/LOGOS/Doodlance Logo.svg"
                alt="DoodLance"
                fill
                className="object-cover scale-110"
                priority
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative z-20 flex flex-col items-center -mt-24"
            >
              <p 
                className="text-purple-400 text-sm md:text-base mt-4 font-medium"
              >
                {Array.from("Redefining Sports Freelancing").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      delay: 0.8 + index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
              <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(120,50,255,0.15),transparent_70%)]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.03]" />
            </div>

            {/* Navbar Placeholder */}
            <header className="relative z-10 px-6 py-6 flex flex-col items-center max-w-7xl mx-auto w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-64 h-64 relative overflow-hidden">
                   <Image
                    src="/images/LOGOS/Doodlance Logo.svg"
                    alt="DoodLance"
                    fill
                    className="object-cover scale-110"
                  />
                </div>
                
                {/* Badge right below logo */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-2"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-sm text-purple-300 font-medium">Premier Sports Freelancing Platform</span>
                  </div>
                </motion.div>
              </div>
            </header>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-2 lg:py-4 pt-0">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
                  Turn ur <span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">cricket passion</span><br />
                  into <span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">paycheck</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Hire or get hired as cricket players, coaches, and support staff.
                </p>

                {/* Action Button */}
                <div className="flex justify-center w-full">
                  <Link href="/auth/login" className="group">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#6B46C1]"
                    >
                      Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
} 