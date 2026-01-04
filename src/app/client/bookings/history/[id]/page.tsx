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

  useEffect(() => {
    if (rawId) {
      fetch(`/api/bookings/${rawId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setHistoryItem(data);
          }
        })
        .catch(err => console.error("Failed to fetch booking history", err));
    }
  }, [rawId]);

  // Use the shared Book Again hook with replace navigation
  const { showBookAgain, setShowBookAgain, BookAgainModal } = useBookAgain(
    historyItem || null,
    { useReplace: true }
  );

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
        <div className="container mx-auto px-4 py-3">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 p-0 transition-all duration-200"
                  onClick={() => router.push(`/client/chat/${encodeURIComponent(historyItem.freelancer.name)}`)}
                  aria-label="Message"
                >
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </Button>
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-[64px] pb-[88px]">
        <div className={`relative bg-gradient-to-br ${historyItem.status === 'cancelled' ? 'from-red-500/10 via-red-500/5' : 'from-purple-500/10 via-purple-500/5'} to-transparent`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
          <div className="relative px-4 py-10">
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

        <div className="px-4 pb-24">
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span>Session date</span>
              </div>
              <p className="text-lg font-semibold text-white">{historyItem.date}</p>
              <p className="text-sm text-white/60 mt-1">
                {historyItem.status === 'cancelled' ? 'Session was cancelled' : 'Concluded successfully'}
              </p>
            </div>

            {historyItem.status === 'completed' && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                  <Star className="w-4 h-4 text-purple-300" />
                  <span>Your rating of provider</span>
                </div>
                {historyItem.yourRating > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      {ratingArray.map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/60 mt-1">
                      Reflects your experience with {historyItem.freelancer.name}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-white/60 italic">No rating given</p>
                )}
              </div>
            )}

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
                        {historyItem.duration || 'Hourly Session'}
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
          </div>

          {/* Reviews Section - Show Freelancer's Feedback ABOUT the Client */}
          {historyItem.status === 'completed' && historyItem.clientRating && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Freelancer's Feedback About You</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (historyItem.clientRating?.stars || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/60">
                  Rated {historyItem.clientRating?.stars?.toFixed(1)}/5
                </span>
              </div>

              {historyItem.clientRating?.review ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-white/80 italic">"{historyItem.clientRating.review}"</p>
                </div>
              ) : (
                <p className="text-sm text-white/50 italic">No written review provided.</p>
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
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowBookAgain(true)}
        >
          Book again with {historyItem.freelancer.name}
        </Button>
      </div>

      {/* Book Again Modal - using shared hook */}
      <BookAgainModal />
    </div >
  );
}
