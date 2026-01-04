"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Search, X, Briefcase, Star, Phone as PhoneIcon } from "lucide-react"
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
                : booking.status === 'confirmed' || booking.status === 'pending'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-green-500/10 text-green-400 border-green-500/20' // This will actually be handled by the first check if we reorder or use explicit 'ongoing'
                }`}>
                {booking.status === 'ongoing' ? 'Ongoing' : (booking.status === 'confirmed' || booking.status === 'pending') ? 'Upcoming' : 'Completed'}
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
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-medium text-white line-clamp-1">{booking.service}</h3>
              {booking.otp && (booking.status === 'confirmed' || booking.status === 'pending') && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <span className="text-[10px] uppercase font-semibold">Start Code</span>
                  <span className="font-mono text-xs font-bold tracking-wider">{booking.otp}</span>
                </div>
              )}
            </div>
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
                disabled
                className="flex-1 border-white/10 text-white/30 hover:bg-transparent hover:border-white/10 cursor-not-allowed transition-all duration-300 !rounded-lg"
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                }}
              >
                Message
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 transition-all duration-300 !rounded-lg"
                onClick={(event) => {
                  event.stopPropagation()
                  if (booking.providerPhone) {
                    window.location.href = `tel:${booking.providerPhone.replace(/\s/g, '')}`
                  } else {
                    // Fallback or toast
                    alert("Phone number not available")
                  }
                }}
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call
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
            disabled
            className="flex-1 border-white/10 text-white/30 hover:bg-transparent hover:border-white/10 cursor-not-allowed transition-all duration-300 !rounded-lg"
            onClick={(event) => {
              event.stopPropagation()
              event.preventDefault()
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

// Card for history jobs
const HistoryCard = ({ booking }: { booking: Booking }) => {
  const router = useRouter()
  // Mocking history job for useBookAgain hook, or we need to update hook
  const historyJobMock: HistoryJob = {
    "#": booking["#"],
    title: booking.service,
    freelancer: {
      name: booking.provider,
      image: booking.image,
      rating: booking.rating
    },
    completedDate: booking.completedAt || booking.date,
    status: booking.status === 'completed' ? 'Completed' : 'Cancelled',
    yourRating: booking.rating,
    earnedMoney: booking.price
  }

  const { showBookAgain, setShowBookAgain, BookAgainModal } = useBookAgain(historyJobMock)

  const handleOpenDetails = () => {
    router.push(`/client/bookings/history/${encodeURIComponent(booking["#"])}`)
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
              {booking.status === 'completed' && (
                <div className="bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/20 w-fit">
                  Completed
                </div>
              )}
              {booking.status === 'cancelled' && (
                <div className="bg-red-500/10 text-red-400 text-xs font-medium px-3 py-1 rounded-full border border-red-500/20 w-fit">
                  Cancelled
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
                <div className="text-xs text-white/40 mb-0.5">Completed</div>
                <div className="text-sm text-white/90">{booking.completedAt || 'N/A'}</div>
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
                  {[...Array(booking.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                  {booking.rating === 0 && <span className="text-xs text-white/40">Not rated</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="font-bold text-white">
            {booking.price}
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
const PostedJobCard = ({ job, showUpcoming = false }: { job: any; showUpcoming?: boolean }) => {
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
      className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111] relative overflow-hidden"
    >
      {/* Purple left stripe for active job indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-purple-700" />

      <div className="space-y-4 pl-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showUpcoming ? (
              <div className="bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1 rounded-full border border-amber-500/20 w-fit">
                Upcoming
              </div>
            ) : (
              <div className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${job.status === 'open'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : job.status === 'deleted'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                {job.status === 'open' ? 'Open' : job.status === 'deleted' ? 'Deleted' : 'Closed'}
              </div>
            )}
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
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-white/60">
            <Briefcase className="w-4 h-4 text-purple-400 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Category</div>
              <div className="text-sm text-white/90 truncate">{job.category}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400 mt-0.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">People</div>
              <div className="text-sm text-white/90">{job.acceptedCount || 0}/{job.peopleNeeded || 1}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-white/60">
            <Calendar className="w-4 h-4 text-purple-400 mt-0.5" />
            <div className="min-w-0">
              <div className="text-xs text-white/40 mb-0.5">Date & Time</div>
              <div className="text-sm text-white/90">
                {job.scheduledAt
                  ? new Date(job.scheduledAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  : 'Not set'}
              </div>
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

        {/* Posted time ago */}
        <div className="text-xs text-white/40 mt-2">
          Posted {(() => {
            const now = new Date();
            const posted = new Date(job.datePosted);
            const diffMs = now.getTime() - posted.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);
            const diffMonths = Math.floor(diffDays / 30);

            if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
            if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
            if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            return 'today';
          })()}
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
  const [applicationFilter, setApplicationFilter] = useState('all')
  const [historyFilter, setHistoryFilter] = useState(initialHistoryFilter)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { bookings } = useBookings()
  const { applications } = useApplications()
  const { historyJobs } = useHistoryJobs()
  const { postedJobs, loading: jobsLoading } = usePostedJobs()


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
        (booking.status === 'confirmed' || booking.status === 'ongoing' || booking.status === 'pending')
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
        (booking.status === 'confirmed' || booking.status === 'ongoing' || booking.status === 'pending')
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



  const filteredHistory = bookings.filter(booking => {
    const matchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.provider.toLowerCase().includes(searchQuery.toLowerCase())

    const isHistoryStatus = booking.status === 'completed' || booking.status === 'cancelled';

    if (!isHistoryStatus) return false;

    if (historyFilter === 'all') return matchesSearch
    return matchesSearch && booking.status.toLowerCase() === historyFilter.toLowerCase()
  }).sort((a, b) => {
    const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0)
    const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0)
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
                      booking.status === 'confirmed' || booking.status === 'ongoing' || booking.status === 'pending'
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
                        {/* Active Job Posts */}
                        {postedJobs
                          .filter(job => job.status === 'open')
                          .map((job) => (
                            <PostedJobCard
                              key={job["#"]}
                              job={job}
                              showUpcoming={true}
                            />
                          ))
                        }
                        {/* Active Bookings */}
                        {filteredBookings
                          .filter(booking => booking.status === 'confirmed' || booking.status === 'ongoing' || booking.status === 'pending')
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
                  {/* Applications Tab Filters - Showing Posted Jobs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['all', 'open', 'closed', 'deleted'].map((filter) => (
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
                    {jobsLoading ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                        <h3 className="text-lg font-medium text-white/90 mb-2">Loading jobs...</h3>
                      </div>
                    ) : postedJobs
                      .filter(job => applicationFilter === 'all' || job.status === applicationFilter)
                      .length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-white/40" />
                        </div>
                        <h3 className="text-lg font-medium text-white/90 mb-2">No {applicationFilter === 'all' ? '' : applicationFilter} jobs found</h3>
                        <p className="text-white/60 text-sm">
                          {applicationFilter === 'all'
                            ? "You haven't posted any jobs yet"
                            : `No jobs found with status '${applicationFilter}'`}
                        </p>
                      </div>
                    ) : (
                      postedJobs
                        .filter(job => applicationFilter === 'all' || job.status === applicationFilter)
                        .map((job) => (
                          <PostedJobCard
                            key={job["#"]}
                            job={job}
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
                          You haven&apos;t completed any bookings yet
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((booking) => (
                        <HistoryCard key={booking["#"]} booking={booking} />
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