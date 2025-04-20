"use client"

import { Search, MapPin, Star, Clock, Calendar, User, Briefcase, GraduationCap, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import ClientLayout from '@/components/layouts/client-layout'
import { FreelancerCard } from '@/components/client/freelancer-card'
import { ServiceCategory } from '@/components/client/service-category'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    name: 'John Smith',
    service: 'Plumbing',
    rating: 4.8,
    reviews: 127,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    location: '2.5 km away',
    responseTime: 'Usually responds in 1 hour',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    service: 'Math Tutoring',
    rating: 4.9,
    reviews: 89,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    location: '1.8 km away',
    responseTime: 'Usually responds in 30 mins',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    service: 'Pet Care',
    rating: 4.7,
    reviews: 56,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    location: '3.2 km away',
    responseTime: 'Usually responds in 2 hours',
  },
  {
    id: 4,
    name: 'Emma Davis',
    service: 'Cleaning',
    rating: 4.9,
    reviews: 203,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    location: '1.5 km away',
    responseTime: 'Usually responds in 45 mins',
  },
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
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome back, John!</h1>
              <div className="flex items-center text-gray-600 mt-0.5">
                <MapPin className="w-4 h-4 mr-1" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            <button className="flex items-center text-[#FF8A3D] hover:text-[#ff7a24] transition-colors">
              <span className="text-sm font-medium">View Profile</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Banner with Animation */}
      <div className="relative min-h-[600px] md:h-[500px] bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
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
                fill="#F5F5F5"
              />
            </svg>
          </motion.div>

          {/* Animated Service Cards */}
          <div className="hidden md:block">
            <div className="absolute right-10 top-20 space-y-4">
              <AnimatedCard icon={<Briefcase className="w-6 h-6" />} delay={0} />
              <AnimatedCard icon={<GraduationCap className="w-6 h-6" />} delay={0.3} />
            </div>
            <div className="absolute left-10 top-40 space-y-4">
              <AnimatedCard icon={<MapPin className="w-6 h-6" />} delay={0.6} />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pt-12 md:pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Find Local Services
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Connect with skilled professionals in your neighborhood
            </p>
          </motion.div>

          {/* Modern Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-4 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <button className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24] text-white py-3 h-[50px] text-base rounded-lg transition-colors">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Service Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Popular Services</h2>
            <button className="text-[#FF8A3D] hover:text-[#ff7a24] text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {serviceCategories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-white rounded-xl p-4 text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Providers */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Nearby Professionals</h2>
            <button className="text-[#FF8A3D] hover:text-[#ff7a24] text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyFreelancers.map((freelancer) => (
              <motion.div
                key={freelancer.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full border-2 border-[#FF8A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{freelancer.name}</h3>
                      <div className="flex items-center text-[#FF8A3D]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{freelancer.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{freelancer.service}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {freelancer.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {freelancer.responseTime}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => handleHire(freelancer.id)}
                        className="flex-1 bg-[#FF8A3D] hover:bg-[#ff7a24] text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Book Now
                      </button>
                      <button className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ad Banner Placeholder */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 mb-12"
        >
          <div className="bg-gradient-to-r from-[#FF8A3D] to-[#FF6B6B] rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-white">
                <div className="inline-block bg-white/20 text-white/90 text-sm px-3 py-1 rounded-full mb-4">
                  Limited Time Offer
                </div>
                <h3 className="text-2xl font-bold mb-2">Get 20% Off Your First Booking!</h3>
                <p className="text-white/90 mb-4">
                  Book any service before March 31st and enjoy 20% off. Use code: <span className="font-mono bg-white/20 px-2 py-1 rounded">WELCOME20</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-white text-[#FF8A3D] hover:bg-white/90 px-6 py-2 rounded-lg font-medium transition-colors">
                    Book Now
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-lg font-medium transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-[#FF8A3D] rounded-full w-8 h-8 flex items-center justify-center font-bold">
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