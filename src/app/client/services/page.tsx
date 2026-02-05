"use client"

// import { motion } from 'framer-motion' // Unused
import { useState, useRef, useEffect } from 'react'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, ArrowLeft, Clock, Video, Dumbbell, Cpu, Package, Camera, Clapperboard, Brain, Briefcase, Sparkles, GraduationCap, HeartHandshake, Grid, Circle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientServices } from '@/contexts/ClientServicesContext'
import { CricketWickets } from '@/components/icons/CricketWickets'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('for-you')
  const sidebarRef = useRef<HTMLDivElement>(null)
  const selectedButtonRef = useRef<HTMLButtonElement>(null)
  const { services, categories } = useClientServices()

  // Add 'For You' to categories if not present (it's a frontend pseudo-category)
  const displayCategories = [
    { id: 'for-you', name: 'For You', icon: <Sparkles className="w-6 h-6" />, slug: 'for-you' },
    ...categories.map(cat => {
      let iconNode;
      switch (cat.id) {
        case 'playing': iconNode = <CricketWickets className="w-6 h-6" />; break; // Custom Cricket Wickets
        case 'coaching': iconNode = <GraduationCap className="w-6 h-6" />; break;
        case 'support': iconNode = <HeartHandshake className="w-6 h-6" />; break;
        case 'media': iconNode = <Camera className="w-6 h-6" />; break;
        default: iconNode = <Grid className="w-6 h-6" />;
      }
      return {
        id: cat.slug,
        name: cat.name,
        icon: iconNode,
        slug: cat.slug
      }
    })
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
            <div className="flex items-center justify-between">
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
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
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
                  <div className="flex-1 px-2 space-y-1 pb-6">
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
                            className={`text-[9px] transition-colors ${selectedCategory === category.id
                              ? 'text-white font-bold'
                              : 'text-white/40 font-medium group-hover:text-white/60'
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

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto h-full">
                <div className="max-w-[1400px] mx-auto px-4">
                  <div className="py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-24">
                      {services
                        // TODO: Replace this heuristic with a real user-behavior-based ranking.
                        // Example future signal sources: recently viewed, clicks, bookings, category affinity.
                        .filter(service => selectedCategory === 'for-you' ? !!service.mostBooked : service.category === selectedCategory)
                        .map((service) => (
                          <Link
                            href={`/client/nearby?view=list&category=${service.category}&search=${encodeURIComponent(service.name)}`}
                            key={service.id}
                            className="block group"
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
                                        {service.name}
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
                        ))}
                    </div>
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