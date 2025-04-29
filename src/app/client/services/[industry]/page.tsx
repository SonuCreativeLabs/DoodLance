"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, X, ArrowLeft } from 'lucide-react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Add these interfaces before the servicesByIndustry constant
interface Service {
  name: string
  icon: string
  providers: number
}

interface Industry {
  name: string
  icon: string
  color: string
  services: Service[]
}

interface IndustryData {
  [key: string]: Industry
}

// Service categories data
const servicesByIndustry: IndustryData = {
  'home-repair': {
    name: 'Home & Repair',
    icon: '🏠',
    color: 'from-blue-500 to-blue-600',
    services: [
      { name: 'Plumbing', icon: '🔧', providers: 45 },
      { name: 'Electrical', icon: '⚡', providers: 38 },
      { name: 'House Cleaning', icon: '🧹', providers: 62 },
      { name: 'Gardening', icon: '🌱', providers: 29 },
      { name: 'Moving Service', icon: '🚚', providers: 33 },
      { name: 'Interior Painting', icon: '🎨', providers: 41 },
      { name: 'Carpentry', icon: '🪚', providers: 27 },
      { name: 'HVAC Service', icon: '❄️', providers: 35 },
      { name: 'Home Organization', icon: '📦', providers: 24 }
    ]
  },
  'beauty-wellness': {
    name: 'Beauty & Wellness',
    icon: '✨',
    color: 'from-pink-500 to-purple-500',
    services: [
      { name: 'Hair Styling', icon: '💇', providers: 58 },
      { name: 'Makeup Artist', icon: '💄', providers: 45 },
      { name: 'Nail Care', icon: '💅', providers: 52 },
      { name: 'Massage Therapy', icon: '💆', providers: 39 },
      { name: 'Spa Services', icon: '🌺', providers: 31 },
      { name: 'Skincare', icon: '✨', providers: 43 }
    ]
  },
  // Add other industries here...
}

export default function IndustryPage() {
  const params = useParams()
  const industryId = params.industry as string
  const industry = servicesByIndustry[industryId]
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = useMemo(() => {
    if (!industry) return []
    return industry.services.filter((service: Service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, industry])

  if (!industry) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-[#18181B] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Industry not found</h1>
            <Link href="/client/services" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Return to Services
            </Link>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#18181B]">
        {/* Header */}
        <div className={`bg-gradient-to-br ${industry.color} p-6`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/client/services" className="mr-4">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all duration-300 border border-white/10">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                  <span className="text-2xl">{industry.icon}</span>
                  {industry.name}
                </h1>
                <p className="text-white/60 mt-1 text-sm">Find the perfect service provider for your needs</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${industry.name} services...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/25 transition-all duration-300 text-sm backdrop-blur-xl"
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

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[100px]">
            {/* Featured Service Card */}
            {filteredServices.length > 0 && (
              <Link 
                href={`/client/services/${industryId}/${filteredServices[0].name.toLowerCase().replace(/\s+/g, '-')}`}
                className="md:col-span-8 md:row-span-3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] hover:from-[#2d2d2d] hover:to-[#1f1f1f] border border-white/[0.08] hover:border-white/20 transition-all duration-500 p-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full rounded-[1.8rem] p-8 flex flex-col justify-between bg-[#18181B]/40 backdrop-blur-sm">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-white/[0.08]">
                          <span className="text-4xl">{filteredServices[0].icon}</span>
                        </div>
                        <span className="text-white/40 text-xs font-medium bg-white/5 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-sm">
                          {filteredServices[0].providers} Providers
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-white mt-6 mb-3 tracking-tight">{filteredServices[0].name}</h3>
                    </div>
                    <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors duration-300">
                      View Providers
                      <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Tall Service Card */}
            {filteredServices.length > 1 && (
              <Link 
                href={`/client/services/${industryId}/${filteredServices[1].name.toLowerCase().replace(/\s+/g, '-')}`}
                className="md:col-span-4 md:row-span-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="group h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] hover:from-[#2d2d2d] hover:to-[#1f1f1f] border border-white/[0.08] hover:border-white/20 transition-all duration-500 p-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full rounded-[1.8rem] p-6 flex flex-col bg-[#18181B]/40 backdrop-blur-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-white/[0.08]">
                      <span className="text-3xl">{filteredServices[1].icon}</span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{filteredServices[1].name}</h3>
                      <div className="flex items-center text-pink-400 text-sm font-medium group-hover:text-pink-300 transition-colors duration-300">
                        View Providers
                        <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Regular Service Cards */}
            {filteredServices.slice(2).map((service: Service, index: number) => (
              <Link 
                href={`/client/services/${industryId}/${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={service.name}
                className={`md:col-span-4 ${index % 3 === 0 ? 'md:row-span-2' : 'md:row-span-1'}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index + 2) * 0.1 }}
                  className="group h-full relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2a2a2a] to-[#1c1c1c] hover:from-[#2d2d2d] hover:to-[#1f1f1f] border border-white/[0.08] hover:border-white/20 transition-all duration-500 p-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full rounded-[1.8rem] p-5 flex flex-col bg-[#18181B]/40 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-white/[0.08]">
                        <span className="text-2xl">{service.icon}</span>
                      </div>
                      <span className="text-white/40 text-xs font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-sm">
                        {service.providers} Providers
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-base font-semibold text-white mb-2 tracking-tight">{service.name}</h3>
                      <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors duration-300">
                        View Providers
                        <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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