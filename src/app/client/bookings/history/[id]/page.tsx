"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  Star,
  Award,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Camera,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useNavbar } from "@/contexts/NavbarContext";
import { useBookAgain } from "@/hooks/useBookAgain";

export default function BookingHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const rawId = useMemo(() => {
    if (!params || typeof params.id === "undefined") return "";
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    return decodeURIComponent(value);
  }, [params]);

  const [historyItem, setHistoryItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (rawId) {
      setLoading(true);
      fetch(`/api/bookings/${encodeURIComponent(rawId)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setHistoryItem(data);
          }
        })
        .catch(err => console.error("Failed to fetch booking history", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [rawId]);

  // Use the shared Book Again hook with replace navigation
  const { showBookAgain, setShowBookAgain, BookAgainModal } = useBookAgain(
    historyItem || null,
    { useReplace: true }
  );





  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] text-white">
        {/* Header Skeleton */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-32 bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto pt-[64px] pb-[88px]">
          {/* Banner Skeleton */}
          <div className="relative bg-gradient-to-br from-white/5 to-transparent pt-10 pb-10 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 bg-white/5" />
                  <Skeleton className="h-6 w-40 bg-white/10" />
                  <Skeleton className="h-3 w-24 bg-white/5" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-3 w-20 bg-white/5 ml-auto" />
                <Skeleton className="h-8 w-32 bg-white/10 ml-auto" />
                <Skeleton className="h-3 w-40 bg-white/5 ml-auto" />
              </div>
            </div>
          </div>

          <div className="px-4 pb-24 space-y-8 mt-8">
            {/* Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white/5" />
              ))}
            </div>

            {/* Feedback Skeleton */}
            <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!historyItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="text-lg">History entry not found.</div>
        <Button
          className="mt-4 bg-purple-600 hover:bg-purple-700"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const ratingArray = Array.from({ length: historyItem.yourRating });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5">
        <div className="container max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/client/bookings?tab=history')}
                className="inline-flex items-center p-0 hover:bg-transparent text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                aria-label="Back"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Button>

              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">{historyItem["#"]}</h1>
                <p className="text-white/50 text-xs">{historyItem.status.toUpperCase()} • {historyItem.title}</p>
              </div>
            </div>

            {/* Chat/Call only for Completed or Active (not Cancelled) - assuming we still want to contact after completion? */}
            {historyItem.status !== 'cancelled' && (
              <div className="flex items-center gap-2">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 p-0 transition-all duration-200"
                  onClick={() => router.push(`/client/chat/${encodeURIComponent(historyItem.freelancer.name)}`)}
                  aria-label="Message"
                >
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </Button> */}
                {historyItem.status !== 'completed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 p-0 transition-all duration-200"
                    aria-label="Call"
                    onClick={() => {
                      // Use phone from freelancer data
                      const phone = historyItem.freelancer.phone || '';
                      if (phone) {
                        window.location.href = `tel:${phone.replace(/\s/g, '')}`;
                      }
                    }}
                  >
                    <Phone className="h-4 w-4 text-purple-400" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-[64px] pb-[88px]">
        <div className={`relative bg-gradient-to-br ${historyItem.status === 'cancelled' ? 'from-red-500/10 via-red-500/5' : 'from-purple-500/10 via-purple-500/5'} to-transparent`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
          <div className="relative px-4 py-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-purple-500/20 backdrop-blur-xl">
                  <AvatarImage
                    src={historyItem.freelancer.image}
                    alt={historyItem.freelancer.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold text-lg">
                    {historyItem.freelancer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white/60">Provider</p>
                  <h2 className="text-2xl font-semibold text-white">
                    {historyItem.freelancer.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="font-medium text-white/80">
                        {historyItem.freelancer.rating}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">
                  {historyItem.status === 'cancelled' ? 'Amount Refunded' : 'Total Paid'} (approx)
                </p>
                {/* For cancelled jobs, we assume refund or 0 paid mostly, but displaying price contextually */}
                <p className={`text-3xl font-semibold ${historyItem.status === 'cancelled' ? 'text-white/70 line-through decoration-red-500/50' : 'text-white'}`}>
                  {historyItem.earnedMoney}
                </p>
                <p className="text-xs text-white/50 mt-2">
                  {historyItem.status === 'cancelled' ? 'Cancelled on' : 'Completed on'} {historyItem.completedDate || historyItem.date}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-24 max-w-3xl mx-auto w-full">
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span>Session date</span>
              </div>
              <p className="text-lg font-semibold text-white">{historyItem.date} {historyItem.time ? ` at ${historyItem.time}` : ''}</p>
              <p className="text-sm text-white/60 mt-1">
                {historyItem.status === 'cancelled' ? 'Session was cancelled' : 'Concluded successfully'}
              </p>
            </div>

            {historyItem.status === 'cancelled' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl border-red-500/20">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                  <ThumbsDown className="w-4 h-4 text-red-400" />
                  <span>Cancellation Reason</span>
                </div>
                <p className="text-sm text-white/80">
                  {historyItem.cancellationNotes || 'No reason provided.'}
                </p>
              </div>
            )}

            {/* Enhanced Session Recap */}
            {historyItem.status === 'completed' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span>Session Recap</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs text-white/40 uppercase mb-1">Service Booked</h4>
                    <p className="text-sm text-white/80 font-medium">
                      {historyItem.title}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h4 className="text-xs text-white/40 uppercase mb-1">Duration</h4>
                      <p className="text-sm text-white/80">
                        {historyItem.duration || '60 mins'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs text-white/40 uppercase mb-1">Venue</h4>
                      <p className="text-sm text-white/80 truncate">
                        {historyItem.location || 'Remote'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {historyItem.status === 'completed' && historyItem.clientRating && (
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                  <Star className="w-4 h-4 text-purple-300" />
                  <span>Freelancer's Feedback</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (historyItem.clientRating?.stars || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/80 italic mb-3">
                  {historyItem.clientRating?.review ? `"${historyItem.clientRating.review}"` : "No written review provided."}
                </p>
                {historyItem.clientRating?.feedbackChips && historyItem.clientRating.feedbackChips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {historyItem.clientRating.feedbackChips.map((chip: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Your Rating of Provider - Now Full Width at Bottom */}
          {historyItem.status === 'completed' && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Your Rating of Provider</h3>

              {historyItem.yourRating && (typeof historyItem.yourRating === 'object' || historyItem.yourRating > 0) ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < ((historyItem.yourRating?.stars || historyItem.yourRating) || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/60">
                      Rated {((historyItem.yourRating?.stars || historyItem.yourRating) || 0)}/5
                    </span>
                  </div>

                  {/* Review Text */}
                  {historyItem.yourRating?.review ? (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4">
                      <p className="text-sm text-white/80 italic">"{historyItem.yourRating.review}"</p>
                    </div>
                  ) : (
                    <p className="text-sm text-white/50 italic mb-4">No written review provided.</p>
                  )}

                  {/* Chips - Updated to Purple & Larger */}
                  {(historyItem.yourRating?.feedbackChips || historyItem.yourRating?.chips) &&
                    (historyItem.yourRating.feedbackChips || historyItem.yourRating.chips).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(historyItem.yourRating.feedbackChips || historyItem.yourRating.chips).map((chip: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                  {!historyItem.yourRating?.review && !historyItem.yourRating?.feedbackChips && (
                    <p className="text-sm text-white/60 mt-1">
                      Reflects your experience with {historyItem.freelancer.name}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-white/60 italic">No rating given</p>
              )}
            </div>
          )}

          {/* Cancellation Info - Only for Cancelled */}
          {historyItem.status === 'cancelled' && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl border-red-500/10">
              <h3 className="text-lg font-semibold text-white mb-3">Cancellation Details</h3>
              <p className="text-sm text-white/70">
                This booking was cancelled. If you have been charged incorrectly, please contact support.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#111111]/95 backdrop-blur-md px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowBookAgain(true)}
          >
            Book again with {historyItem.freelancer.name}
          </Button>
        </div>
      </div>

      {/* Book Again Modal - using shared hook */}
      <BookAgainModal />
    </div >
  );
}
