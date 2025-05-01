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
    id: 'home-repair-general',
    name: 'General Home Repair',
    category: 'home-repair',
    providerCount: 62,
    mostBooked: true,
    image: '/images/services/home-repair.jpg',
    fallbackEmoji: '🔧'
  },
  {
    id: 'furniture-repair',
    name: 'Furniture Assembly & Repair',
    category: 'home-repair',
    providerCount: 45,
    discount: '15% Off',
    image: '/images/services/furniture-repair.jpg',
    fallbackEmoji: '🪑'
  },
  {
    id: 'home-cleaning',
    name: 'Home Deep Cleaning',
    category: 'cleaning',
    providerCount: 48,
    discount: '15% Off',
    image: '/images/services/home-cleaning.jpg',
    fallbackEmoji: '🧹'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Service',
    category: 'plumbing',
    providerCount: 32,
    discount: '10% Off',
    image: '/images/services/plumbing.jpg',
    fallbackEmoji: '🚰'
  },
  {
    id: 'electrical',
    name: 'Electrical Work',
    category: 'electrical',
    providerCount: 56,
    mostBooked: true,
    image: '/images/services/electrical.jpg',
    fallbackEmoji: '⚡'
  },
  {
    id: 'painting-service',
    name: 'House Painting',
    category: 'painting',
    providerCount: 41,
    discount: '12% Off',
    image: '/images/services/painting.jpg',
    fallbackEmoji: '🖌️'
  },
  {
    id: 'garden-maintenance',
    name: 'Garden Maintenance',
    category: 'gardening',
    providerCount: 35,
    mostBooked: true,
    image: '/images/services/gardening.jpg',
    fallbackEmoji: '🌺'
  },
  {
    id: 'moving-service',
    name: 'Home Moving Service',
    category: 'moving',
    providerCount: 29,
    discount: '18% Off',
    image: '/images/services/moving.jpg',
    fallbackEmoji: '🚛'
  },
  // Beauty & Spa Services
  {
    id: 'spa-massage',
    name: 'Spa & Massage',
    category: 'beauty',
    providerCount: 42,
    discount: '20% Off',
    image: '/images/services/spa-massage.jpg',
    fallbackEmoji: '💆‍♀️'
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    category: 'beauty',
    providerCount: 38,
    mostBooked: true,
    image: '/images/services/hair-styling.jpg',
    fallbackEmoji: '💇‍♀️'
  },
  // Education Services
  {
    id: 'math-tutoring',
    name: 'Mathematics Tutoring',
    category: 'education',
    providerCount: 45,
    discount: '10% Off',
    image: '/images/services/math-tutoring.jpg',
    fallbackEmoji: '📐'
  },
  {
    id: 'language-classes',
    name: 'Language Classes',
    category: 'education',
    providerCount: 36,
    mostBooked: true,
    image: '/images/services/language-classes.jpg',
    fallbackEmoji: '🗣️'
  },
  // Sports & Fitness
  {
    id: 'personal-training',
    name: 'Personal Training',
    category: 'sports',
    providerCount: 52,
    discount: '25% Off',
    image: '/images/services/personal-training.jpg',
    fallbackEmoji: '🏋️‍♂️'
  },
  {
    id: 'yoga-classes',
    name: 'Yoga Classes',
    category: 'sports',
    providerCount: 44,
    mostBooked: true,
    image: '/images/services/yoga-classes.jpg',
    fallbackEmoji: '🧘‍♀️'
  },
  // Pet Care
  {
    id: 'pet-grooming',
    name: 'Pet Grooming',
    category: 'pet-care',
    providerCount: 34,
    discount: '15% Off',
    image: '/images/services/pet-grooming.jpg',
    fallbackEmoji: '🐕'
  },
  {
    id: 'pet-training',
    name: 'Pet Training',
    category: 'pet-care',
    providerCount: 28,
    mostBooked: true,
    image: '/images/services/pet-training.jpg',
    fallbackEmoji: '🦮'
  },
  // Tech Support
  {
    id: 'computer-repair',
    name: 'Computer Repair',
    category: 'tech-support',
    providerCount: 39,
    discount: '20% Off',
    image: '/images/services/computer-repair.jpg',
    fallbackEmoji: '💻'
  },
  {
    id: 'network-setup',
    name: 'Network Setup',
    category: 'tech-support',
    providerCount: 31,
    mostBooked: true,
    image: '/images/services/network-setup.jpg',
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
                            <div className="aspect-[16/10] relative rounded-t-2xl overflow-hidden bg-[#111111]">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 z-10" />
                              {/* Fallback/Loading State */}
                              <div className="absolute inset-0 flex items-center justify-center z-0">
                                <span className="text-[84px] animate-pulse">{service.fallbackEmoji}</span>
                              </div>
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out relative z-[1]"
                                loading="lazy"
                                onLoadingComplete={(img) => {
                                  img.classList.remove('opacity-0');
                                  img.classList.add('opacity-100');
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLElement;
                                  target.style.display = 'none';
                                }}
                              />
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