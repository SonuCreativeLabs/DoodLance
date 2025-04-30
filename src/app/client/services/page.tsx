"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, X, ArrowLeft } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Industry categories with their services count and description
const industries = [
  {
    id: 'home-repair',
    name: 'Home & Repair',
    servicesCount: 9,
    description: 'Home maintenance, repairs, and improvement services',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    servicesCount: 6,
    description: 'Personal care, beauty treatments, and wellness services',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'education-training',
    name: 'Education & Training',
    servicesCount: 6,
    description: 'Academic tutoring, skill development, and professional training',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'creative-digital',
    name: 'Creative & Digital',
    servicesCount: 6,
    description: 'Digital services, design, and creative solutions',
    image: 'https://images.unsplash.com/photo-1498075702571-ecb018f3752d?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'events-entertainment',
    name: 'Events & Entertainment',
    servicesCount: 6,
    description: 'Event planning, entertainment, and celebration services',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    servicesCount: 5,
    description: 'Pet care, training, and veterinary services',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'business-tech',
    name: 'Business & Tech',
    servicesCount: 6,
    description: 'Business solutions and technology services',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=800'
  },
  {
    id: 'fitness-sports',
    name: 'Fitness & Sports',
    servicesCount: 6,
    description: 'Fitness training, sports coaching, and wellness programs',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200&h=800'
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
          <div className="grid grid-cols-2 gap-2">
            {filteredIndustries.map((industry, index) => (
              <Link 
                href={`/client/services/${industry.id}`}
                key={industry.id}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-300 ${
                    // Increase height for Home & Repair card
                    index === 0 ? 'h-[280px]' : // Home & Repair (taller)
                    index === 3 ? 'h-[220px]' : // Other tall card
                    index === 1 || index === 4 ? 'h-[190px]' : // Medium cards
                    'h-[170px]' // Standard cards
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Enhanced overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:via-black/60 transition-all duration-300" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col justify-between z-10">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white tracking-tight drop-shadow-sm">{industry.name}</h3>
                      <p className={`text-sm text-white/90 mt-2 ${
                        index === 0 || index === 3 ? 'line-clamp-3' : 'line-clamp-2'
                      } drop-shadow-sm`}>{industry.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/90 drop-shadow-sm">{industry.servicesCount} Services</span>
                      <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
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