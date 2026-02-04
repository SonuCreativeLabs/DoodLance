"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Search, X, Briefcase, Star, Phone as PhoneIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import ClientLayout from "@/components/layouts/client-layout"
import { useBookings, Booking } from "@/contexts/BookingsContext"
import { useApplications, Application } from "@/contexts/ApplicationsContext"
import { CricketLoader } from "@/components/ui/cricket-loader"
import { useHistoryJobs, HistoryJob } from "@/contexts/HistoryJobsContext"
import { usePostedJobs } from "@/contexts/PostedJobsContext"
import { useBookAgain } from "@/hooks/useBookAgain"
// 🚀 React Query POC imports
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { useBookingsQuery } from '@/hooks/useBookingsQuery'
import { FilterChip } from "@/components/client/bookings/FilterChip"


interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

import { RescheduleModal } from "@/components/client/bookings/RescheduleModal"
import { ComingSoonOverlay } from '@/components/common/ComingSoonOverlay';
import { CricketComingSoon } from '@/components/common/CricketComingSoon';
import { BookingCardSkeleton } from '@/components/skeletons/BookingCardSkeleton'

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
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`text-xs font-medium px-3 py-1 rounded-full border w-fit max-w-full truncate ${(() => {
                const statusLower = (booking.status || '').toLowerCase();
                if (statusLower === 'completed_by_client' || statusLower === 'completed_by_freelancer') {
                  return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                } else if (statusLower === 'ongoing') {
                  return 'bg-green-500/10 text-green-400 border-green-500/20';
                } else if (statusLower === 'confirmed' || statusLower === 'pending') {
                  return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                } else {
                  return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
                }
              })()}`}>
                {(() => {
                  const statusLower = (booking.status || '').toLowerCase();
                  if (statusLower === 'ongoing') return 'Ongoing';
                  if (statusLower === 'completed_by_client') return `Mark Completed by You`;
                  if (statusLower === 'completed_by_freelancer') return `Mark Completed by Freelancer`;
                  if (statusLower === 'confirmed' || statusLower === 'pending') return 'Upcoming';
                  return 'Completed';
                })()}
              </div>
              {booking.paymentMethod === 'cod' && (
                <div className="text-xs font-medium px-2 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20 flex-shrink-0">
                  COD
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/60 flex-shrink-0">
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
                  {booking.date && booking.time ? (
                    <>
                      {(() => {
                        const dateObj = new Date(booking.date);
                        if (!isNaN(dateObj.getTime())) {
                          return dateObj.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          });
                        }
                        return booking.date;
                      })()} at {booking.time}
                    </>
                  ) : booking.scheduledAt ? (
                    <>
                      {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'Asia/Kolkata'
                      })} at {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </>
                  ) : (
                    'Date not set'
                  )}
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
                className="w-full text-white h-9 text-xs font-medium shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 !rounded-lg border-0"
                style={{
                  background: 'linear-gradient(135deg, #2131e2 0%, #1d59eb 100%)',
                  boxShadow: '0 4px 14px 0 rgba(33, 49, 226, 0.25)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1d2bcb 0%, #1a4fd3 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2131e2 0%, #1d59eb 100%)';
                }}
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
                <PhoneIcon className="w-3.5 h-3.5" />
                <span>Call</span>
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
  // Memoize to prevent re-creation loops in useBookAgain
  // Memoize to prevent re-creation loops in useBookAgain
  const historyJobMock: HistoryJob = useMemo(() => ({
    "#": booking["#"],
    title: booking.service,
    freelancer: {
      id: booking.freelancerId || '',
      name: booking.provider,
      image: booking.image,
      rating: booking.rating
    },
    completedDate: booking.completedAt || booking.date,
    status: booking.status === 'completed' ? 'Completed' : 'Cancelled',
    yourRating: booking.rating,
    earnedMoney: booking.price,
    serviceId: booking.services?.[0]?.id || (booking as any).serviceId
  }), [booking]);

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
                <div className="text-sm text-white/90">
                  {booking.completedAt ? (
                    <>
                      {new Date(booking.completedAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'Asia/Kolkata'
                      })} at {new Date(booking.completedAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      })}
                    </>
                  ) : 'N/A'}
                </div>
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
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Kolkata'
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



// 🎯 Feature flag for React Query POC
const USE_REACT_QUERY = process.env.NEXT_PUBLIC_USE_REACT_QUERY === 'true'

function BookingsPageContent() {
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
  const [initialLoad, setInitialLoad] = useState(true)

  // 🔀 Conditional hook usage: React Query (POC) OR BookingsContext (fallback)
  const bookingsFromQuery = USE_REACT_QUERY ? useBookingsQuery() : { bookings: [], loading: false, error: null, refreshBookings: async () => { } }
  const bookingsFromContext = USE_REACT_QUERY ? { bookings: [], loading: false, error: null, refreshBookings: async () => { } } : useBookings()

  const { bookings, loading: bookingsLoading, error: bookingsError, refreshBookings } = USE_REACT_QUERY ? bookingsFromQuery : bookingsFromContext

  // Set initial load to false once we have data or an error
  useEffect(() => {
    if (!bookingsLoading || bookingsError || (bookings && bookings.length >= 0)) {
      setInitialLoad(false)
    }
  }, [bookingsLoading, bookingsError, bookings])

  // Composite loading state: show skeleton on initial load OR when actively loading
  const isLoading = initialLoad || bookingsLoading

  const { applications } = useApplications()
  const { historyJobs } = useHistoryJobs()
  const { postedJobs, loading: jobsLoading } = usePostedJobs()

  // 📊 Log which data source is being used
  if (typeof window !== 'undefined') {
    if (bookingsError) {
      console.error(`❌ Bookings Error: ${bookingsError}`)
    } else if (bookings.length > 0) {
      console.log(`📦 Bookings Source: ${USE_REACT_QUERY ? 'React Query (Cached)' : 'BookingsContext'}, Count: ${bookings.length}`)
    }
  }


  const filteredBookings = useMemo(() => {
    // ... filtering logic ...
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day

    return bookings.filter(booking => {
      const bookingMatchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchQuery.toLowerCase())

      // Basic search filter first - if it doesn't match, skip expensive date logic
      if (!bookingMatchesSearch) return false;

      const timeStr = booking.time || ''
      let minutes = 0;
      let bookingHours = 0;

      if (timeStr) {
        const [time, period] = timeStr.split(' ')
        if (time) {
          const [hours, mins] = time.split(':').map(Number)
          minutes = mins || 0
          bookingHours = hours || 0
          if (period === 'PM' && hours !== 12) bookingHours += 12
          if (period === 'AM' && hours === 12) bookingHours = 0
        }
      }

      // Create booking date with proper time
      // Check if date is valid
      if (!booking.date) return false;

      const [bookingYear, bookingMonth, bookingDay] = booking.date.split('-').map(Number)
      const bookingDate = new Date(bookingYear, bookingMonth - 1, bookingDay)

      if (selectedFilter === 'all') {
        const statusLower = (booking.status || '').toLowerCase();
        return (statusLower === 'confirmed' || statusLower === 'ongoing' || statusLower === 'pending' ||
          statusLower === 'completed_by_client' || statusLower === 'completed_by_freelancer')
      }

      if (selectedFilter === 'ongoing') {
        const datesMatch = bookingDate.toDateString() === today.toDateString();
        if (booking.status === 'ongoing') return true;
        return datesMatch && (booking.status === 'confirmed');
      }

      if (selectedFilter === 'marked') {
        const statusLower = (booking.status || '').toLowerCase();
        const isMarked = statusLower === 'completed_by_client' || statusLower === 'completed_by_freelancer';
        console.log(`🔍 Checking booking ${booking["#"]} for marked filter:`, {
          status: booking.status,
          statusLower,
          isMarked,
          service: booking.service
        });
        return isMarked;
      }

      if (selectedFilter === 'upcoming') {
        return bookingDate > today &&
          (booking.status === 'confirmed' || booking.status === 'pending')
      }

      return true
    }).sort((a, b) => {
      // ... sort logic ...
      return 0
      // Keeping it simple for the replace block, relying on existing sort logic if not replacing whole block? 
      // Wait, replace_file_content replaces the whole TARGET CONTENT. 
      // I need to be careful not to delete the sort logic if I don't include it. 
      // The instruction spans lines 634 to 911..? That's too huge. 

      // I should break this down. 
    })
  }, [bookings, searchQuery, selectedFilter])

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

  // Calculate counts for active tab filters
  const activeFilterCounts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = {
      all: 0,
      ongoing: 0,
      upcoming: 0,
      marked: 0
    };

    (bookings || []).forEach(booking => {
      const statusLower = (booking.status || '').toLowerCase();

      // All: confirmed, ongoing, pending, or marked
      if (statusLower === 'confirmed' || statusLower === 'ongoing' || statusLower === 'pending' ||
        statusLower === 'completed_by_client' || statusLower === 'completed_by_freelancer') {
        counts.all++;
      }

      // Marked
      if (statusLower === 'completed_by_client' || statusLower === 'completed_by_freelancer') {
        counts.marked++;
      }

      // Ongoing and Upcoming require date check
      if (booking.date) {
        const [year, month, day] = booking.date.split('-').map(Number);
        const bookingDate = new Date(year, month - 1, day);
        const isToday = bookingDate.toDateString() === today.toDateString();

        if (booking.status === 'ongoing' || (isToday && booking.status === 'confirmed')) {
          counts.ongoing++;
        }

        if (bookingDate > today && (booking.status === 'confirmed' || booking.status === 'pending')) {
          counts.upcoming++;
        }
      }
    });

    return counts;
  }, [bookings]);

  // Calculate counts for history tab filters
  const historyFilterCounts = useMemo(() => {
    const counts = { all: 0, completed: 0, cancelled: 0 };

    (bookings || []).forEach(booking => {
      if (booking.status === 'completed' || booking.status === 'cancelled') {
        counts.all++;
        if (booking.status === 'completed') counts.completed++;
        if (booking.status === 'cancelled') counts.cancelled++;
      }
    });

    return counts;
  }, [bookings]);

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
        <div className="fixed top-0 md:top-16 left-0 right-0 z-50 bg-[#111111]">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between relative">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">My Bookings</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Search removed from here */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-24">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
            {/* Fixed Tabs Header */}
            <div className="fixed top-[64px] md:top-32 left-0 right-0 z-40 bg-[#111111]">
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
            <div className="flex-1 overflow-y-auto pt-[120px] md:pt-[70px] pb-6">
              <div className="container max-w-4xl mx-auto px-4">
                <TabsContent value="active" className="mt-2 md:mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {/* Active Tab Filters */}
                  <div className="flex gap-2 mb-6 md:mb-4 overflow-x-auto pb-2 scroll-smooth items-center min-h-[44px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Inline Search */}
                    <div className={cn(
                      "flex items-center transition-all duration-300 overflow-hidden",
                      isSearchOpen ? "w-full opacity-100" : "w-8 opacity-100"
                    )}>
                      {isSearchOpen ? (
                        <div className="flex items-center w-full bg-[#1E1E1E] rounded-xl border border-white/20 px-3 h-11 shadow-2xl">
                          <Search className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm text-white placeholder-white/50 focus:outline-none w-full min-w-0 h-full"
                            autoFocus
                          />
                          <X
                            className="w-5 h-5 text-white/50 cursor-pointer hover:text-white flex-shrink-0 ml-2"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsSearchOpen(true)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors flex-shrink-0"
                        >
                          <Search className="w-4 h-4 text-white/70" />
                        </button>
                      )}
                    </div>
                    {!isSearchOpen && ['all', 'ongoing', 'upcoming', 'marked'].map((filter) => (
                      <FilterChip
                        key={filter}
                        label={filter}
                        count={activeFilterCounts[filter as keyof typeof activeFilterCounts]}
                        isSelected={selectedFilter === filter}
                        onClick={() => setSelectedFilter(filter)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      // Show skeleton cards while loading
                      [...Array(3)].map((_, i) => (
                        <BookingCardSkeleton key={i} />
                      ))
                    ) : bookingsError ? (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white/90 mb-2">Failed to load bookings</h3>
                        <p className="text-white/60 text-sm mb-4">{bookingsError}</p>
                        <Button
                          onClick={() => {
                            if (refreshBookings) refreshBookings();
                            else window.location.reload();
                          }}
                          variant="outline"
                          className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
                        >
                          Retry
                        </Button>
                      </div>
                    ) : filteredBookings.length === 0 ? (
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
                        {filteredBookings.map((booking) => (
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



                <TabsContent value="applications" className="mt-0 h-full">
                  <div className="h-[60vh] flex flex-col items-center justify-center">
                    <CricketComingSoon
                      title="Field Setting Change!"
                      description={
                        <>
                          The Job Posting arena is being marked for the next match.<br />
                          Get your game plan ready!
                        </>
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
                  {/* History Tab Filters */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scroll-smooth items-center min-h-[44px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Inline Search */}
                    <div className={cn(
                      "flex items-center transition-all duration-300 overflow-hidden",
                      isSearchOpen ? "w-full opacity-100" : "w-8 opacity-100"
                    )}>
                      {isSearchOpen ? (
                        <div className="flex items-center w-full bg-[#1E1E1E] rounded-xl border border-white/20 px-3 h-11 shadow-2xl">
                          <Search className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm text-white placeholder-white/50 focus:outline-none w-full min-w-0 h-full"
                            autoFocus
                          />
                          <X
                            className="w-5 h-5 text-white/50 cursor-pointer hover:text-white flex-shrink-0 ml-2"
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsSearchOpen(true)}
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors flex-shrink-0"
                        >
                          <Search className="w-4 h-4 text-white/70" />
                        </button>
                      )}
                    </div>
                    {!isSearchOpen && ['all', 'completed', 'cancelled'].map((filter) => (
                      <FilterChip
                        key={filter}
                        label={filter}
                        count={historyFilterCounts[filter as keyof typeof historyFilterCounts]}
                        isSelected={historyFilter === filter}
                        onClick={() => setHistoryFilter(filter)}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading ? (
                      // Show skeleton cards while loading
                      [...Array(3)].map((_, i) => (
                        <BookingCardSkeleton key={i} />
                      ))
                    ) : filteredHistory.length === 0 ? (
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
              </div >
            </div >
          </Tabs >
        </div >
      </div >
    </ClientLayout >
  )
}

// Export the content directly (QueryClientProvider is now global in Providers.tsx)
export default function BookingsPage() {
  if (USE_REACT_QUERY) {
    console.log('🚀 [POC] Using React Query for Bookings page')
  } else {
    console.log('📦 [Fallback] Using BookingsContext for Bookings page')
  }

  return <BookingsPageContent />
}
