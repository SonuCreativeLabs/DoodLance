"use client"

import { Search, MapPin, Star, Clock, Calendar, User, Briefcase, GraduationCap, ChevronRight, Bell, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ClientLayout from '@/components/layouts/client-layout'
import { FreelancerCard } from '@/components/client/freelancer-card'
import { ServiceCategory } from '@/components/client/service-category'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Mock data for service categories
const serviceCategories = [
  { name: 'Plumbing', icon: '🔧', color: 'bg-white' },
  { name: 'Tutoring', icon: '📚', color: 'bg-white' },
  { name: 'Pet Care', icon: '🐾', color: 'bg-white' },
  { name: 'Cleaning', icon: '🧹', color: 'bg-white' },
  { name: 'Coaching', icon: '🎯', color: 'bg-white' },
  { name: 'Gardening', icon: '🌱', color: 'bg-white' },
  { name: 'Moving', icon: '🚚', color: 'bg-white' },
  { name: 'More', icon: '➕', color: 'bg-white' },
]

// Mock data for freelancers
const nearbyFreelancers = [
  {
    id: 1,
    name: "John Smith",
    service: "Plumbing Services",
    rating: 4.8,
    reviews: 156,
    completedJobs: 156,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "2.5 km away",
    responseTime: "Usually responds in 30 mins"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 203,
    completedJobs: 203,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "1.8 km away",
    responseTime: "Usually responds in 15 mins"
  },
  {
    id: 3,
    name: "Mike Wilson",
    service: "Electrical Work",
    rating: 4.7,
    reviews: 128,
    completedJobs: 128,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "3.2 km away",
    responseTime: "Usually responds in 45 mins"
  }
]

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

export default function ClientHome() {
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
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors p-0.5">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    alt="Profile"
                    className="w-full h-full rounded-full"
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
              <h2 className="text-2xl font-semibold text-white">Welcome back, John!</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white">3</span>
                  </span>
                </button>
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 max-w-3xl mx-auto border border-white/20">
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
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 h-[50px] text-base rounded-lg transition-colors font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-[#111111] mb-20">
        {/* Service Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Popular Services</h2>
            <Link href="/client/services" className="text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4 px-1">
                {serviceCategories.map((category) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-[180px]"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl rounded-xl p-4 border border-white/10 hover:border-purple-300/30 transition-all duration-200 h-full">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                          <span className="text-2xl text-white">{category.icon}</span>
                        </div>
                        <h3 className="text-white font-medium mb-2">{category.name}</h3>
                        <div className="text-white/60 text-sm">50+ Providers</div>
                        <div className="mt-3 w-full">
                          <button className="w-full bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 text-white text-sm py-2 rounded-lg transition-all duration-300 border border-white/10">
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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

        {/* Featured Providers */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Nearby Professionals</h2>
            <button className="text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4 px-1">
                {nearbyFreelancers.map((freelancer) => (
                  <motion.div
                    key={freelancer.id}
                    whileHover={{ y: -5 }}
                    className="flex-shrink-0 w-[300px] bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl rounded-2xl p-6 border border-white/10 hover:border-purple-300/30 transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-16 h-16 rounded-full border-2 border-purple-200/50 relative z-10"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{freelancer.name}</h3>
                          <div className="flex items-center text-sm text-white/60 mt-1">
                            <Star className="w-4 h-4 text-purple-500 fill-current" />
                            <span className="ml-1">{freelancer.rating}</span>
                            <span className="mx-2">•</span>
                            <span>{freelancer.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-white/60">
                          <Briefcase className="w-4 h-4 mr-2" />
                          <span>{freelancer.service}</span>
                        </div>
                        <div className="flex items-center text-sm text-white/60">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{freelancer.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-white/60">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{freelancer.responseTime}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => handleHire(freelancer.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500"
                        >
                          Book Now
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 text-white py-2 px-4 rounded-xl transition-all duration-300 border border-white/10">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ad Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-white">
                <div className="inline-block bg-white/20 backdrop-blur-sm text-white/90 text-sm px-3 py-1 rounded-full mb-4">
                  Limited Time Offer
                </div>
                <h3 className="text-2xl font-bold mb-2">Get 20% Off Your First Booking!</h3>
                <p className="text-white/90 mb-4">
                  Book any service before March 31st and enjoy 20% off. Use code: <span className="font-mono bg-white/20 backdrop-blur-sm px-2 py-1 rounded">WELCOME20</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-white text-purple-600 hover:bg-white/90 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg">
                    Book Now
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-lg font-medium transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-md"></div>
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                    20%
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