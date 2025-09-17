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
    <div className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${
              booking.status === 'ongoing' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {booking.status === 'ongoing' ? 'Ongoing' : booking.status === 'confirmed' ? 'Upcoming' : 'Completed'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/60">
            <span className="font-mono text-xs">{booking["#"]}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-medium text-white line-clamp-2 mb-1">{booking.service}</h3>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-3.5 h-3.5 text-purple-400">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{booking.provider}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 text-purple-400">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Date & Time</div>
              <div className="text-sm text-white/90">{booking.date} at {booking.time}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-4 h-4 text-purple-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Location</div>
              <div className="text-sm text-white/90">{booking.location}</div>
            </div>
          </div>
        </div>
        
        <div className="font-bold text-white">
          {booking.price}
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 transition-all duration-300 !rounded-lg"
            >
              Message
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 !rounded-lg"
            >
              Reschedule
            </Button>
          </div>
        )}
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
      className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {application.status === 'new' && (
              <div className="bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                New
              </div>
            )}
            {application.status === 'accepted' && (
              <div className="bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/20 w-fit">
                Accepted
              </div>
            )}
            {application.status === 'rejected' && (
              <div className="bg-red-500/10 text-red-400 text-xs font-medium px-3 py-1 rounded-full border border-red-500/20 w-fit">
                Rejected
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/60">
            <span className="font-mono text-xs">{application["#"]}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-medium text-white line-clamp-2 mb-1">{application.jobTitle}</h3>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-3.5 h-3.5 text-purple-400">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{application.freelancer.name}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-purple-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Rating</div>
              <div className="text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="w-3 h-3 text-yellow-400"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="text-white/80 font-medium">{application.freelancer.rating}</span>
                  <span className="text-white/50">•</span>
                  <span className="text-white/60">{application.freelancer.completedJobs} jobs</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-4 h-4 text-purple-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Location</div>
              <div className="text-sm text-white/90">{application.freelancer.location}</div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-xs text-white/40 mb-1">Proposal</div>
          <p className="text-sm text-white/70">{application.proposal}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-white/80">
            <div className="text-xs text-white/40 mb-0.5">Price</div>
            <div className="text-sm font-medium text-white">{application.price}</div>
          </div>
          <div className="text-white/80">
            <div className="text-xs text-white/40 mb-0.5">Availability</div>
            <div className="text-sm text-white">{application.availability}</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {application.status === 'new' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-white/20 text-white/70 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-100 transition-all duration-300 !rounded-lg"
              >
                Decline
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 !rounded-lg"
              >
                Accept
              </Button>
            </>
          )}
          
          {application.status === 'accepted' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 !rounded-lg"
              >
                Message
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-green-600 to-green-400 text-white border-0 hover:shadow-lg hover:from-green-700 hover:to-green-500 transition-all duration-300 !rounded-lg"
              >
                View Details
              </Button>
            </>
          )}
          
          {application.status === 'rejected' && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 !rounded-lg"
              >
                View Profile
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white border-0 hover:shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 !rounded-lg"
              >
                Reconsider
              </Button>
            </>
          )}
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
    console.log(`Swiped ${direction} on application ${applications[currentApplicationIndex]["#"]}`)
    setCurrentApplicationIndex((prev) => Math.min(prev + 1, applications.length - 1))
  }

  const filteredBookings = bookings.filter(booking => {
    const bookingMatchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchQuery.toLowerCase())
    
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    
    // Parse the time properly considering AM/PM
    const timeStr = booking.time
    const [time, period] = timeStr.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let bookingHours = hours
    if (period === 'PM' && hours !== 12) bookingHours += 12
    if (period === 'AM' && hours === 12) bookingHours = 0
    
    // Create booking date with proper time
    const [bookingYear, bookingMonth, bookingDay] = booking.date.split('-').map(Number)
    const bookingDate = new Date(bookingYear, bookingMonth - 1, bookingDay)
    const bookingDateTime = new Date(bookingYear, bookingMonth - 1, bookingDay, bookingHours, minutes)
    
    // For debugging
    console.log({
      service: booking.service,
      status: booking.status,
      filter: selectedFilter,
      bookingDate: bookingDate.toDateString(),
      today: today.toDateString(),
      isToday: bookingDate.toDateString() === today.toDateString(),
      isFuture: bookingDate > today
    })
    
    if (selectedFilter === 'all') {
      return bookingMatchesSearch && 
        (booking.status === 'confirmed' || booking.status === 'ongoing')
    }
    
    if (selectedFilter === 'ongoing') {
      const now = new Date()
      return bookingMatchesSearch && 
        bookingDate.toDateString() === today.toDateString() && // Same day
        (booking.status === 'confirmed' || booking.status === 'ongoing') &&
        bookingDateTime >= now // Not past the booking time
    }
    
    if (selectedFilter === 'upcoming') {
      return bookingMatchesSearch && 
        bookingDate > today && // Future date
        (booking.status === 'confirmed' || booking.status === 'ongoing')
    }
    
    return bookingMatchesSearch
  }).sort((a, b) => {
    // Parse dates for sorting
    const parseDateTime = (date: string, time: string) => {
      const [year, month, day] = date.split('-').map(Number)
      const [timeStr, period] = time.split(' ')
      const [hours, minutes] = timeStr.split(':').map(Number)
      let adjustedHours = hours
      if (period === 'PM' && hours !== 12) adjustedHours += 12
      if (period === 'AM' && hours === 12) adjustedHours = 0
      return new Date(year, month - 1, day, adjustedHours, minutes)
    }
    
    const dateA = parseDateTime(a.date, a.time)
    const dateB = parseDateTime(b.date, b.time)
    return dateA.getTime() - dateB.getTime()
  })

  const filteredApplications = applications.filter(application => {
    const applicationMatchesSearch = application.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         application.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!applicationFilter) return applicationMatchesSearch
    return applicationMatchesSearch && application.status === applicationFilter
  }).sort((a, b) => {
    // Sort by status priority: new -> accepted -> rejected
    const statusPriority = { 'new': 0, 'accepted': 1, 'rejected': 2 }
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status]
    }
    // If same status, sort by rating
    return b.freelancer.rating - a.freelancer.rating
  })

  const filteredHistory = historyJobs.filter(job => {
    const historyMatchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (historyFilter === 'all') return historyMatchesSearch
    return historyMatchesSearch && job.status.toLowerCase() === historyFilter.toLowerCase()
  }).sort((a, b) => {
    // Sort by completion date, most recent first
    const dateA = new Date(a.completedDate)
    const dateB = new Date(b.completedDate)
    return dateB.getTime() - dateA.getTime()
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
                <h1 className="text-2xl font-bold text-white tracking-tight">My Bookings</h1>
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
                        className="w-full px-4 py-2 pr-10 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors duration-200"
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
        <div className="flex-1 pb-24">
          <Tabs defaultValue="active" className="h-full flex flex-col" onValueChange={setActiveTab}>
            {/* Fixed Tabs Header */}
            <div className="fixed top-[64px] left-0 right-0 z-40 bg-[#111111]">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsList className="flex w-full bg-transparent border-b border-white/10">
                  <TabsTrigger 
                    value="active" 
                    className={cn(
                      "flex-1 py-3 text-sm font-medium text-white/40 transition-colors bg-transparent",
                      "hover:text-white/60 hover:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "focus:outline-none focus:bg-transparent"
                    )}
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="applications"
                    className={cn(
                      "flex-1 py-3 text-sm font-medium text-white/40 transition-colors bg-transparent",
                      "hover:text-white/60 hover:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "focus:outline-none focus:bg-transparent"
                    )}
                  >
                    Applications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className={cn(
                      "flex-1 py-3 text-sm font-medium text-white/40 transition-colors bg-transparent",
                      "hover:text-white/60 hover:bg-transparent",
                      "data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white",
                      "focus:outline-none focus:bg-transparent"
                    )}
                  >
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-[120px] pb-6">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsContent value="active" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
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
                      booking.status === 'confirmed' || booking.status === 'ongoing'
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
                        .filter(booking => booking.status === 'confirmed' || booking.status === 'ongoing')
                        .map((booking) => (
                          <BookingCard 
                            key={booking["#"]} 
                            booking={booking} 
                            showActions={true}
                          />
                        ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
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
                          key={application["#"]} 
                          application={application}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
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
                          key={job["#"]}
                          className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {job.status === 'Completed' && (
                                  <div className="bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/20 w-fit">
                                    Completed
                                  </div>
                                )}
                                {job.status === 'Cancelled' && (
                                  <div className="bg-red-500/10 text-red-400 text-xs font-medium px-3 py-1 rounded-full border border-red-500/20 w-fit">
                                    Cancelled
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-white/60">
                                <span className="font-mono text-xs">{job["#"]}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-base font-medium text-white line-clamp-2 mb-1">{job.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-3.5 h-3.5 text-purple-400">
                                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span>{job.freelancer.name}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start gap-2 text-white/60">
                                <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 text-purple-400">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                    <line x1="16" x2="16" y1="2" y2="6"></line>
                                    <line x1="8" x2="8" y1="2" y2="6"></line>
                                    <line x1="3" x2="21" y1="10" y2="10"></line>
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-white/40 mb-0.5">Completed</div>
                                  <div className="text-sm text-white/90">{job.completedDate}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2 text-white/60">
                                <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-purple-400">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs text-white/40 mb-0.5">Your Rating</div>
                                  <div className="flex items-center gap-1">
                                    {[...Array(job.yourRating)].map((_, i) => (
                                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="font-bold text-white">
                              Earned: {job.earnedMoney}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 border-white/20 text-white/70 whitespace-nowrap min-w-[100px] hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300 !rounded-lg"
                              >
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white whitespace-nowrap min-w-[100px] hover:from-purple-700 hover:to-purple-500 hover:shadow-lg transition-all duration-300 !rounded-lg"
                              >
                                Book Again
                              </Button>
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