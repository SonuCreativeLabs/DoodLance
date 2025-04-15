"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Briefcase } from 'lucide-react'

interface ModeSwitchProps {
  onModeChange: (mode: 'client' | 'freelancer') => void
}

export default function ModeSwitch({ onModeChange }: ModeSwitchProps) {
  const [mode, setMode] = useState<'client' | 'freelancer'>('client')

  const handleModeChange = (newMode: 'client' | 'freelancer') => {
    setMode(newMode)
    onModeChange(newMode)
  }

  return (
    <div className="relative bg-gray-100 rounded-full p-1 w-48">
      <motion.div
        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-full shadow-sm"
        animate={{
          x: mode === 'client' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      <div className="relative flex">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            mode === 'client' ? 'text-primary' : 'text-gray-500'
          }`}
          onClick={() => handleModeChange('client')}
        >
          <User className="w-4 h-4" />
          Client
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
            mode === 'freelancer' ? 'text-primary' : 'text-gray-500'
          }`}
          onClick={() => handleModeChange('freelancer')}
        >
          <Briefcase className="w-4 h-4" />
          Freelancer
        </button>
      </div>
    </div>
  )
} 