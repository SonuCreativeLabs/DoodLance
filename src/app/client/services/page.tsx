"use client"

// import { motion } from 'framer-motion' // Unused
import ClientLayout from '@/components/layouts/client-layout'
import { Search, ArrowLeft, Clock, Video, Dumbbell, Cpu, Package, Camera, Clapperboard, Brain, Briefcase, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Sidebar categories using Lucide icons
const sidebarCategories = [
  { id: 'for-you', name: ['For', 'You'], icon: <Sparkles className="w-6 h-6" /> },
  { id: 'playing', name: ['Playing', 'Services'], icon: <Video className="w-6 h-6" /> },
  { id: 'coaching', name: ['Coaching &', 'Training'], icon: <Dumbbell className="w-6 h-6" /> },
  { id: 'support', name: ['Support', 'Staff'], icon: <Brain className="w-6 h-6" /> },
  { id: 'media', name: ['Media &', 'Content'], icon: <Camera className="w-6 h-6" /> },
  { id: 'ground', name: ['Ground', 'Services'], icon: <Package className="w-6 h-6" /> },
]

// Service items (comprehensive, grouped by category)
const serviceItems = [
  // Cricket Playing Services
  { id: 'bowler', name: 'Bowler', category: 'playing', providerCount: 45, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏏' },
  { id: 'batsman', name: 'Batsman', category: 'playing', providerCount: 38, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏏' },
  { id: 'sidearm-specialist', name: 'Sidearm Specialist', category: 'playing', providerCount: 22, image: '/images/Bowler & batsman.png', fallbackEmoji: '🎯' },

  // Cricket Coaching & Training
  { id: 'coach', name: 'Coach', category: 'coaching', providerCount: 35, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '👨‍🏫' },
  { id: 'sports-conditioning-trainer', name: 'Sports Conditioning Trainer', category: 'coaching', providerCount: 28, image: '/images/Bowler & batsman.png', fallbackEmoji: '💪' },
  { id: 'fitness-trainer', name: 'Fitness Trainer', category: 'coaching', providerCount: 32, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏃‍♂️' },

  // Cricket Support Services
  { id: 'analyst', name: 'Analyst', category: 'support', providerCount: 18, image: '/images/Bowler & batsman.png', fallbackEmoji: '📊' },
  { id: 'physio', name: 'Physio', category: 'support', providerCount: 25, image: '/images/Bowler & batsman.png', fallbackEmoji: '🏥' },
  { id: 'scorer', name: 'Scorer', category: 'support', providerCount: 15, image: '/images/Bowler & batsman.png', fallbackEmoji: '📝' },
  { id: 'umpire', name: 'Umpire', category: 'support', providerCount: 20, image: '/images/Bowler & batsman.png', fallbackEmoji: '⚖️' },

  // Cricket Media & Content
  { id: 'cricket-photo-videography', name: 'Cricket Photo / Videography', category: 'media', providerCount: 30, mostBooked: true, image: '/images/Bowler & batsman.png', fallbackEmoji: '📷' },
  { id: 'cricket-content-creator', name: 'Cricket Content Creator', category: 'media', providerCount: 24, image: '/images/Bowler & batsman.png', fallbackEmoji: '🎬' },
  { id: 'commentator', name: 'Commentator', category: 'media', providerCount: 16, image: '/images/Bowler & batsman.png', fallbackEmoji: '🎤' },

  // Cricket Ground Services
  { id: 'groundsman', name: 'Groundsman', category: 'ground', providerCount: 12, image: '/images/Bowler & batsman.png', fallbackEmoji: '🌱' },
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('for-you')
  const sidebarRef = useRef<HTMLDivElement>(null)
  const selectedButtonRef = useRef<HTMLButtonElement>(null)

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
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-white/[0.08] h-[60px]">
          <div className="max-w-[1400px] mx-auto px-4 h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <Link href="/client">
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                </Link>
                <h1 className="text-lg font-semibold text-white">Services</h1>
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
              <div ref={sidebarRef} className="w-[70px] bg-[#161616] flex-none h-[calc(100vh-60px)] overflow-y-auto scrollbar-none sticky top-[60px] border-r border-white/[0.08]">
                <div className="py-3 flex flex-col min-h-full">
                  <div className="flex-1 px-2 space-y-1 pb-6">
                    {sidebarCategories.map((category) => (
                      <button
                        key={category.id}
                        ref={selectedCategory === category.id ? selectedButtonRef : null}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-200 group relative ${
                          selectedCategory === category.id
                          ? 'after:absolute after:top-1/2 after:-translate-y-1/2 after:left-0 after:w-[2px] after:h-6 after:bg-purple-500 after:rounded-r-full'
                          : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200">
                          <div className={`${
                            selectedCategory === category.id
                            ? 'text-white scale-110'
                            : 'text-white/60 group-hover:text-white/80 group-hover:scale-105'
                          }`}>
                            {category.icon}
                          </div>
                        </div>
                        <div className="flex flex-col items-center leading-none">
                          {category.name.map((line, index) => (
                            <span
                              key={index}
                              className={`text-[9px] transition-colors ${
                                selectedCategory === category.id
                                ? 'text-white font-bold'
                                : 'text-white/40 font-medium group-hover:text-white/60'
                              }`}
                            >
                              {line}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto h-[calc(100vh-73px)]">
                <div className="max-w-[1400px] mx-auto px-4">
                  <div className="py-6">
                    <div className="grid grid-cols-2 gap-5 pb-24">
                      {serviceItems
                        // TODO: Replace this heuristic with a real user-behavior-based ranking.
                        // Example future signal sources: recently viewed, clicks, bookings, category affinity.
                        .filter(service => selectedCategory === 'for-you' ? !!service.mostBooked : service.category === selectedCategory)
                        .map((service) => (
                        <Link 
                          href={`/client/services/${service.id}`}
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
                                {service.category === 'ground' && <Package className="w-12 h-12" />}
                                {service.category !== 'playing' && service.category !== 'coaching' && service.category !== 'support' && service.category !== 'media' && service.category !== 'ground' && (
                                  <Video className="w-12 h-12" />
                                )}
                              </div>
                              
                              <img
                                src={service.image}
                                alt={service.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-[1]"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (target.src !== '/images/cover-placeholder.svg') {
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
                                    <div className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                      <span className="text-[11px] text-white/90 drop-shadow-sm">
                                        {service.providerCount} Providers
                                      </span>
                                    </div>
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