"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Star,
  FileText,
  Shield,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApplications } from "@/contexts/ApplicationsContext";
import { useNavbar } from "@/contexts/NavbarContext";

const statusCopy: Record<string, string> = {
  new: "New Application",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();
  const { applications } = useApplications();

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const rawId = useMemo(() => {
    if (!params || typeof params.id === "undefined") return "";
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    return decodeURIComponent(value);
  }, [params]);

  const application = useMemo(
    () => applications.find((entry) => entry["#"] === rawId),
    [rawId]
  );

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="text-lg">Application not found.</div>
        <Button
          className="mt-4 bg-purple-600 hover:bg-purple-700"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const statusLabel = statusCopy[application.status] ?? application.status;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#111111] via-[#0b0b0b] to-[#050505] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/client/bookings?tab=applications&appFilter=${application?.status || 'new'}`)}
                className="inline-flex items-center p-0 hover:bg-transparent text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                aria-label="Back"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Button>

              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">{application["#"]}</h1>
                <p className="text-white/50 text-xs">{statusLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 p-0 transition-all duration-200"
                onClick={() => router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)}
                aria-label="Message"
              >
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </Button>
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-[64px] pb-[88px]">
        <div className="relative bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_60%)]" />
          <div className="relative px-4 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-purple-500/20 backdrop-blur-xl">
                  <AvatarImage src={application.freelancer.image} alt={application.freelancer.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold text-lg">
                    {application.freelancer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white/60">Freelancer</p>
                  <h2 className="text-2xl font-semibold text-white">
                    {application.freelancer.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="font-medium text-white/80">
                        {application.freelancer.rating}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        {application.freelancer.completedJobs}+ jobs completed
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-300" />
                      <span>{application.freelancer.responseTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">Proposed Rate</p>
                <p className="text-3xl font-semibold text-white">{application.price}</p>
                <p className="text-xs text-white/50 mt-2">Availability: {application.availability}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-24">
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <MapPin className="w-4 h-4 text-purple-300" />
                <span>Preferred Location</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {application.freelancer.location}
              </p>
              <p className="text-sm text-white/60 mt-1">
                Coach is open to nearby venues within 5 km radius.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                <FileText className="w-4 h-4 text-purple-300" />
                <span>Application Summary</span>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                {application.proposal}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Why this coach stands out</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent p-4">
                <p className="text-sm font-semibold text-white mb-2">Expertise</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    High-performance training for advanced players
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    Personalized feedback with video analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-300" />
                    Proven record of 150+ satisfied trainees
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white mb-2">Assurances</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Verified background and certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Commitment to safety and injury prevention
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-300" />
                    Flexible scheduling with 24-hour notice
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Next steps</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Review & decide</p>
                  <p className="text-sm text-white/60">
                    Go through the proposal details and accept or decline the application.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Start a conversation</p>
                  <p className="text-sm text-white/60">
                    Send a message to clarify expectations or request more information.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <Clock className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Schedule a trial session</p>
                  <p className="text-sm text-white/60">
                    Coordinate on a time and venue that suits both parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#111111]/95 backdrop-blur-md px-4 py-4">
        <div className="flex gap-3">
          {application.status === "new" ? (
            <div className="flex flex-1 gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-red-500/20 hover:text-red-100"
              >
                Decline
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Accept
              </Button>
            </div>
          ) : application.status === "accepted" ? (
            <div className="flex flex-1 gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Proceed to Booking
              </Button>
            </div>
          ) : (
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push(`/client/bookings?tab=applications&appFilter=new`)}
            >
              View Other Applications
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
