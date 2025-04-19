"use client"

import { Mouse } from "lucide-react"
import { motion } from "framer-motion"

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-navy-900 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeOut"
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Mouse className="w-16 h-16 text-amber-500" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-2xl font-bold text-white"
        >
          SkilledMice
        </motion.h1>
      </motion.div>
    </div>
  )
} 