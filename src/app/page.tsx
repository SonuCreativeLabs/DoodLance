"use client"

import { Search, MapPin, Star, Clock, Calendar, User } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const serviceCategories = [
  { name: 'Plumbing', icon: '🔧', color: 'bg-white' },
  { name: 'Tutoring', icon: '📚', color: 'bg-white' },
  { name: 'Pet Care', icon: '🐾', color: 'bg-white' },
  { name: 'Cleaning', icon: '🧹', color: 'bg-white' },
  { name: 'Coaching', icon: '🎯', color: 'bg-white' },
  { name: 'More', icon: '➕', color: 'bg-white' },
]

const featuredProviders = [
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
  // Add more providers as needed
]

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Banner with Animation */}
      <div className="relative h-[500px] bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
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
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
                fill="#F5F5F5"
              />
            </svg>
          </motion.div>

          {/* Animated Service Icons */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute right-10 top-20 w-72 h-72"
          >
            <div className="relative w-full h-full">
              {/* Service Provider Animation */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute top-0 right-0 bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    🔧
                  </div>
                  <div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  x: [0, -5, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
                className="absolute bottom-0 left-0 bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    📚
                  </div>
                  <div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Local Services
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with skilled professionals in your neighborhood
            </p>
          </motion.div>

          {/* Modern Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-4 max-w-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <Button className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24] text-white py-3">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Service Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Popular Services</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {serviceCategories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-4 text-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Providers */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Top Rated Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-16 h-16 rounded-full border-2 border-[#FF8A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      <div className="flex items-center text-[#FF8A3D]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{provider.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{provider.service}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {provider.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {provider.responseTime}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button className="flex-1 bg-[#FF8A3D] hover:bg-[#ff7a24] text-white border-0">
                        Book Now
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
