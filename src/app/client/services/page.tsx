"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, X, ArrowLeft } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'

// Category groups for filtering
const categoryGroups = [
  { name: 'All Services', icon: '🌟' },
  { name: 'Home Services', icon: '🏠' },
  { name: 'Education', icon: '📚' },
  { name: 'Health & Wellness', icon: '💪' },
  { name: 'Pet Care', icon: '🐾' },
  { name: 'Professional', icon: '💼' },
  { name: 'Tech', icon: '💻' },
  { name: 'Personal Care', icon: '💅' },
  { name: 'Events', icon: '🎉' }
]

// Comprehensive list of service categories
const serviceCategories = [
  // Home Services
  { name: 'Plumbing', icon: '🔧', group: 'Home Services' },
  { name: 'Electrical', icon: '⚡', group: 'Home Services' },
  { name: 'Cleaning', icon: '🧹', group: 'Home Services' },
  { name: 'Gardening', icon: '🌱', group: 'Home Services' },
  { name: 'Moving', icon: '🚚', group: 'Home Services' },
  { name: 'Painting', icon: '🎨', group: 'Home Services' },
  { name: 'Carpentry', icon: '🪚', group: 'Home Services' },
  { name: 'HVAC', icon: '❄️', group: 'Home Services' },

  // Education & Tutoring
  { name: 'Academic Tutoring', icon: '📚', group: 'Education' },
  { name: 'Music Lessons', icon: '🎵', group: 'Education' },
  { name: 'Language Learning', icon: '🗣️', group: 'Education' },
  { name: 'Computer Skills', icon: '💻', group: 'Education' },

  // Health & Wellness
  { name: 'Personal Training', icon: '💪', group: 'Health & Wellness' },
  { name: 'Yoga Instruction', icon: '🧘', group: 'Health & Wellness' },
  { name: 'Massage Therapy', icon: '💆', group: 'Health & Wellness' },
  { name: 'Nutrition Coaching', icon: '🥗', group: 'Health & Wellness' },

  // Pet Care
  { name: 'Pet Sitting', icon: '🐾', group: 'Pet Care' },
  { name: 'Dog Walking', icon: '🐕', group: 'Pet Care' },
  { name: 'Pet Grooming', icon: '✂️', group: 'Pet Care' },

  // Professional Services
  { name: 'Photography', icon: '📸', group: 'Professional' },
  { name: 'Videography', icon: '🎥', group: 'Professional' },
  { name: 'Graphic Design', icon: '🎨', group: 'Professional' },
  { name: 'Content Writing', icon: '✍️', group: 'Professional' },

  // Tech Services
  { name: 'Computer Repair', icon: '🔧', group: 'Tech' },
  { name: 'Smart Home Setup', icon: '🏠', group: 'Tech' },
  { name: 'Tech Support', icon: '🛠️', group: 'Tech' },

  // Personal Care
  { name: 'Hair Styling', icon: '💇', group: 'Personal Care' },
  { name: 'Makeup Artistry', icon: '💄', group: 'Personal Care' },
  { name: 'Nail Care', icon: '💅', group: 'Personal Care' },

  // Event Services
  { name: 'Event Planning', icon: '🎉', group: 'Events' },
  { name: 'Catering', icon: '🍽️', group: 'Events' },
  { name: 'DJ Services', icon: '🎧', group: 'Events' }
]

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Services')

  const filteredServices = useMemo(() => {
    return serviceCategories.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All Services' || service.group === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#111111] pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] p-6">
          <div className="flex items-center mb-6">
            <Link href="/client" className="mr-4">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Popular Services</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide">
            {categoryGroups.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((category, index) => (
              <Link href={`/client/services/${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-300/30 transition-all duration-200 cursor-pointer h-[180px] flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl flex items-center justify-center w-full h-full">{category.icon}</span>
                  </div>
                  <h3 className="font-medium text-white text-center">{category.name}</h3>
                  <div className="text-white/60 text-sm mt-2">50+ Providers</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Add scrollbar-hide utility to tailwind config and ensure dark background for html/body */}
        <style jsx global>{`
          html, body {
            background: #111111 !important;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </ClientLayout>
  )
} 