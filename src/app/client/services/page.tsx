"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, ArrowLeft, Clock, Video, Dumbbell, Cpu, Package, Camera, Clapperboard, Brain, Briefcase, Grid } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Sidebar categories using Lucide icons
const sidebarCategories = [
  { id: 'all', name: ['All', ''], icon: <Grid className="w-6 h-6" /> },
  { id: 'content-creation', name: ['Content', 'Creation'], icon: <Clapperboard className="w-6 h-6" /> },
  { id: 'ai-services', name: ['AI', 'Services'], icon: <Brain className="w-6 h-6" /> },
  { id: 'professional-services', name: ['Professional', 'Services'], icon: <Briefcase className="w-6 h-6" /> },
  { id: 'sports-fitness', name: ['Sports &', 'Fitness'], icon: <Dumbbell className="w-6 h-6" /> },
  { id: 'hyperlocal', name: ['Hyperlocal', 'Gigs'], icon: <Package className="w-6 h-6" /> },
]

// Service items (comprehensive, grouped by category)
const serviceItems = [
  // Content Creation
  { id: 'influencer-content-creator', name: 'Influencer / Creator', category: 'content-creation', providerCount: 32, mostBooked: true, image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🌟' },
  { id: 'reels-shorts-video-editor', name: 'Reels Editor', category: 'content-creation', providerCount: 38, mostBooked: true, image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎬' },
  { id: 'podcast-editor', name: 'Podcast Editor', category: 'content-creation', providerCount: 29, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎧' },
  { id: 'documentary-series-videographer', name: 'Documentary Shoot', category: 'content-creation', providerCount: 16, image: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0d?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎥' },
  { id: 'product-photography-videography', name: 'Product Shoot', category: 'content-creation', providerCount: 35, discount: '10% Off', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '📷' },
  { id: 'sports-photography-videography', name: 'Sports Shoot', category: 'content-creation', providerCount: 22, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🏏' },
  { id: 'drone-services', name: 'Drone', category: 'content-creation', providerCount: 22, image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🚁' },
  { id: 'event-videography', name: 'Event Videography', category: 'content-creation', providerCount: 26, image: 'https://images.unsplash.com/photo-1556157382-5bc2f3a580d3?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎥' },
  { id: 'streaming-setup', name: 'Streaming Setup', category: 'content-creation', providerCount: 15, image: 'https://images.unsplash.com/photo-1601144807931-eb8bdb7abfaf?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '📡' },
  { id: 'creative-arts', name: 'Creative Arts', category: 'content-creation', providerCount: 18, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎨' },
  { id: 'vj-dj-live-performances', name: 'VJ / DJ / Live Events', category: 'content-creation', providerCount: 21, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎵' },
  { id: 'modeling', name: 'Modeling', category: 'content-creation', providerCount: 14, image: 'https://images.unsplash.com/photo-1503342394121-4804ba5f7f34?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '👗' },

  // Sports & Fitness
  { id: 'cricket-net-bowler-sidearmer', name: 'Cricket Net Bowler', category: 'sports-fitness', providerCount: 15, image: 'https://images.unsplash.com/photo-1592840806123-c9f3b17fe3d1?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🏏' },
  { id: 'throwdown-specialist', name: 'Throwdown Specialist', category: 'sports-fitness', providerCount: 12, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎯' },
  { id: 'personal-sports-videographer', name: 'Sports Videographer', category: 'sports-fitness', providerCount: 17, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎥' },
  { id: 'esports-coach', name: 'Esports Coach', category: 'sports-fitness', providerCount: 19, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🎮' },
  { id: 'fitness-trainer', name: 'Fitness Trainer', category: 'sports-fitness', providerCount: 23, image: 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🏋️' },

  // AI Services
  { id: 'ai-prompt-engineer', name: 'AI Prompt Engineer', category: 'ai-services', providerCount: 18, image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '✍️' },
  { id: 'nft-creator', name: 'NFT Creator', category: 'ai-services', providerCount: 10, image: 'https://images.unsplash.com/photo-1620321052592-2fe4cfba3c51?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🖼️' },
  { id: 'ar-vr-services', name: 'AR & VR', category: 'ai-services', providerCount: 15, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🕶️' },
  { id: 'ai-ad-campaign-creator', name: 'AI Ad Campaigns', category: 'ai-services', providerCount: 25, image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '📣' },
  { id: 'ai-avatar-creator', name: 'AI Avatars', category: 'ai-services', providerCount: 14, image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '👤' },
  { id: 'web3-services', name: 'Web3 Services', category: 'ai-services', providerCount: 15, image: 'https://images.unsplash.com/photo-1643101809365-9b4b76df3a1d?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🌐' },

  // Professional Services
  { id: 'legal-tax-consulting', name: 'Legal/Tax Consulting', category: 'professional-services', providerCount: 11, image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '⚖️' },
  { id: 'dev-seo-graphic-design', name: 'Dev / SEO / Design', category: 'professional-services', providerCount: 24, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🧩' },
  { id: 'digital-marketing', name: 'Digital Marketing', category: 'professional-services', providerCount: 21, image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '💡' },
  { id: 'personal-branding', name: 'Personal Branding', category: 'professional-services', providerCount: 13, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🧑‍💼' },
  { id: 'interior-design-wall-art', name: 'Interior & Wall Art', category: 'hyperlocal', providerCount: 17, image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🖌️' },

  // Hyperlocal Future Gigs
  { id: 'quick-cash-gigs', name: 'Quick Cash Gigs', category: 'hyperlocal', providerCount: 42, mostBooked: true, image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '💰' },
  { id: '3d-printing', name: '3D Print', category: 'hyperlocal', providerCount: 10, image: 'https://images.unsplash.com/photo-1581091870622-7c81f3d97c7b?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🧱' },
  { id: 'smart-home-setup-specialist', name: 'Smart Home Setup', category: 'hyperlocal', providerCount: 19, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '🏠' },
  { id: 'event-management-coordination', name: 'Event Management', category: 'hyperlocal', providerCount: 20, image: 'https://images.unsplash.com/photo-1556157382-9449ecf1f308?auto=format&fit=crop&w=800&q=80', fallbackEmoji: '📅' },
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
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
                        .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
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
                                {service.category === 'content-creation' && <Clapperboard className="w-12 h-12" />}
                                {service.category === 'ai-services' && <Brain className="w-12 h-12" />}
                                {service.category === 'professional-services' && <Briefcase className="w-12 h-12" />}
                                {service.category === 'sports-fitness' && <Dumbbell className="w-12 h-12" />}
                                {service.category === 'hyperlocal' && <Package className="w-12 h-12" />}
                                {service.category !== 'content-creation' && service.category !== 'ai-services' && service.category !== 'professional-services' && service.category !== 'sports-fitness' && service.category !== 'hyperlocal' && (
                                  <Camera className="w-12 h-12" />
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
                                {service.discount && (
                                  <div className="bg-purple-500/80 backdrop-blur-[2px] text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                                    {service.discount}
                                  </div>
                                )}
                                {service.mostBooked && (
                                  <div className="bg-amber-500/80 backdrop-blur-[2px] text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full">
                                    Most Booked
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