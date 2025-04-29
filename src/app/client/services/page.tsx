"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, X, ArrowLeft } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'

// Industry categories with their services count and description
const industries = [
  {
    id: 'home-repair',
    name: 'Home & Repair',
    icon: '🏠',
    servicesCount: 9,
    description: 'Home maintenance, repairs, and improvement services',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: '✨',
    servicesCount: 6,
    description: 'Personal care, beauty treatments, and wellness services',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    icon: '📚',
    servicesCount: 6,
    description: 'Academic tutoring, skill development, and professional training',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'creative-digital',
    name: 'Creative & Digital',
    icon: '🎨',
    servicesCount: 6,
    description: 'Digital services, design, and creative solutions',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'events-entertainment',
    name: 'Events & Entertainment',
    icon: '🎉',
    servicesCount: 6,
    description: 'Event planning, entertainment, and celebration services',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    icon: '🐾',
    servicesCount: 5,
    description: 'Pet care, training, and veterinary services',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'business-tech',
    name: 'Business & Tech',
    icon: '💼',
    servicesCount: 6,
    description: 'Business solutions and technology services',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'fitness-sports',
    name: 'Fitness & Sports',
    icon: '💪',
    servicesCount: 6,
    description: 'Fitness training, sports coaching, and wellness programs',
    color: 'from-lime-500 to-green-500'
  }
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIndustries = useMemo(() => {
    return industries.filter(industry =>
      industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      industry.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#18181B]">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/client" className="mr-4">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all duration-300 border border-white/10">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </Link>
              <h1 className="text-2xl font-bold text-white tracking-tight">Browse by Industry</h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400/30 transition-all duration-300 text-sm backdrop-blur-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Industries List */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 auto-rows-[200px] gap-4">
            {filteredIndustries.map((industry, index) => (
              <Link 
                href={`/client/services/${industry.id}`}
                key={industry.id}
                className={`block ${
                  index === 0 ? 'col-span-1 row-span-2' : // Vertical rectangle
                  index === 3 ? 'col-span-2' : // Horizontal rectangle
                  'col-span-2' // Small horizontal rectangles
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group h-full relative overflow-hidden rounded-3xl border border-white/[0.08] transition-all duration-300 p-6 flex flex-col justify-between bg-gradient-to-br ${industry.color}`}
                >
                  <div className="space-y-2">
                    <span className="text-2xl">{industry.icon}</span>
                    <h3 className="text-xl font-semibold text-white tracking-tight">{industry.name}</h3>
                    <p className="text-sm text-white/70 mt-2 line-clamp-2">{industry.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{industry.servicesCount} Services</span>
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  )
} 