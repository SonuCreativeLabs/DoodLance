"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Star, MapPin, TrendingUp, Award, Clock, Target, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useRouter } from "next/navigation"
import { useSkills } from "@/contexts/SkillsContext"
import { usePersonalDetails } from "@/contexts/PersonalDetailsContext"
import { useAvailability } from "@/contexts/AvailabilityContext"
import { useForYouJobs } from "@/contexts/ForYouJobsContext"
import type { Job } from "./feed/types"
import { getWorkModeLabel, getJobDurationLabel } from "./feed/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardCardSkeleton } from "@/components/freelancer/skeletons/DashboardCardSkeleton"
import { ProfileCardSkeleton } from "@/components/freelancer/skeletons/ProfileCardSkeleton"
import { useAuth } from "@/contexts/AuthContext"

export const dynamic = 'force-dynamic'

export default function FreelancerHome() {
  const { showHeader, showNavbar } = useLayout();
  const router = useRouter();
  const { skills } = useSkills();
  const { forYouJobs } = useForYouJobs();
  const { personalDetails, toggleReadyToWork } = usePersonalDetails();
  const { getWorkingHoursText } = useAvailability();
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Always show header and navbar for the home page
    showHeader();
    showNavbar();
  }, [showHeader, showNavbar]);

  useEffect(() => {
    // Use the first 2 jobs from the shared forYouJobs context
    setJobCount(forYouJobs.length);
    setRecommendedJobs(forYouJobs.slice(0, 2));
  }, [forYouJobs]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingStats(true);
        const response = await fetch(`/api/freelancer/stats?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [user?.id]);

  // Simulate profile loading (personalDetails loads via context)
  useEffect(() => {
    if (personalDetails.name) {
      setIsLoadingProfile(false);
    }
  }, [personalDetails.name]);

  const handleJobClick = (job: Job) => {
    router.push(`/freelancer/feed?jobId=${job.id}`);
  };

  const handleQuickApply = (job: Job) => {
    // Navigate to the feed page with job details open
    router.push(`/freelancer/feed?jobId=${job.id}`);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#111111] pb-16 sm:pb-20 lg:pb-24">
        {/* Render a loading skeleton that matches the initial server output if possible, or just a safe empty container */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] pb-16 sm:pb-20 lg:pb-24">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[120px] sm:min-h-[140px] md:min-h-[150px] overflow-hidden rounded-b-2xl sm:rounded-b-3xl mx-2 sm:mx-3 -mt-1"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Main Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 rounded-b-3xl"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-purple-500/80 to-purple-400/90 animate-gradient-x rounded-b-3xl"></div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-30 rounded-b-3xl" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>

          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl"></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-b-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-3 sm:py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl space-y-2 sm:space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
              <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2">
                {personalDetails.readyToWork && (
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-75 animate-ping"></div>
                )}
                <div className={`absolute inset-0.5 rounded-full ${personalDetails.readyToWork ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white/90">
                {personalDetails.readyToWork ? 'Match Ready' : 'In the Pavilion'}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-0.5 sm:mb-1">Welcome back, <span className="text-white font-extrabold">{personalDetails.name || 'User'}</span>!</h1>
              <p className="text-sm sm:text-[15px] md:text-[16px] text-white/80 leading-tight">
                You have{' '}
                <a
                  href="/freelancer/jobs?tab=upcoming"
                  className="inline-flex items-center gap-1 px-2 py-0.5 -mx-1 rounded-md hover:bg-white/5 transition-colors group"
                >
                  <span className="font-bold text-purple-200 group-hover:text-white">{stats?.upcomingJobs || 0} upcoming jobs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-300 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 bg-[#111111] relative z-0">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Your Dashboard</h2>
          <p className="text-sm sm:text-base text-white/60">Overview of your freelancing activities and earnings</p>
        </motion.div>

        {/* Earnings Cards Section */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {isLoadingStats ? (
            <>
              <div className="col-span-2 lg:col-span-1">
                <DashboardCardSkeleton />
              </div>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg col-span-2 lg:col-span-1"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Today&apos;s Earnings</h2>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">₹{stats?.todayEarnings?.toLocaleString() || 0}</p>
                  <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                    <p className="text-sm text-white/60 truncate">
                      {stats?.todayJobs || 0} job{stats?.todayJobs !== 1 ? 's' : ''} completed
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg"
              >
                <div className="relative">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Total Earnings</h2>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">₹{stats?.totalEarnings?.toLocaleString() || 0}</p>
                      <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                        <p className="text-sm text-white/60 truncate">
                          {stats?.totalJobs || 0} total job{stats?.totalJobs !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg"
              >
                <div className="relative">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Active Hours</h2>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">{stats?.activeHours || 0}h</p>
                      <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                        <p className="text-sm text-white/60 truncate">This week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Your Profile Section */}
        {isLoadingProfile ? (
          <ProfileCardSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg mb-8"
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center w-full py-1 px-0">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative h-14 w-14 rounded-2xl overflow-hidden ring-2 ring-[#6B46C1]/40 flex-shrink-0"
                  >
                    <Avatar className="h-full w-full rounded-2xl">
                      <AvatarImage src={personalDetails.avatarUrl} alt="Profile Picture" className="object-cover" />
                      <AvatarFallback className="rounded-2xl bg-[#2a2a2a] text-white">
                        {personalDetails.name ? personalDetails.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  {/* Name and Rating */}
                  <div className="flex flex-col justify-center flex-grow min-w-0 ml-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-0 w-full">
                      {/* Name + Rating */}
                      <div className="flex flex-row items-center gap-3 min-w-0 w-full">
                        <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight max-w-full whitespace-nowrap overflow-visible">{personalDetails.name || 'Your Name'}</h2>
                        <span className="flex items-center px-1.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-300/30 ml-1 sm:ml-3 gap-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#fbbf24" className="h-3 w-3 flex-shrink-0">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                          <span className="text-xs font-semibold text-yellow-300">New</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-purple-400">{personalDetails.title || 'Freelancer'}</span>
                    </div>
                  </div>
                  {/* Edit Icon Button */}
                  <Link
                    href="/freelancer/profile/personal"
                    className="ml-3 p-1 rounded-full hover:bg-[#9334e9]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9334e9] flex items-center justify-center"
                    title="Edit Profile"
                    aria-label="Edit Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2 h-4 w-4 text-white/70 hover:text-white/90"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 3 21l.5-4.5Z" /></svg>
                  </Link>
                </div>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-900/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[#B794F4]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:opacity-90 transition-colors">Ready to work</p>
                    <p className="text-xs text-white/60">Toggle your availability</p>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shadow-inner ${personalDetails.readyToWork ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                    onClick={() => toggleReadyToWork()}
                  >
                    <span className="sr-only">Toggle availability</span>
                    <span className={`absolute h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${personalDetails.readyToWork ? 'translate-x-6' : 'translate-x-1'}`}></span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-purple-900/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-[#B794F4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:opacity-90 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">Availability & Radius</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-white/40" />
                        <span className="text-xs text-white/60 truncate" title={getWorkingHoursText()}>
                          {getWorkingHoursText()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommended Jobs Section Removed */}


        {/* Skills Section Removed */}
      </div>
    </div>
  );
}