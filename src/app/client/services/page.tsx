"use client"

// import { motion } from 'framer-motion' // Unused
import { useState, useRef, useEffect } from 'react'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, ArrowLeft, Clock, Video, Dumbbell, Cpu, Package, Camera, Clapperboard, Brain, Briefcase, Sparkles, GraduationCap, HeartHandshake, Grid, Circle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientServices } from '@/contexts/ClientServicesContext'


export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Cricket')
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const sidebarRef = useRef<HTMLDivElement>(null)
  const selectedButtonRef = useRef<HTMLButtonElement>(null)
  const { services, categories } = useClientServices()

  // Add 'For You' and 'All Sports'
  const displayCategories = [
    { id: 'Cricket', name: 'Cricket', icon: <span className="text-2xl">🏏</span>, slug: 'Cricket' },
    { id: 'Football', name: 'Football', icon: <span className="text-2xl">⚽️</span>, slug: 'Football' },
    { id: 'Badminton', name: 'Badminton', icon: <span className="text-2xl">🏸</span>, slug: 'Badminton' },
    { id: 'Tennis', name: 'Tennis', icon: <span className="text-2xl">🎾</span>, slug: 'Tennis' },
    { id: 'Pickleball', name: 'Pickleball', icon: <span className="text-2xl">🏓</span>, slug: 'Pickleball' },
    { id: 'Basketball', name: 'Basketball', icon: <span className="text-2xl">🏀</span>, slug: 'Basketball' },
    { id: 'Padel', name: 'Padel', icon: <span className="text-2xl">🎾</span>, slug: 'Padel' },
    { id: 'Table Tennis', name: 'Table Tennis', icon: <span className="text-2xl">🏓</span>, slug: 'Table Tennis' },
    { id: 'Combat Sports', name: 'Combat Sports', icon: <span className="text-2xl">🥊</span>, slug: 'Combat Sports' },
    { id: 'Fitness', name: 'Fitness', icon: <span className="text-2xl">🏋️</span>, slug: 'Fitness' },
    { id: 'other', name: 'Others', icon: <Grid className="w-6 h-6" />, slug: 'other' },
  ];

  // Function to scroll selected category into view
  useEffect(() => {
    // Smoothly center the selected button within the sidebar ONLY,
    // without causing the main content to scroll.
    const el = selectedButtonRef.current
    const container = sidebarRef.current
    if (el && container) {
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const offset = (elRect.top - containerRect.top) - (container.clientHeight / 2 - el.clientHeight / 2)
      container.scrollBy({ top: offset, behavior: 'smooth' })
    }
  }, [selectedCategory])

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#111111] fixed inset-0 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between h-10">
              {showSearch ? (
                <div className="flex-1 flex items-center bg-white/5 rounded-full px-3 py-1 mr-2">
                  <Search className="w-4 h-4 text-white/50 mr-2" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery('')
                    }}
                    className="p-1 hover:bg-white/10 rounded-full text-white/50"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                      <ArrowLeft className="h-4 w-4" />
                    </div>
                  </Link>
                  <div className="ml-3">
                    <h1 className="text-lg font-semibold text-white">Services</h1>
                    <p className="text-white/50 text-xs">Find the perfect service for your needs</p>
                  </div>
                </div>
              )}

              {!showSearch && (
                <button
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex">
            {/* Split Layout */}
            <div className="flex max-w-[1400px] mx-auto flex-1">
              {/* Slim Sidebar */}
              <div ref={sidebarRef} className="w-[80px] bg-[#161616] flex-none h-full overflow-y-auto scrollbar-none sticky top-0 border-r border-white/[0.08]">
                <div className="py-3 flex flex-col min-h-full">
                  <div className="flex-1 px-2 space-y-1 pb-24">
                    {displayCategories.map((category) => (
                      <button
                        key={category.id}
                        ref={selectedCategory === category.id ? selectedButtonRef : null}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 group relative ${selectedCategory === category.id
                          ? 'after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 after:w-[2px] after:h-6 after:bg-purple-500 after:rounded-r-full'
                          : 'hover:bg-white/[0.02]'
                          }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200">
                          <div className={`${selectedCategory === category.id
                            ? 'text-white scale-110'
                            : 'text-white/60 group-hover:text-white/80 group-hover:scale-105'
                            }`}>
                            {category.icon}
                          </div>
                        </div>
                        <div className="flex flex-col items-center leading-none text-center">
                          <span
                            className={`text-[10px] font-medium transition-colors duration-200 ${selectedCategory === category.id
                              ? 'text-white'
                              : 'text-white/40 group-hover:text-white/60'
                              }`}
                          >
                            {category.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Content Area */}
              <div className="flex-1 bg-[#111111] h-full overflow-y-auto w-full">
                <div className="p-4 md:p-6 pb-24 max-w-7xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {services
                      // TODO: Replace this heuristic with a real user-behavior-based ranking.
                      // Example future signal sources: recently viewed, clicks, bookings, category affinity.
                      // Filter by Sport (assuming existing services are Cricket by default)
                      .filter(service => {
                        // Apply search filter if active
                        if (searchQuery) {
                          const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
                          if (!matchesSearch) return false;
                        }

                        if (selectedCategory === 'for-you') return !!service.mostBooked;

                        // For sports, check service.sport === selectedCategory
                        if (['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball', 'Padel', 'Pickleball', 'Table Tennis', 'Combat Sports', 'Fitness', 'Others'].includes(selectedCategory)) {
                          // @ts-ignore
                          return service.sport === selectedCategory;
                        }

                        if (selectedCategory === 'other') return service.category === 'other';
                      })
                      .map((service) => {
                        // Dynamically prepend sport name if not present and sport is known
                        const displayName = (service.sport && service.sport !== 'Others' && !service.name.toLowerCase().includes(service.sport.toLowerCase()))
                          ? `${service.sport} ${service.name}`
                          : service.name;

                        return (
                          <Link
                            key={service.id}
                            href={`/client/nearby?view=list&category=${encodeURIComponent(service.sport || 'All')}&search=${encodeURIComponent(service.name)}`}
                            className="group block"
                          >
                            <div className="relative bg-[#161616] rounded-2xl overflow-hidden">
                              {/* Full Image Container */}
                              <div className="aspect-[3/4] relative">
                                {/* Fallback/Loading State - Lucide icon, low opacity */}
                                <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#161616] text-white/30">
                                  {service.category === 'playing' && <Video className="w-12 h-12" />}
                                  {service.category === 'coaching' && <Dumbbell className="w-12 h-12" />}
                                  {service.category === 'support' && <Brain className="w-12 h-12" />}
                                  {service.category === 'media' && <Camera className="w-12 h-12" />}
                                  {service.category === 'other' && <Package className="w-12 h-12" />}
                                  {service.category !== 'playing' && service.category !== 'coaching' && service.category !== 'support' && service.category !== 'media' && service.category !== 'other' && (
                                    <Video className="w-12 h-12" />
                                  )}
                                </div>

                                <Image
                                  src={service.image}
                                  alt={service.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-[1]"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  onError={(e: any) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src.indexOf('cover-placeholder.svg') === -1) {
                                      target.srcset = '';
                                      target.src = '/images/cover-placeholder.svg';
                                    }
                                  }}
                                />

                                {/* Gradient Overlay - Balanced for text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[2]" />

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 z-[3]">
                                  {/* Title and Provider Count */}
                                  <div className="space-y-2">
                                    <div className="space-y-1.5">
                                      <h3 className="font-medium text-[14px] text-white leading-snug break-words drop-shadow-sm">
                                        {displayName}
                                      </h3>

                                    </div>
                                  </div>
                                </div>

                                {/* Badges - Even smaller size */}
                                <div className="absolute top-2 left-2 flex flex-wrap items-start gap-1 z-[3]">
                                  {service.mostBooked && (
                                    <div className="bg-[#8B5CF6] text-white text-[9px] font-medium px-2 py-0.5 rounded-full shadow-sm">
                                      Popular
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
} 