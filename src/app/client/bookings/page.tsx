"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Search, X, Briefcase, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import ClientLayout from "@/components/layouts/client-layout"
import { useBookings, Booking } from "@/contexts/BookingsContext"
import { useApplications, Application } from "@/contexts/ApplicationsContext"
import { useHistoryJobs, HistoryJob } from "@/contexts/HistoryJobsContext"
import { usePostedJobs } from "@/contexts/PostedJobsContext"
import { useBookAgain } from "@/hooks/useBookAgain"

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

import { RescheduleModal } from "@/components/client/bookings/RescheduleModal"

const BookingCard = ({ booking, showActions = true }: BookingCardProps) => {
  const router = useRouter()
  const { rescheduleBooking } = useBookings()
  const [showReschedule, setShowReschedule] = useState(false)

  const handleOpenDetails = () => {
    router.push(`/client/bookings/${encodeURIComponent(booking["#"])}`)
  }

  const handleReschedule = async (id: string, newDate: string, newTime: string) => {
    await rescheduleBooking(id, newDate, newTime)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleOpenDetails()
          }
        }}
        className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111]"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${booking.status === 'ongoing'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                {booking.status === 'ongoing' ? 'Ongoing' : booking.status === 'confirmed' ? 'Upcoming' : 'Completed'}
              </div>
              {booking.paymentMethod === 'cod' && (
                <div className="text-xs font-medium px-2 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  COD
                </div>
              )}
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
                <div className="text-sm text-white/90">
                  {(() => {
                    // Format date from YYYY-MM-DD to readable format
                    const [year, month, day] = booking.date.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    });
                  })()} at {booking.time}
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
                onClick={(event) => {
                  event.stopPropagation()
                  router.push(`/client/chat/${encodeURIComponent(booking.provider)}`)
                }}
              >
                Message
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 !rounded-lg"
                onClick={(event) => {
                  event.stopPropagation()
                  setShowReschedule(true)
                }}
              >
                Reschedule
              </Button>
            </div>
          )}
        </div>
      </div>

      <RescheduleModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        booking={booking}
        onReschedule={handleReschedule}
      />
    </>
  );
};

const ApplicationCard = ({ application }: { application: Application }) => {
  const router = useRouter()
  const { acceptApplication, rejectApplication } = useApplications()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOpenDetails = () => {
    router.push(`/client/bookings/applications/${encodeURIComponent(application["#"])}`)
  }

  const handleAccept = async (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsProcessing(true)
    try {
      await acceptApplication(application["#"])
    } catch (error) {
      console.error("Failed to accept application:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsProcessing(true)
    try {
      await rejectApplication(application["#"])
    } catch (error) {
      console.error("Failed to reject application:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleOpenDetails()
        }
      }}
      className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111]"
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
                disabled={isProcessing}
                className="flex-1 border-white/20 text-white/70 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-100 transition-all duration-300 !rounded-lg"
                onClick={handleReject}
              >
                Decline
              </Button>
              <Button
                size="sm"
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 !rounded-lg"
                onClick={handleAccept}
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
                onClick={(event) => {
                  event.stopPropagation()
                  router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)
                }}
              >
                Message
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-400 text-white border-0 hover:shadow-lg hover:from-green-700 hover:to-green-500 transition-all duration-300 !rounded-lg"
                onClick={(event) => {
                  event.stopPropagation()
                  handleOpenDetails()
                }}
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
                onClick={(event) => {
                  event.stopPropagation()
                  handleOpenDetails()
                }}
              >
                View Profile
              </Button>
              <Button
                size="sm"
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white border-0 hover:shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 !rounded-lg"
                onClick={handleAccept}
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

// Card for accepted proposals - shows in Active tab
const AcceptedProposalCard = ({ application }: { application: Application }) => {
  const router = useRouter()

  const handleOpenDetails = () => {
    router.push(`/client/bookings/applications/${encodeURIComponent(application["#"])}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleOpenDetails()
        }
      }}
      className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111] relative overflow-hidden"
    >
      {/* Purple left stripe for proposal indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-purple-700" />

      <div className="space-y-4 pl-2">
        {/* Proposal header text */}
        <div className="flex items-center gap-2 text-xs text-purple-400 font-medium uppercase tracking-wider">
          <span>Accepted Proposal</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1 rounded-full border border-amber-500/20 w-fit">
              Upcoming
            </div>
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
            <div className="flex-shrink-0 mt-0.5">
              <Star className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Rating</div>
              <div className="text-sm text-white/90 flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{application.freelancer.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Availability</div>
              <div className="text-sm text-white/90 truncate">{application.availability}</div>
            </div>
          </div>
        </div>

        <div className="font-bold text-white">
          {application.price}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 transition-all duration-300 !rounded-lg"
            onClick={(event) => {
              event.stopPropagation()
              router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)
            }}
          >
            Message
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 !rounded-lg"
            onClick={(event) => {
              event.stopPropagation()
              handleOpenDetails()
            }}
          >
            Reschedule
          </Button>
        </div>
      </div>
    </div>
  )
}

const HistoryCard = ({ job }: { job: HistoryJob }) => {
  const router = useRouter()
  const { showBookAgain, setShowBookAgain, BookAgainModal } = useBookAgain(job)

  const handleOpenDetails = () => {
    router.push(`/client/bookings/history/${encodeURIComponent(job["#"])}`)
  }

  return (
    <>
      <BookAgainModal />
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleOpenDetails()
          }
        }}
        className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111]"
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
              onClick={(event) => {
                event.stopPropagation()
                handleOpenDetails()
              }}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white whitespace-nowrap min-w-[100px] hover:from-purple-700 hover:to-purple-500 hover:shadow-lg transition-all duration-300 !rounded-lg"
              onClick={(event) => {
                event.stopPropagation()
                setShowBookAgain(true)
              }}
            >
              Book Again
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// Card for posted jobs in My Jobs filter
const PostedJobCard = ({ job }: { job: any }) => {
  const router = useRouter()

  const handleOpenDetails = () => {
    // Navigate to job detail page
    router.push(`/client/jobs/${encodeURIComponent(job["#"])}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleOpenDetails()
        }
      }}
      className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111]"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${job.status === 'open'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}>
              {job.status === 'open' ? 'Open' : 'Closed'}
            </div>
            {job.applicationCount > 0 && (
              <div className="bg-purple-500/20 text-purple-300 text-xs font-medium px-2 py-1 rounded-full border border-purple-500/30">
                {job.applicationCount} {job.applicationCount === 1 ? 'Application' : 'Applications'}
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
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>{job.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-white/60">
            <Calendar className="w-4 h-4 text-purple-400 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Posted</div>
              <div className="text-sm text-white/90 truncate">{new Date(job.datePosted).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-white/60">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Views</div>
              <div className="text-sm text-white/90">{job.viewCount || 0}</div>
            </div>
          </div>
        </div>

        <div className="font-bold text-white">
          {job.budget}
        </div>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'active'
  const initialFilter = searchParams.get('filter') || 'all'
  const initialAppFilter = searchParams.get('appFilter') || 'new'
  const initialHistoryFilter = searchParams.get('historyFilter') || 'all'
  const [currentTab, setCurrentTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(initialFilter)
  const [applicationFilter, setApplicationFilter] = useState(initialAppFilter)
  const [historyFilter, setHistoryFilter] = useState(initialHistoryFilter)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { bookings } = useBookings()
  const { applications } = useApplications()
  const { historyJobs } = useHistoryJobs()
  const { postedJobs } = usePostedJobs()


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
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
            {/* Fixed Tabs Header */}
            <div className="fixed top-[64px] left-0 right-0 z-40 bg-[#111111]">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsList className="flex w-full bg-transparent border-b border-white/10">
                  <TabsTrigger
                    value="active"
                    className={cn(
                      "flex-1 py-2 text-sm font-medium text-white/40 transition-colors bg-transparent",
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
                      "flex-1 py-2 text-sm font-medium text-white/40 transition-colors bg-transparent",
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
                      "flex-1 py-2 text-sm font-medium text-white/40 transition-colors bg-transparent",
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
                          You haven&apos;t applied for any services yet
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Accepted Proposals */}
                        {applications
                          .filter(app => app.status === 'accepted')
                          .map((application) => (
                            <AcceptedProposalCard
                              key={application["#"]}
                              application={application}
                            />
                          ))
                        }
                        {/* Active Bookings */}
                        {filteredBookings
                          .filter(booking => booking.status === 'confirmed' || booking.status === 'ongoing')
                          .map((booking) => (
                            <BookingCard
                              key={booking["#"]}
                              booking={booking}
                              showActions={true}
                            />
                          ))
                        }
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                  {/* Applications Tab Filters */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['new', 'accepted', 'rejected', 'myJobs'].map((filter) => (
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
                        {filter === 'myJobs' ? 'My Jobs' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {applicationFilter === 'myJobs' ? (
                      // Show posted jobs
                      postedJobs.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-white/40" />
                          </div>
                          <h3 className="text-lg font-medium text-white/90 mb-2">No posted jobs yet</h3>
                          <p className="text-white/60 text-sm">
                            Post a job to find the perfect cricket professional
                          </p>
                        </div>
                      ) : (
                        postedJobs.map((job) => (
                          <PostedJobCard
                            key={job["#"]}
                            job={job}
                          />
                        ))
                      )
                    ) : (
                      // Show applications
                      filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-white/40" />
                          </div>
                          <h3 className="text-lg font-medium text-white/90 mb-2">No applications yet</h3>
                          <p className="text-white/60 text-sm">
                            You haven&apos;t received any job applications
                          </p>
                        </div>
                      ) : (
                        filteredApplications.map((application) => (
                          <ApplicationCard
                            key={application["#"]}
                            application={application}
                          />
                        ))
                      )
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
                          You haven&apos;t completed any bookings yet
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((job) => (
                        <HistoryCard key={job["#"]} job={job} />
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