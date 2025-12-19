"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Phone, Star, Briefcase, Shield, CheckCircle2, X, CheckCircle, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBookings } from "@/contexts/BookingsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusCopy: Record<string, string> = {
  ongoing: "Ongoing",
  confirmed: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Format date from YYYY-MM-DD to readable format
const formatBookingDate = (dateStr: string): string => {
  if (!dateStr) return '';
  // Check if it's in YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateStr;
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();
  const { bookings, loading } = useBookings();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const rawId = useMemo(() => {
    if (!params || typeof params.id === "undefined") return "";
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    return decodeURIComponent(value);
  }, [params]);

  const handleCancelBooking = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = () => {
    if (!cancelNotes.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    if (!booking) return;

    try {
      // Update booking status in localStorage
      const storedBookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
      const updatedBookings = storedBookings.map((b: any) => {
        if (b['#'] === booking['#']) {
          return { ...b, status: 'cancelled', cancellationNotes: cancelNotes };
        }
        return b;
      });
      localStorage.setItem('clientBookings', JSON.stringify(updatedBookings));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('clientBookingUpdated', { 
        detail: { bookings: updatedBookings, action: 'cancelled' } 
      }));

      setShowCancelDialog(false);
      setCancelNotes('');
      
      // Redirect to bookings list
      router.push('/client/bookings');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleMarkComplete = () => {
    setShowCompleteDialog(true);
  };

  const confirmMarkComplete = () => {
    if (rating === 0) {
      alert('Please provide a rating before marking as complete.');
      return;
    }

    if (!booking) return;

    try {
      // Update booking status in localStorage
      const storedBookings = JSON.parse(localStorage.getItem('clientBookings') || '[]');
      const updatedBookings = storedBookings.map((b: any) => {
        if (b['#'] === booking['#']) {
          return { 
            ...b, 
            status: 'completed',
            clientRating: {
              stars: rating,
              feedback: review,
              feedbackChips: selectedChips,
              date: new Date().toISOString()
            }
          };
        }
        return b;
      });
      localStorage.setItem('clientBookings', JSON.stringify(updatedBookings));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('clientBookingUpdated', { 
        detail: { bookings: updatedBookings, action: 'completed' } 
      }));

      setShowCompleteDialog(false);
      setReview('');
      setRating(0);
      setSelectedChips([]);
      
      // Redirect to bookings list
      router.push('/client/bookings');
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  const booking = useMemo(() => bookings.find((entry) => entry["#"] === rawId), [rawId, bookings]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <div className="text-lg">Loading booking...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="text-lg">Booking not found.</div>
        <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const statusLabel = statusCopy[booking.status] ?? booking.status;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="inline-flex items-center p-0 hover:bg-transparent text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                aria-label="Back"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Button>

              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">{booking["#"]}</h1>
                <p className="text-white/50 text-xs">{statusLabel}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 p-0 transition-all duration-200"
              aria-label="Call"
            >
              <Phone className="h-4 w-4 text-purple-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
          <div className="relative px-4 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-purple-500/20 backdrop-blur-xl">
                  <AvatarImage src={booking.image} alt={booking.provider} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold text-lg">
                    {booking.provider.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white/60">Coach</p>
                  <h2 className="text-2xl font-semibold text-white">{booking.provider}</h2>
                  <div className="mt-2 flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="font-medium text-white/80">{booking.rating}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                      <span>{booking.completedJobs}+ sessions completed</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">Session Fee</p>
                <p className="text-3xl font-semibold text-white">{booking.price}</p>
                <p className="text-xs text-white/50 mt-2">Includes taxes & venue charges</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-24">
          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span>Scheduled for</span>
              </div>
              <p className="text-lg font-semibold text-white">{formatBookingDate(booking.date)}</p>
              <p className="text-sm text-white/60">{booking.time}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <Clock className="w-4 h-4 text-purple-300" />
                <span>Session duration</span>
              </div>
              <p className="text-lg font-semibold text-white">60 minutes</p>
              <p className="text-sm text-white/60">Arrive 10 minutes earlier</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <MapPin className="w-4 h-4 text-purple-300" />
                <span>Venue</span>
              </div>
              <p className="text-lg font-semibold text-white">{booking.location}</p>
              <p className="text-sm text-white/60">Indoor training facility</p>
            </div>
          </div>

          {/* Services Booked */}
          {booking.services && booking.services.length > 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Services Booked</h3>
              <div className="space-y-3">
                {booking.services.map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-white/90">{service.title}</span>
                      {service.quantity > 1 && (
                        <span className="text-xs text-white/50">x{service.quantity}</span>
                      )}
                    </div>
                    <span className="text-white font-medium">
                      {typeof service.price === 'number' ? `₹${service.price.toLocaleString()}` : service.price}
                    </span>
                  </div>
                ))}
              </div>
              {booking.paymentMethod === 'cod' && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Payment Method</span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Cash on Delivery
                  </span>
                </div>
              )}
            </div>
          )}

          {/* OTP Verification Card - Show for confirmed bookings */}
          {booking.status === 'confirmed' && booking.otp && (
            <div className="mt-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-500/10 p-6 backdrop-blur-xl">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Your Verification Code</h3>
                <p className="text-sm text-white/60 mb-4">Share this code with your coach at the venue to start the session</p>
                <div className="flex justify-center gap-3 mb-4">
                  {booking.otp.split('').map((digit, idx) => (
                    <div key={idx} className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">{digit}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-purple-300">
                  ⚠️ Keep this code private until you meet your coach
                </p>
              </div>
            </div>
          )}

          {/* Client Notes */}
          {booking.notes && (
            <div className="mt-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-md font-semibold text-white mb-2">Your Notes</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Session overview</h3>
            <p className="text-sm leading-relaxed text-white/70">{booking.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-4">
                <p className="text-sm font-semibold text-white mb-2">What to bring</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    Personal cricket gear & bottle
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    Training attire & comfortable shoes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    Previous session notes (if any)
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white mb-2">Coach assurances</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Certified professional with background verification
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Personalized training plan tailored to your goals
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Safety protocols & injury prevention focus
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Next steps</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Session confirmed</p>
                  <p className="text-sm text-white/60">We have notified {booking.provider} about your booking.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <Clock className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Warm-up reminder</p>
                  <p className="text-sm text-white/60">A reminder will be sent 2 hours before the session to help you prepare.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <MapPin className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Venue assistance</p>
                  <p className="text-sm text-white/60">Reach out if you need help with directions or parking information.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 z-20 border-t border-white/10 bg-gradient-to-t from-[#111111] via-[#0b0b0b] to-transparent px-4 py-4 backdrop-blur-xl">
        {booking.status === 'confirmed' || booking.status === 'ongoing' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-transparent"
              onClick={handleCancelBooking}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleMarkComplete}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => router.push(`/client/inbox?booking=${encodeURIComponent(booking["#"])}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message coach
            </Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Calendar className="mr-2 h-4 w-4" />
              Reschedule session
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Booking Full Page */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCancelDialog(false);
                setCancelNotes('');
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Cancel Booking</div>
              <div className="text-xs font-mono text-white/60">ID: {booking?.["#"]}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-500/30">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Cancel Booking</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-white/90">Booking Overview</h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        {booking?.status}
                      </span>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-400">Service</p>
                      <p className="text-base font-medium text-white">{booking?.service}</p>
                    </div>
                    <div className="border-t border-gray-600/30 pt-3 mt-3">
                      <div className="text-center space-y-1">
                        <p className="text-sm text-gray-400">Coach</p>
                        <p className="text-lg font-medium text-white">{booking?.provider}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancel Reason */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Reason for cancellation <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    value={cancelNotes}
                    onChange={(e) => setCancelNotes(e.target.value)}
                    placeholder="Please provide a reason for cancelling this booking..."
                    className="min-h-[120px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-gray-500">{cancelNotes.length}/500</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white transition-all duration-200 text-sm"
                    onClick={() => {
                      setShowCancelDialog(false);
                      setCancelNotes('');
                    }}
                  >
                    Go Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg shadow-red-600/25 transition-all duration-200 text-sm whitespace-nowrap"
                    onClick={confirmCancelBooking}
                    disabled={!cancelNotes.trim()}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Full Page */}
      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCompleteDialog(false);
                setReview('');
                setRating(0);
                setSelectedChips([]);
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Mark Booking Complete</div>
              <div className="text-xs font-mono text-white/60">ID: {booking?.["#"]}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/20 border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Mark as Complete</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Please rate your experience with this coach and provide feedback.
                    </p>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-white/90">Booking Overview</h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                        completing
                      </span>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-400">Service</p>
                      <p className="text-base font-medium text-white">{booking?.service}</p>
                    </div>
                    <div className="border-t border-gray-600/30 pt-3 mt-3">
                      <div className="text-center space-y-1">
                        <p className="text-sm text-gray-400">Coach</p>
                        <p className="text-lg font-medium text-white">{booking?.provider}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-white">
                    How would you rate your experience? <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-all duration-200 ${
                            star <= rating
                              ? 'text-yellow-400 scale-110 drop-shadow-sm'
                              : 'hover:text-yellow-400/50 hover:scale-105'
                          }`}
                          style={star <= rating ? {} : { color: '#404040' }}
                        >
                          <Star className="w-12 h-12 fill-current" />
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      {rating > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-wide ring-1 ring-gray-500/30">
                          <span className="text-lg">
                            {rating === 1 ? '😞' : rating === 2 ? '😐' : rating === 3 ? '😊' : rating === 4 ? '😄' : '🤩'}
                          </span>
                          <span className={`font-bold text-sm tracking-wider ${
                            rating === 1 ? 'text-red-400' :
                            rating === 2 ? 'text-orange-400' :
                            rating === 3 ? 'text-yellow-400' :
                            rating === 4 ? 'text-blue-400' : 'text-green-400'
                          }`}>
                            {rating === 1 ? 'Poor' :
                             rating === 2 ? 'Fair' :
                             rating === 3 ? 'Good' :
                             rating === 4 ? 'Very Good' : 'Excellent'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-white/60 text-xs italic ring-1 ring-gray-500/30 px-2 py-0.5 rounded-full">
                          Tap to rate
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Chips */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    What did you love? <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Professional coaching',
                      'Clear communication',
                      'Punctual sessions',
                      'Expert knowledge',
                      'Friendly approach',
                      'Good facilities'
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSelectedChips(prev =>
                            prev.includes(chip)
                              ? prev.filter(c => c !== chip)
                              : [...prev, chip]
                          );
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedChips.includes(chip)
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                            : 'bg-[#111111] border-gray-600/50 text-gray-300 hover:bg-[#1E1E1E]'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Additional feedback <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience, what went well, and any suggestions..."
                    className="min-h-[100px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-gray-500">{review.length}/500</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white transition-all duration-200 text-sm"
                    onClick={() => {
                      setShowCompleteDialog(false);
                      setReview('');
                      setRating(0);
                      setSelectedChips([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg shadow-green-600/25 transition-all duration-200 text-sm whitespace-nowrap"
                    onClick={confirmMarkComplete}
                    disabled={rating === 0}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
