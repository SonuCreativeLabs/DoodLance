"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Phone, Star, Briefcase, Shield, CheckCircle2, X, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookings } from "@/lib/mock/bookings";
import { useNavbar } from "@/contexts/NavbarContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statusCopy: Record<string, string> = {
  ongoing: "Ongoing",
  confirmed: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

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

  const confirmCancelBooking = async () => {
    if (!cancelNotes.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    if (!booking) return;

    try {
      const response = await fetch(`/api/bookings/${booking["#"]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          notes: cancelNotes
        }),
      });

      if (response.ok) {
        alert('Booking cancelled successfully!');
        setShowCancelDialog(false);
        setCancelNotes('');
        // Update booking status in the mock data or refetch
        booking.status = 'cancelled';
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleMarkComplete = () => {
    setShowCompleteDialog(true);
  };

  const confirmMarkComplete = async () => {
    if (!review.trim()) {
      alert('Please provide a review before marking as complete.');
      return;
    }

    if (!booking) return;

    try {
      const response = await fetch(`/api/bookings/${booking["#"]}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          rating: rating,
          review: review
        }),
      });

      if (response.ok) {
        alert('Booking marked as complete!');
        setShowCompleteDialog(false);
        setReview('');
        setRating(5);
        // Update booking status in the mock data or refetch
        booking.status = 'completed';
      } else {
        const errorData = await response.json();
        alert(`Failed to complete booking: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  const booking = useMemo(() => bookings.find((entry) => entry["#"] === rawId), [rawId]);

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
              <p className="text-lg font-semibold text-white">{booking.date}</p>
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
              variant="outline"
              className="border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500"
              onClick={handleCancelBooking}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Booking
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

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="w-[320px] max-w-[320px] bg-[#111111] border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-500/20">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <DialogTitle className="text-white">Cancel Booking</DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-gray-400">
              Are you sure you want to cancel this booking? This action cannot be undone and may affect your rating.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-notes" className="text-sm font-medium text-white">
                Reason for cancellation *
              </Label>
              <Textarea
                id="cancel-notes"
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Please provide a reason for cancelling this booking..."
                className="mt-2 min-h-[100px] bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-gray-700 text-white hover:bg-gray-800"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelNotes('');
              }}
            >
              Go Back
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              onClick={confirmCancelBooking}
              disabled={!cancelNotes.trim()}
            >
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="w-[400px] max-w-[400px] bg-[#111111] border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <DialogTitle className="text-white">Mark Booking as Complete</DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-gray-400">
              Please rate your experience with this coach and provide feedback before marking the booking as complete.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                Rate your experience *
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1 rounded transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm text-white/70">
                  {rating === 1 ? 'Poor' :
                   rating === 2 ? 'Fair' :
                   rating === 3 ? 'Good' :
                   rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-white mb-3 block">
                What did you love about this experience? (Optional)
              </Label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  'Professional coaching',
                  'Clear communication',
                  'Punctual sessions',
                  'Expert knowledge',
                  'Friendly approach',
                  'Good facilities',
                  'Value for money',
                  'Skill improvement'
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      const currentReview = review;
                      const phrase = currentReview.includes(chip)
                        ? currentReview.replace(chip, '').trim()
                        : `${currentReview} ${chip}`.trim();
                      setReview(phrase);
                    }}
                    className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                      review.includes(chip)
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <Label htmlFor="review" className="text-sm font-medium text-white">
                Additional feedback (optional)
              </Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share more details about your experience..."
                className="mt-2 min-h-[100px] bg-gray-900 border-gray-700 text-white"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-gray-700 text-white hover:bg-gray-800"
              onClick={() => {
                setShowCompleteDialog(false);
                setReview('');
                setRating(5);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              onClick={confirmMarkComplete}
            >
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
