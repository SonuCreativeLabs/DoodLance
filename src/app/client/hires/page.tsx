"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, Clock, MapPin, Calendar, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import ClientLayout from "@/components/layouts/client-layout"

// Mock data for current works
const currentWorks = [
  {
    id: 1,
    title: "Bathroom Plumbing Repair",
    freelancer: {
      name: "John Smith",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      rating: 4.8,
    },
    price: "$120",
    startDate: "Today, 3:00 PM",
    status: "In Progress",
    location: "123 Main St, San Francisco"
  },
  {
    id: 2,
    title: "Math Tutoring - Calculus",
    freelancer: {
      name: "Sarah Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 4.9,
    },
    price: "$45/hr",
    startDate: "Tomorrow, 2:00 PM",
    status: "Upcoming",
    location: "Online Session"
  },
]

// Mock data for applications
const applications = [
  {
    id: 1,
    jobTitle: "House Cleaning Service",
    freelancer: {
      name: "Emma Davis",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 4.7,
      completedJobs: 156,
      responseTime: "Usually responds in 30 mins",
      location: "2.5 km away",
    },
    proposal: "I have 5 years of experience in professional house cleaning. I use eco-friendly products and can handle deep cleaning tasks efficiently.",
    price: "$120",
    availability: "Available this weekend",
  },
  // Add more applications as needed
]

// Mock data for history
const historyJobs = [
  {
    id: 1,
    title: "Garden Maintenance",
    freelancer: {
      name: "Mike Wilson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      rating: 4.9,
    },
    completedDate: "2024-03-10",
    status: "Completed",
    yourRating: 5,
  },
  // Add more history items as needed
]

// Mock data for bookings
const bookings = [
  {
    id: 1,
    service: 'Plumbing',
    provider: 'John Smith',
    date: '2024-04-20',
    time: '10:00 AM',
    status: 'upcoming',
    location: '123 Main St, City',
    price: '$75',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: 2,
    service: 'Math Tutoring',
    provider: 'Sarah Johnson',
    date: '2024-04-18',
    time: '2:00 PM',
    status: 'completed',
    location: '456 Oak Ave, City',
    price: '$50',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
]

const ApplicationCard = ({ application }: { application: any }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 max-w-md mx-auto"
    >
      <div className="flex items-start gap-4">
        <img
          src={application.freelancer.image}
          alt={application.freelancer.name}
          className="w-16 h-16 rounded-full border-2 border-[#FF8A3D]"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{application.freelancer.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Star className="w-4 h-4 text-[#FF8A3D] fill-current" />
            <span className="ml-1">{application.freelancer.rating}</span>
            <span className="mx-2">•</span>
            <span>{application.freelancer.completedJobs} jobs completed</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{application.freelancer.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4 mr-1" />
            <span>{application.freelancer.responseTime}</span>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{application.proposal}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-semibold text-[#FF8A3D]">{application.price}</span>
            <span className="text-sm text-gray-600">{application.availability}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors">
          <ThumbsDown className="w-5 h-5" />
          Decline
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-200 transition-colors">
          <ThumbsUp className="w-5 h-5" />
          Accept
        </button>
      </div>
    </motion.div>
  )
}

export default function HiresPage() {
  const [currentApplicationIndex, setCurrentApplicationIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('bookings')

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction} on application ${applications[currentApplicationIndex].id}`)
    setCurrentApplicationIndex((prev) => Math.min(prev + 1, applications.length - 1))
  }

  return (
    <ClientLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Your Hires</h1>
        
        <Tabs defaultValue="bookings" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white shadow-lg backdrop-blur-md p-1 rounded-lg border border-purple-100/50">
            <TabsTrigger 
              value="bookings" 
              className={cn(
                "text-gray-600 data-[state=active]:text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-purple-100/80",
                "rounded-md transition-all"
              )}
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className={cn(
                "text-gray-600 data-[state=active]:text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-purple-100/80",
                "rounded-md transition-all"
              )}
            >
              Applications
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className={cn(
                "text-gray-600 data-[state=active]:text-purple-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-50 data-[state=active]:to-purple-100/80",
                "rounded-md transition-all"
              )}
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white shadow-lg hover:shadow-xl rounded-xl p-6 border border-purple-100/50 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 blur-md"></div>
                      <img
                        src={booking.image}
                        alt={booking.provider}
                        className="w-16 h-16 rounded-full border-2 border-purple-200 relative z-10"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                        <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                          {booking.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{booking.provider}</p>
                      <div className="flex flex-col gap-2 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {booking.date} at {booking.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {booking.location}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 py-2 px-4 rounded-lg transition-all duration-300 border border-purple-200 text-sm">
                          Reschedule
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white shadow-lg hover:shadow-xl rounded-xl p-6 border border-purple-100/50 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 blur-md"></div>
                      <img
                        src={application.freelancer.image}
                        alt={application.freelancer.name}
                        className="w-16 h-16 rounded-full border-2 border-purple-200 relative z-10"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{application.freelancer.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Star className="w-4 h-4 text-purple-500 fill-current" />
                        <span className="ml-1">{application.freelancer.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{application.freelancer.completedJobs} jobs completed</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{application.freelancer.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{application.freelancer.responseTime}</span>
                      </div>
                      <div className="mt-3 p-4 bg-gradient-to-r from-purple-50/50 to-purple-100/50 rounded-lg border border-purple-100">
                        <p className="text-sm text-gray-700">{application.proposal}</p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">{application.price}</span>
                        <span className="text-sm text-gray-600">{application.availability}</span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 py-2 rounded-lg transition-all duration-300 border border-purple-200">
                          <ThumbsDown className="w-5 h-5" />
                          Decline
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500">
                          <ThumbsUp className="w-5 h-5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {historyJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-lg hover:shadow-xl rounded-xl p-6 border border-purple-100/50 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 blur-md"></div>
                      <img
                        src={job.freelancer.image}
                        alt={job.freelancer.name}
                        className="w-16 h-16 rounded-full border-2 border-purple-200 relative z-10"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center">
                          {[...Array(job.yourRating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-purple-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{job.freelancer.name}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        Completed on {job.completedDate}
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 py-2 px-4 rounded-lg transition-all duration-300 border border-purple-200 text-sm">
                          View Details
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 text-sm">
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  )
} 