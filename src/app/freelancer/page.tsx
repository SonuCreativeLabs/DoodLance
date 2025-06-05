"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { CircleDollarSign, Calendar, ChevronRight, Star, MapPin, Wallet, TrendingUp, Award, Clock, Users, Target, Award as AwardIcon, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FreelancerHome() {
  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[360px] overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Main Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600"></div>
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-purple-500/80 to-purple-400/90 animate-gradient-x"></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
          
          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
          
          {/* Wave SVG */}
          <svg
            className="absolute bottom-0 w-full h-32"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="#111111"
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pt-12 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium text-white/90">Online & Ready for Work</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Welcome back!</h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                You have <span className="text-purple-200 font-medium">3 new job recommendations</span> matching your skills
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12 bg-[#111111] relative z-0">

        {/* Earnings Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
              className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
              className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
          className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20 mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
                <div className="flex flex-col justify-center flex-grow min-w-0 ml-1">
                  <div className="flex items-center gap-4">
                    <h2 className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] group-hover:opacity-90 transition-colors truncate max-w-[120px]">John Doe</h2>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#fbbf24" className="h-4 w-4 flex-shrink-0">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                      <span className="text-sm text-white font-semibold">4.8</span>
                      <span className="text-xs text-white/70">(120 reviews)</span>
                    </span>
                  </div>
                </div>
                {/* Edit Icon Button */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-2.5 py-1 text-xs font-semibold text-white border border-[#9334e9] rounded-xl bg-[#9334e9] hover:bg-[#7f2bcf] transition-all duration-200 outline-none focus:ring-2 focus:ring-[#9334e9] shadow-md whitespace-nowrap ml-16 shadow-[#9334e9]/30"
                  title="Edit Profile"
                  aria-label="Edit Profile"
                >
                  Edit Profile
                </motion.button>
              </div>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 shadow-lg shadow-purple-900/10"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[#B794F4]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] group-hover:opacity-90 transition-colors">Ready to work</p>
                  <p className="text-xs text-white/60">Toggle your availability</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#9334e9] group-hover:bg-[#7f2bcf] transition-colors cursor-pointer shadow-inner">
                  <span className="sr-only">Toggle availability</span>
                  <span className={`absolute h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${true ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 shadow-lg shadow-purple-900/10"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#B794F4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] group-hover:opacity-90 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">Availability & Radius</p>
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
                  href="/freelancer/availability"
                  tabIndex={0}
                  aria-label="Edit Availability"
                  className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#b16bf3] to-[#9334e9] hover:from-[#c08af5] hover:to-[#a24ae8] transition-all duration-300"
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
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Recommended Jobs</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#bf82fb]/20 text-transparent bg-clip-text bg-gradient-to-r from-[#bf82fb] to-[#9537ea] text-xs font-medium">2 New</span>
            </div>
            <motion.button 
              whileHover={{ x: 3 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#b16bf3] to-[#9334e9] hover:from-[#c08af5] hover:to-[#a24ae8] text-sm font-medium flex items-center transition-all duration-300"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
          <div className="grid gap-4">
            {/* Junior Cricket Coach Job */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
                    className="px-4 py-2 bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
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
              className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
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
                      className="px-4 py-2 bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-[#6B46C1]/10 via-[#4C1D95]/10 to-[#2D1B69]/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/10 hover:border-purple-500/30 relative transition-all duration-300 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20 space-y-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-transparent rounded-2xl"></div>
            
            {/* Skills Header */}
            <div className="relative z-10">
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-white">Your Skills</h2>
                  <motion.button 
                    whileHover={{ x: 3 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#b16bf3] to-[#9334e9] hover:from-[#c08af5] hover:to-[#a24ae8] text-sm font-medium flex items-center transition-all duration-300"
                  >
                    Add New
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-[#B794F4] to-[#805AD5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16ZM7 19H17V13H7V19ZM7.5 11H16.5L15.25 8H8.75L7.5 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:opacity-90 transition-colors">Cricket Coaching</h3>
                    <p className="text-xs text-white/60">5 years coaching experience</p>
                  </div>
                </div>
                <span className="text-sm text-white/60">Expert</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "90%" }}
                    transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                  />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6B46C1]/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-[#B794F4] to-[#805AD5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V13H3V11L5 6H19L21 11V13H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 19H17V13H7V19ZM7.5 11H16.5L15.25 8H8.75L7.5 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:opacity-90 transition-colors">Developer</h3>
                    <p className="text-xs text-white/60">1.5 years experience</p>
                  </div>
                </div>
                <span className="text-sm text-white/60">Intermediate</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" 
                  />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}