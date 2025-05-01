"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, Calendar, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Search, X, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import ClientLayout from "@/components/layouts/client-layout"
import { bookings, applications, historyJobs, Booking, Application, HistoryJob } from "@/lib/mock/bookings"

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

const BookingCard = ({ booking, showActions = true }: BookingCardProps) => {
  return (
    <div
      className="group bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
          <img
            src={booking.image}
            alt={booking.provider}
            className="w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-purple-500/50 relative z-10 transition-all"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{booking.service}</h3>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {booking.price}
            </span>
          </div>
          <p className="text-sm text-white/60">{booking.provider}</p>
          <div className="flex flex-col gap-2 mt-2 text-sm text-white/50">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              {booking.date} at {booking.time}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-400" />
              {booking.location}
            </div>
          </div>
          {showActions && (
            <div className="mt-4 flex gap-3">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
              >
                Reschedule
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-purple-500/20 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ application }: { application: Application }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="group bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
          <img
            src={application.freelancer.image}
            alt={application.freelancer.name}
            className="w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-purple-500/50 relative z-10 transition-all"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{application.jobTitle}</h3>
          <p className="text-sm text-white/60">{application.freelancer.name}</p>
          <div className="flex items-center text-sm text-white/60 mt-1">
            <Star className="w-4 h-4 text-purple-400 fill-current" />
            <span className="ml-1">{application.freelancer.rating}</span>
            <span className="mx-2">•</span>
            <span>{application.freelancer.completedJobs} jobs completed</span>
          </div>
          <div className="flex items-center text-sm text-white/50 mt-1">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            <span>{application.freelancer.location}</span>
          </div>
          <div className="flex items-center text-sm text-white/50 mt-1">
            <Clock className="w-4 h-4 mr-2 text-purple-400" />
            <span>{application.freelancer.responseTime}</span>
          </div>
          <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/70">{application.proposal}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{application.price}</span>
            <span className="text-sm text-white/60">{application.availability}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-purple-500/20 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function BookingsPage() {
  const [currentApplicationIndex, setCurrentApplicationIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [applicationFilter, setApplicationFilter] = useState('new')
  const [historyFilter, setHistoryFilter] = useState('all')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction} on application ${applications[currentApplicationIndex].id}`)
    setCurrentApplicationIndex((prev) => Math.min(prev + 1, applications.length - 1))
  }

  const filteredBookings = bookings.filter(booking => {
    const bookingMatchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedFilter === 'all') return bookingMatchesSearch
    if (selectedFilter === 'ongoing') {
      const today = new Date()
      const bookingDate = new Date(booking.date)
      return bookingMatchesSearch && 
        bookingDate.toDateString() === today.toDateString() &&
        booking.status === 'confirmed'
    }
    if (selectedFilter === 'upcoming') {
      const today = new Date()
      const bookingDate = new Date(booking.date)
      return bookingMatchesSearch && 
        bookingDate > today &&
        (booking.status === 'confirmed' || booking.status === 'pending')
    }
    return bookingMatchesSearch
  })

  const filteredApplications = applications.filter(application => {
    const applicationMatchesSearch = application.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         application.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    if (!applicationFilter) return applicationMatchesSearch
    return applicationMatchesSearch && application.status === applicationFilter
  })

  const filteredHistory = historyJobs.filter(job => {
    const historyMatchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (historyFilter === 'all') return historyMatchesSearch
    return historyMatchesSearch && job.status.toLowerCase() === historyFilter.toLowerCase()
  })

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#111111] flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between relative">
              <div className={cn(
                "transition-all duration-200",
                isSearchOpen ? "opacity-0" : "opacity-100"
              )}>
                <h1 className="text-3xl font-bold text-white tracking-tight">My Bookings</h1>
              </div>
              <div className="flex items-center gap-4">
                {!isSearchOpen && (
                  <Search 
                    className="w-5 h-5 text-white/70 cursor-pointer hover:text-white/90 transition-colors"
                    onClick={toggleSearch}
                  />
                )}
              </div>
              
              {/* Animated Search Input */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                        autoFocus
                      />
                      <X 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 cursor-pointer hover:text-white/90 transition-colors" 
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="active" className="h-full flex flex-col" onValueChange={setActiveTab}>
            {/* Fixed Tabs Header */}
            <div className="fixed top-[84px] left-0 right-0 z-40 bg-[#111111]">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-md p-1 rounded-lg border border-white/10">
                  <TabsTrigger 
                    value="active" 
                    className={cn(
                      "text-white/70 data-[state=active]:text-purple-400 data-[state=active]:bg-white/10",
                      "rounded-md transition-all"
                    )}
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="applications"
                    className={cn(
                      "text-white/70 data-[state=active]:text-purple-400 data-[state=active]:bg-white/10",
                      "rounded-md transition-all"
                    )}
                  >
                    Applications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className={cn(
                      "text-white/70 data-[state=active]:text-purple-400 data-[state=active]:bg-white/10",
                      "rounded-md transition-all"
                    )}
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-[144px] pb-6">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsContent value="active">
                  {/* Active Tab Filters */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'ongoing', 'upcoming'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                          selectedFilter === filter
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {filteredBookings.filter(booking => 
                      booking.status === 'confirmed' || booking.status === 'pending'
                    ).length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90 mb-2">No current bookings</h3>
                        <p className="text-white/60 text-sm">
                          You don't have any ongoing or upcoming bookings
                        </p>
                      </div>
                    ) : (
                      filteredBookings
                        .filter(booking => booking.status === 'confirmed' || booking.status === 'pending')
                        .map((booking) => (
                          <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            showActions={true}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="applications">
                  {/* Applications Tab Filters */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['new', 'accepted', 'rejected'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setApplicationFilter(filter)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                          applicationFilter === filter
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {filteredApplications.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90 mb-2">No applications yet</h3>
                        <p className="text-white/60 text-sm">
                          You haven't received any job applications
                        </p>
                      </div>
                    ) : (
                      filteredApplications.map((application) => (
                        <ApplicationCard 
                          key={application.id} 
                          application={application}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  {/* History Tab Filters */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'completed', 'cancelled'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setHistoryFilter(filter)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                          historyFilter === filter
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {filteredHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Clock className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90 mb-2">No booking history</h3>
                        <p className="text-white/60 text-sm">
                          You haven't completed any bookings yet
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((job) => (
                        <div
                          key={job.id}
                          className="group bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
                              <img
                                src={job.freelancer.image}
                                alt={job.freelancer.name}
                                className="w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-purple-500/50 relative z-10 transition-all"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                <div className="flex items-center">
                                  {[...Array(job.yourRating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-purple-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-white/60">{job.freelancer.name}</p>
                              <div className="flex items-center text-sm text-white/50 mt-2">
                                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                                Completed on {job.completedDate}
                              </div>
                              <div className="mt-4 flex gap-3">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 border-purple-500/20 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                                >
                                  View Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
                                >
                                  Book Again
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  )
} 