"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/authentication-context"
import { Search, MapPin, Star, Clock, Calendar, User, Briefcase, GraduationCap } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import ProtectedRoute from '@/components/auth/protected-route'
import { cn } from "@/lib/utils"

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

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, role } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on user type
      router.push(role === 'client' ? '/client' : '/freelancer')
    } else {
      // Redirect to auth page if not logged in
      router.push('/auth')
    }
  }, [isAuthenticated, role, router])

  return (
    <MainLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF8A3D]"></div>
      </div>
    </MainLayout>
  )
}
