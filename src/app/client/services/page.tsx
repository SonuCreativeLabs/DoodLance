"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, ArrowLeft, Clock } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Sidebar categories
const sidebarCategories = [
  {
    id: 'all',
    name: ['All', ''],
    icon: '🏛️'
  },
  {
    id: 'home-repair',
    name: ['Home &', 'Repair'],
    icon: '🛠️'
  },
  {
    id: 'beauty',
    name: ['Beauty &', 'Spa'],
    icon: '💆‍♀️'
  },
  {
    id: 'education',
    name: ['Education', 'Services'],
    icon: '👨‍🏫'
  },
  {
    id: 'sports',
    name: ['Sports &', 'Fitness'],
    icon: '🏏'
  },
  {
    id: 'pet-care',
    name: ['Pet', 'Care'],
    icon: '🐕'
  },
  {
    id: 'cleaning',
    name: ['Home', 'Cleaning'],
    icon: '🧽'
  },
  {
    id: 'electrical',
    name: ['Electrical', 'Services'],
    icon: '👨‍🔧'
  },
  {
    id: 'plumbing',
    name: ['Plumbing', 'Services'],
    icon: '🚿'
  },
  {
    id: 'painting',
    name: ['Painting', 'Services'],
    icon: '🖌️'
  },
  {
    id: 'gardening',
    name: ['Garden', 'Services'],
    icon: '🌺'
  },
  {
    id: 'moving',
    name: ['Moving', 'Services'],
    icon: '🚛'
  },
  {
    id: 'tech-support',
    name: ['Tech', 'Support'],
    icon: '👨‍💻'
  }
]

// Service items
const serviceItems = [
  // Home & Repair Services
  {
    id: 'general-repair',
    name: 'General Home Repair',
    category: 'home-repair',
    providerCount: 62,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🔧'
  },
  {
    id: 'furniture-repair',
    name: 'Furniture Assembly & Repair',
    category: 'home-repair',
    providerCount: 45,
    discount: '15% Off',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🪑'
  },
  {
    id: 'home-maintenance',
    name: 'Home Maintenance',
    category: 'home-repair',
    providerCount: 38,
    discount: '10% Off',
    image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🏠'
  },
  {
    id: 'home-cleaning',
    name: 'Home Deep Cleaning',
    category: 'cleaning',
    providerCount: 48,
    discount: '15% Off',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🧹'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Service',
    category: 'plumbing',
    providerCount: 32,
    discount: '10% Off',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🚰'
  },
  {
    id: 'electrical',
    name: 'Electrical Work',
    category: 'electrical',
    providerCount: 56,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '⚡'
  },
  {
    id: 'painting-service',
    name: 'House Painting',
    category: 'painting',
    providerCount: 41,
    discount: '12% Off',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🖌️'
  },
  {
    id: 'garden-maintenance',
    name: 'Garden Maintenance',
    category: 'gardening',
    providerCount: 35,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🌺'
  },
  {
    id: 'moving-service',
    name: 'Home Moving Service',
    category: 'moving',
    providerCount: 29,
    discount: '18% Off',
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🚛'
  },
  // Beauty & Spa Services
  {
    id: 'spa-massage',
    name: 'Spa & Massage',
    category: 'beauty',
    providerCount: 42,
    discount: '20% Off',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '💆‍♀️'
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    category: 'beauty',
    providerCount: 38,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '💇‍♀️'
  },
  // Education Services
  {
    id: 'math-tutoring',
    name: 'Mathematics Tutoring',
    category: 'education',
    providerCount: 45,
    discount: '10% Off',
    image: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '📐'
  },
  {
    id: 'language-classes',
    name: 'Language Classes',
    category: 'education',
    providerCount: 36,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🗣️'
  },
  // Sports & Fitness
  {
    id: 'personal-training',
    name: 'Personal Training',
    category: 'sports',
    providerCount: 52,
    discount: '25% Off',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🏋️‍♂️'
  },
  {
    id: 'yoga-classes',
    name: 'Yoga Classes',
    category: 'sports',
    providerCount: 44,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🧘‍♀️'
  },
  // Pet Care
  {
    id: 'pet-grooming',
    name: 'Pet Grooming',
    category: 'pet-care',
    providerCount: 34,
    discount: '15% Off',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🐕'
  },
  {
    id: 'pet-training',
    name: 'Pet Training',
    category: 'pet-care',
    providerCount: 28,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🦮'
  },
  // Tech Support
  {
    id: 'computer-repair',
    name: 'Computer Repair',
    category: 'tech-support',
    providerCount: 39,
    discount: '20% Off',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '💻'
  },
  {
    id: 'network-setup',
    name: 'Network Setup',
    category: 'tech-support',
    providerCount: 31,
    mostBooked: true,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    fallbackEmoji: '🌐'
  }
]

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#111111] fixed inset-0 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#111111] border-b border-white/[0.08]">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
              <div className="w-20 bg-[#161616] flex-none h-[calc(100vh-73px)] overflow-y-auto scrollbar-none sticky top-[73px]">
                <div className="py-4 space-y-2 flex flex-col min-h-full">
                  <div className="flex-1">
                    {sidebarCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex flex-col items-center gap-1.5 py-2 relative group`}
                      >
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                          selectedCategory === category.id
                          ? 'bg-purple-500/10 ring-1 ring-purple-500/20'
                          : 'bg-[#111111] hover:bg-[#161616] hover:scale-105'
                        }`}>
                          <span className={`text-[36px] transition-transform group-hover:scale-110 ${
                            selectedCategory === category.id
                            ? 'text-purple-400'
                            : 'text-white/70'
                          }`}>{category.icon}</span>
                        </div>
                        <div className="flex flex-col items-center leading-tight">
                          {category.name.map((line, index) => (
                            <span
                              key={index}
                              className={`text-[10px] font-medium transition-colors ${
                                selectedCategory === category.id
                                ? 'text-purple-400'
                                : 'text-white/50 group-hover:text-white/70'
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
                    <div className="grid grid-cols-2 gap-6 pb-24">
                      {serviceItems
                        .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
                        .map((service) => (
                        <Link 
                          href={`/client/services/${service.id}`}
                          key={service.id}
                          className="block group"
                        >
                          <div className="bg-[#161616] rounded-2xl overflow-hidden">
                            {/* Image Container */}
                            <div className="aspect-[16/12] relative rounded-t-2xl overflow-hidden bg-[#111111]">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 z-10" />
                              {/* Fallback/Loading State */}
                              <div className="absolute inset-0 flex items-center justify-center z-0">
                                <span className="text-[84px]">{service.fallbackEmoji}</span>
                              </div>
                              <img
                                src={service.image}
                                alt={service.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out z-[1]"
                              />
                              {/* Badges */}
                              <div className="absolute top-2 inset-x-2 flex items-center justify-between z-20">
                                {service.discount && (
                                  <div className="bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                    {service.discount}
                                  </div>
                                )}
                                {service.mostBooked && (
                                  <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                    Most Booked
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-col gap-2.5">
                                <div className="h-[42px]">
                                  <h3 className="font-medium text-[13px] text-white leading-[1.4] group-hover:text-purple-400 transition-colors line-clamp-2">
                                    {service.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500/80"></div>
                                  <span className="text-[11px] text-white/60">
                                    {service.providerCount} Providers
                                  </span>
                                </div>
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