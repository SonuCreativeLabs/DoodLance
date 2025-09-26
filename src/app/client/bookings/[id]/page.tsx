"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Phone, Star, Briefcase, Shield, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookings } from "@/lib/mock/bookings";
import { useNavbar } from "@/contexts/NavbarContext";

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

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const rawId = useMemo(() => {
    if (!params || typeof params.id === "undefined") return "";
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    return decodeURIComponent(value);
  }, [params]);

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
      <div className="sticky top-0 z-30 border-b border-white/5 bg-gradient-to-b from-[#1a1a1a] to-[#111111] backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-11 w-11 rounded-xl hover:bg-purple-500/10 transition-all duration-200"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </Button>

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-white/40">{statusLabel.toUpperCase()}</p>
            <h1 className="text-base font-semibold text-white truncate">{booking["#"]}</h1>
            <p className="text-xs text-white/60 truncate">{booking.service}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 rounded-xl hover:bg-purple-500/10 transition-all duration-200"
            aria-label="Call"
          >
            <Phone className="h-5 w-5 text-purple-400" />
          </Button>
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
      </div>
    </div>
  );
}
