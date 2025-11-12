"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Star, MapPin, TrendingUp, Award, Clock, Users, Target, Award as AwardIcon, Dumbbell, Trophy } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useLayout } from "@/contexts/LayoutContext"
import { useRouter } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function FreelancerHome() {
  const { showHeader, showNavbar } = useLayout();
  const router = useRouter();
  const [jobCount, setJobCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

  useEffect(() => {
    // Always show header and navbar for the home page
    showHeader();
    showNavbar();
  }, [showHeader, showNavbar]);

  useEffect(() => {
    // Import jobs data and filter logic dynamically
    Promise.all([
      import('@/app/freelancer/feed/data/jobs'),
      import('@/app/freelancer/feed/types')
    ]).then(([jobsModule]) => {
      // User's skills for personalized job matching (should match the ones in feed/page.tsx)
      const userSkills = ['RH Batsman', 'Sidearm Specialist', 'Off Spin', 'Batting coach', 'Analyst', 'Mystery Spin'];
      
      // Filter jobs to match the "For You" tab logic
      const forYouJobs = jobsModule.jobs.filter(job => {
        // Combine job title, description, category, and skills into a single searchable string
        const jobText = [
          job.title || '',
          job.description || '',
          job.category || '',
          ...(job.skills || [])
        ].join(' ').toLowerCase();
        
        // Check if any of the user's skills match the job
        return userSkills.some(skill => 
          jobText.includes(skill.toLowerCase())
        );
      });
      
      setJobCount(forYouJobs.length);
      // Take the first 2 jobs for the home page
      setRecommendedJobs(forYouJobs.slice(0, 2));
    }).catch(error => {
      console.error('Failed to load jobs:', error);
    });
  }, []);

  const handleJobClick = (job: any) => {
    router.push(`/freelancer/feed?jobId=${job.id}`);
  };

  const handleQuickApply = (job: any) => {
    // Navigate to the feed page with job details open
    router.push(`/freelancer/feed?jobId=${job.id}`);
  };
  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[150px] overflow-hidden rounded-b-3xl mx-3 -mt-1"
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
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center py-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-green-400 rounded-full opacity-75 animate-ping"></div>
                <div className="absolute inset-0.5 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-white/90">
                Online & Ready for Work
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">Welcome back, <span className="text-white font-extrabold">Sonu</span>!</h1>
              <p className="text-[15px] md:text-[16px] text-white/80 leading-tight">
                You have{' '}
                <a 
                  href="/freelancer/feed"
                  className="inline-flex items-center gap-1 px-2 py-0.5 -mx-1 rounded-md hover:bg-white/5 transition-colors group"
                >
                  <span className="font-bold text-purple-200 group-hover:text-white">{jobCount} new jobs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-300 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <span className="ml-1">matching your skills</span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12 bg-[#111111] relative z-0">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Your Dashboard</h2>
          <p className="text-white/60">Overview of your freelancing activities and earnings</p>
        </motion.div>

        {/* Earnings Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg"
          >

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Today&apos;s Earnings</h2>
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">₹2,000</p>
              <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                <p className="text-sm text-white/60 truncate">From 3 completed jobs</p>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
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
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-400 font-medium whitespace-nowrap mt-0.5"><Award className="w-2.5 h-2.5" /> Top 10%</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">₹24,500</p>
                    <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                      <p className="text-sm text-white/60 truncate">from 11 jobs</p>
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
                      <span className="inline-flex items-center gap-1 text-xs text-blue-400 mt-0.5">
                        <TrendingUp className="w-3 h-3" /> +8h
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] mb-2 break-words truncate w-full">32.5h</p>
                    <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                      <p className="text-sm text-white/60 truncate">This week</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Your Profile Section */}
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
                  <Image
                    src="/images/profile-sonu.jpg"
                    alt="Profile Picture"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </motion.div>
                {/* Name and Rating */}
                <div className="flex flex-col justify-center flex-grow min-w-0 ml-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-0 w-full">
    {/* Name + Rating */}
    <div className="flex flex-row items-center gap-3 min-w-0 w-full">
      <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight max-w-full whitespace-nowrap overflow-visible">Sathish Sonu</h2>
      <span className="flex items-center px-1.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-300/30 ml-1 sm:ml-3 gap-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#fbbf24" className="h-3 w-3 flex-shrink-0">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
        <span className="text-xs font-semibold text-yellow-300">4.8</span>
      </span>
    </div>
    {/* Edit Icon stays here on desktop */}
  </div>
  <div className="flex flex-row items-center gap-2 mt-1">
    <span className="text-sm font-medium text-purple-400">Cricketer & AI Engineer</span>
  </div>
</div>
                {/* Edit Icon Button */}
                <Link
                  href="/freelancer/profile/personal"
                  className="ml-3 p-1 rounded-full hover:bg-[#9334e9]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9334e9] flex items-center justify-center"
                  title="Edit Profile"
                  aria-label="Edit Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit-2 h-4 w-4 text-white/70 hover:text-white/90"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 3 21l.5-4.5Z"/></svg>
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
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 group-hover:bg-green-600 transition-colors cursor-pointer shadow-inner">
                  <span className="sr-only">Toggle availability</span>
                  <span className={`absolute h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${true ? 'translate-x-6' : 'translate-x-1'}`}></span>
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
                      <span className="text-xs text-white/60">Mon-Fri</span>
                      <span className="mx-1 text-xs text-white/30">|</span>
                      <span className="text-xs text-white/60">9AM-6PM</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-white/70">Within 10km radius</span>
                    </div>
                  </div>
                </div>
                <a
                  href="/freelancer/profile/availability"
                  tabIndex={0}
                  aria-label="Edit Availability"
                  className="text-sm font-medium text-white/70 hover:text-white/90 transition-colors duration-200"
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  Edit
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* Recommended Jobs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-200">Recommended Jobs</h2>
            <Link href="/freelancer/feed?tab=for-you">
              <motion.button 
                whileHover={{ x: 3 }}
                className="text-white/70 hover:text-white/90 text-sm font-medium flex items-center transition-colors duration-200"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </Link>
          </div>
          <div className="grid gap-4">
            {recommendedJobs.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (index * 0.1) }}
                className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10"
                onClick={() => handleJobClick(job)}
              >
                <div className="space-y-2">
                  {/* Job header with client profile */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="relative flex-shrink-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20 group-hover:ring-white/30 transition-all duration-300">
                        <Image
                          src={job.clientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.clientName || 'Client')}&background=6B46C1&color=fff&bold=true`}
                          alt="Client"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {job.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed mb-1">{job.description}</p>

                  {/* Location and Date */}
                  <div className="flex items-center justify-between text-[12px] text-white/60 mb-2">
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate" title={job.location}>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Clock className="w-3 h-3 flex-shrink-0 text-white/50" />
                      <span className="text-white/60 text-[11px] whitespace-nowrap">
                        {job.scheduledAt ? (() => {
                          const demoDate = new Date('2024-12-15T15:30:00.000Z');
                          const date = demoDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          const time = demoDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          return `${date}, ${time}`;
                        })() : 'Date TBD'}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-1">
                    {(job.skills || []).slice(0, 2).map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/70 backdrop-blur-sm whitespace-nowrap"
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.skills || []).length > 2 && (
                      <span className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/50 whitespace-nowrap">
                        +{(job.skills || []).length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[17px] font-semibold text-white">
                        ₹{job.rate?.toLocaleString()}
                      </span>
                      <span className="text-[13px] text-white/60">
                        / {job.priceUnit}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickApply(job);
                      }}
                      className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 flex items-center justify-center gap-1.5 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                    >
                      <span>Quick Apply</span>
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {recommendedJobs.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <p className="text-sm">No recommended jobs found at the moment.</p>
                <p className="text-xs mt-1">Try updating your skills or check back later!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skills Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          {/* Skills Header - Moved outside the card */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Skills</h2>
            <Link href="/freelancer/profile/skills">
              <motion.button 
                whileHover={{ x: 3 }}
                className="text-white/70 hover:text-white/90 text-sm font-medium flex items-center transition-colors duration-200"
              >
                Add New
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl px-5 py-3 border border-white/10 transition-all duration-300 shadow-lg"
          >
            {/* Skills content */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex-shrink-0 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">Cricket Coaching</h3>
                    <p className="text-xs text-gray-400/80 font-medium mt-0.5">5 years experience</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 ml-2 whitespace-nowrap">Expert</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 w-full my-2"></div>

            <div className="py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600/20 to-gray-700/20 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">Cricket Analyst</h3>
                    <p className="text-xs text-gray-400/80 font-medium mt-0.5">3 years experience</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 ml-2 whitespace-nowrap">Intermediate</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}