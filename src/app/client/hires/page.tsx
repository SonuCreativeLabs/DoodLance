"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, Clock, MapPin, Calendar, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Hires</h1>
      
      <Tabs defaultValue="bookings" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={booking.image}
                    alt={booking.provider}
                    className="w-16 h-16 rounded-full border-2 border-[#FF8A3D]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                      <span className="text-sm font-medium text-[#FF8A3D]">
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
                    <div className="mt-3 flex gap-2">
                      {booking.status === 'upcoming' && (
                        <>
                          <button className="flex-1 bg-[#FF8A3D] hover:bg-[#ff7a24] text-white py-2 px-4 rounded-lg transition-colors">
                            Reschedule
                          </button>
                          <button className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors">
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <button className="flex-1 bg-[#FF8A3D] hover:bg-[#ff7a24] text-white py-2 px-4 rounded-lg transition-colors">
                            Rate & Review
                          </button>
                          <button className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors">
                            Book Again
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="relative h-[600px]">
            <AnimatePresence mode="wait">
              <ApplicationCard key={currentApplicationIndex} application={applications[currentApplicationIndex]} />
            </AnimatePresence>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => handleSwipe("left")}
                className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              >
                <ThumbsDown className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleSwipe("right")}
                className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
              >
                <ThumbsUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {historyJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={job.freelancer.image}
                    alt={job.freelancer.name}
                    className="w-12 h-12 rounded-full border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <span className="truncate">{job.freelancer.name}</span>
                      <span className="mx-2">•</span>
                      <Star className="w-4 h-4 text-[#FF8A3D] fill-current" />
                      <span className="ml-1">{job.freelancer.rating}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>Completed on {job.completedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                        <div className="flex">
                          {Array.from({ length: job.yourRating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-[#FF8A3D] fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 