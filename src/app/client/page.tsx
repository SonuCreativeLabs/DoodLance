"use client"

import { Search, MapPin, Star, Clock, Calendar, User, Briefcase, GraduationCap, ChevronRight, Bell, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ClientLayout from '@/components/layouts/client-layout'
import { FreelancerCard } from '@/components/client/freelancer-card'
import { ServiceCategory } from '@/components/client/service-category'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { professionals } from './nearby/mockData'
import Image from 'next/image'
import ServiceCard from '@/components/client/services/service-card'
import { popularServices } from '@/data/services'

const AnimatedCard = ({ icon, delay }: { icon: React.ReactNode; delay: number }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      duration: 0.5,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 2
    }}
    className="bg-white rounded-xl p-4 shadow-lg"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
        {icon}
      </div>
      <div className="space-y-2">
        <div className="h-2 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
      </div>
    </div>
  </motion.div>
)

import { useState } from "react";

const mockNotifications = [
  { id: 1, message: "Your booking with Priya Lakshmi is confirmed.", time: "2 min ago" },
  { id: 2, message: "Rajesh Kumar has sent you a new message.", time: "15 min ago" },
  { id: 3, message: "Your payment for Home Cleaning is complete.", time: "1 hour ago" },
  { id: 4, message: "Reminder: AC Repair appointment tomorrow at 10:00 AM.", time: "3 hours ago" },
];

export default function ClientHome() {
  const [showNotifications, setShowNotifications] = useState(false);
  const handleHire = (id: number) => {
    // TODO: Implement hire functionality
    console.log('Hiring freelancer:', id)
  }

  const handleCategoryClick = (name: string) => {
    // TODO: Implement category filtering
    console.log('Selected category:', name)
  }

  return (
    <ClientLayout>
      {/* Hero Banner */}
      <div className="relative min-h-[600px] md:h-[500px] bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            {/* Curved Path */}
            <svg
              className="absolute bottom-0 w-full h-32"
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
                fill="#111111"
              />
            </svg>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pt-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 p-0.5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img
                    src="/images/profile-sonu.jpg"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover ring-2 ring-white/10 group-hover:ring-purple-400/50 transition-all duration-300"
                  />
                </button>
                <div className="absolute top-12 left-0 hidden group-hover:block">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg py-2 w-48 border border-white/20">
                    <div className="px-4 py-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer">
                      View Profile
                    </div>
                    <div className="px-4 py-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer">
                      Settings
                    </div>
                    <div className="border-t border-white/10 my-1"></div>
                    <div className="px-4 py-2 text-sm text-red-400 hover:bg-white/10 cursor-pointer">
                      Logout
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white">Welcome back, Sonu!</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Link href="/client/notifications" className="relative group" aria-label="Notifications">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                    <Bell className="w-5 h-5 text-white" />
                    {mockNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-medium text-white">{mockNotifications.length}</span>
                      </span>
                    )}
                  </span>
                </Link>
              </div>
              <div className="relative">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 backdrop-blur-md transition-colors">
                  <Wallet className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-medium text-purple-600">$0</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Find Local Services
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Connect with skilled professionals in your neighborhood
            </p>
          </div>

          {/* Modern Search Bar */}
          <div className="bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 backdrop-blur-md rounded-xl shadow-lg p-4 max-w-3xl mx-auto border border-purple-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 hover:from-purple-700 hover:via-purple-600 hover:to-purple-500 text-white py-3 h-[50px] text-base rounded-lg transition-all duration-300 font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-[#111111] mb-20 relative z-0">
        {/* Service Categories */}
        <section className="mb-12 relative z-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Popular Services in your area</h2>
            <Link href="/client/services" className="text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4">
                {popularServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    image={service.image}
                    icon={service.icon}
                    providerCount={service.providerCount}
                    discount={service.discount}
                    className="w-[180px] flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Add scrollbar-hide utility to tailwind config */}
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Top Rated Experts Section */}
        <section className="mb-12 relative z-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text">Top Rated</span>
              {" "}Experts
            </h2>
            <Link href="/client/nearby" className="text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide max-w-[353px] sm:max-w-none mx-auto">
              <div className="flex gap-[1px] pb-4">
                {professionals
                  .sort((a, b) => {
                    // First sort by rating
                    if (b.rating !== a.rating) {
                      return b.rating - a.rating;
                    }
                    // If ratings are equal, sort by number of reviews
                    return b.reviews - a.reviews;
                  })
                  .slice(0, 5) // Only take top 5
                  .map((expert) => (
                  <motion.div
                    key={expert.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-[160px]"
                  >
                    <div className="relative group">
                      {/* Rating Badge */}
                      <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-400 to-yellow-600 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-2.5 h-2.5 text-black fill-current" />
                        <span className="text-black text-[10px] font-bold">{expert.rating}</span>
                      </div>
                      
                      {/* Profile Picture with Gradient Shadow */}
                      <div className="relative w-[100px] h-[100px] mx-auto">
                        {/* Main Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-[10px]"></div>
                        {/* Bottom Shadow */}
                        <div className="absolute -bottom-1 -inset-x-1 h-4 bg-gradient-to-b from-purple-500/20 to-transparent blur-sm"></div>
                        <img
                          src={expert.image}
                          alt={expert.name}
                          className="w-full h-full rounded-full border-2 border-purple-200/50 relative z-10 object-cover"
                        />
                      </div>
                      
                      {/* Expert Info with Instagram-style Spacing */}
                      <div className="mt-3 text-center">
                        <h3 className="font-semibold text-white text-sm leading-tight truncate">{expert.name}</h3>
                        <p className="text-purple-400 text-xs font-medium truncate mt-0.5">{expert.service}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5">
                          <p className="text-white/70 text-[10px]">{expert.reviews} reviews</p>
                          <span className="text-white/30">•</span>
                          <p className="text-white/70 text-[10px]">{expert.completedJobs} jobs</p>
                        </div>
                        <p className="text-white/50 text-[10px] font-medium mt-1">{expert.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coupon Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 mb-12 relative z-0"
        >
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {/* First Coupon */}
              <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                      Limited Time
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">20% Off First Booking</h3>
                    <p className="text-white/90 text-sm mb-2">
                      Use code: <span className="font-mono bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs">WELCOME20</span>
                    </p>
                    <button className="bg-white text-purple-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                  <div className="relative ml-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      20%
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Coupon */}
              <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                      Weekend Special
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">15% Off Weekend</h3>
                    <p className="text-white/90 text-sm mb-2">
                      Use code: <span className="font-mono bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs">WEEKEND15</span>
                    </p>
                    <button className="bg-white text-blue-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                  <div className="relative ml-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      15%
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Coupon */}
              <div className="flex-shrink-0 w-[300px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-xs px-2 py-0.5 rounded-full mb-2">
                      Bulk Booking
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">25% Off 3+ Services</h3>
                    <p className="text-white/90 text-sm mb-2">
                      Use code: <span className="font-mono bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs">BULK25</span>
                    </p>
                    <button className="bg-white text-emerald-600 hover:bg-white/90 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                      Book Now
                    </button>
                  </div>
                  <div className="relative ml-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      25%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </ClientLayout>
  )
} 