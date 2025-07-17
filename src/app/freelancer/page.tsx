"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { CircleDollarSign, Calendar, ChevronRight, Star, MapPin, Wallet, TrendingUp, Award, Clock, Users, Target, Award as AwardIcon, Dumbbell, Code, Trophy } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function FreelancerHome() {
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    // Import jobs data and filter logic dynamically
    Promise.all([
      import('@/app/freelancer/feed/data/jobs'),
      import('@/app/freelancer/feed/types')
    ]).then(([jobsModule, typesModule]) => {
      // User's skills for personalized job matching (should match the ones in feed/page.tsx)
      const userSkills = ['cricket', 'developer'];
      
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
    }).catch(error => {
      console.error('Failed to load jobs:', error);
    });
  }, []);
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
                <h2 className="text-lg font-semibold text-white">Today's Earnings</h2>
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
            {/* Junior Cricket Coach Job */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg"
            >
  
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white group-hover:opacity-90 transition-colors">Junior Cricket Coach</h3>
                      <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">Urgent</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Posted 2h ago
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/30"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 2.5 km away
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea]">₹2,000</span>
                    <p className="text-[10px] text-white/40 font-medium">PER SESSION</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-4">Looking for an experienced cricket coach for junior team training sessions (ages 10-14). Must have experience coaching beginners.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 text-white text-xs rounded-full backdrop-blur-sm">
                    <Users className="w-3 h-3" />
                    Junior Coaching
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 text-white text-xs rounded-full backdrop-blur-sm">
                    <Target className="w-3 h-3" />
                    Batting Specialist
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-[#6B46C1]/30 group-hover:ring-[#6B46C1]/50 transition-all duration-300">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                        alt="Client"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--purple-light)] group-hover:opacity-90 transition-colors">Sarah Wilson</p>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = 4.5; // Sarah's rating
                            const fillAmount = Math.min(Math.max(rating - star + 1, 0), 1);
                            const fillPercentage = fillAmount * 100;
                            return (
                              <div key={star} className="relative h-3 w-3">
                                <Star className="absolute h-3 w-3 text-gray-300" fill="none" />
                                {fillAmount > 0 && (
                                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                    <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-xs text-white/60">(4.5)</span>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
                  >
                    Quick Apply
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Cricket Net Bowler Job */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl p-6 border border-white/10 transition-all duration-300 shadow-lg"
            >
  
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white group-hover:opacity-90 transition-colors">Cricket Net Bowler</h3>
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium">New</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Posted 1d ago
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/30"></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 5 km away
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea]">₹1,500</span>
                    <p className="text-[10px] text-white/40 font-medium">PER HOUR</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-4">Need a right-arm fast bowler for net practice sessions. Must maintain consistent line and length. Prior experience in club cricket preferred.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 text-white text-xs rounded-full backdrop-blur-sm">
                    <Dumbbell className="w-3 h-3" />
                    Fast Bowling
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/10 text-white text-xs rounded-full backdrop-blur-sm">
                    <AwardIcon className="w-3 h-3" />
                    Club Experience
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-[#6B46C1]/30 group-hover:ring-[#6B66D1]/50 transition-all duration-300">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Raj"
                        alt="Client"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--purple-light)] group-hover:opacity-90 transition-colors">Raj Patel</p>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = 3.3; // Raj's rating
                            const fillAmount = Math.min(Math.max(rating - star + 1, 0), 1);
                            const fillPercentage = fillAmount * 100;
                            return (
                              <div key={star} className="relative h-3 w-3">
                                <Star className="absolute h-3 w-3 text-gray-300" fill="none" />
                                {fillAmount > 0 && (
                                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                    <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-xs text-white/60">(3.3)</span>
                      </div>
                    </div>
                  </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
                    >
                      Quick Apply
                    </motion.button>
                  </div>
                </div>
              </motion.div>
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
                    <Code className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">Full-Stack Developer</h3>
                    <p className="text-xs text-gray-400/80 font-medium mt-0.5">1.5 years experience</p>
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