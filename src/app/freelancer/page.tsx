"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { CircleDollarSign, Calendar, ChevronRight, Star, MapPin, Wallet, TrendingUp, Award, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FreelancerHome() {
  return (
    <div>
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-[340px] bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -right-20 -top-20 w-80 h-80 bg-purple-400 rounded-full blur-3xl opacity-20"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20"
          />
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
        <div className="relative container mx-auto px-4 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-medium text-white/90">Online & Ready for Work</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Welcome back!</h1>
              <p className="text-lg text-white/80 leading-relaxed">
                You have <span className="text-purple-300 font-medium">3 new job recommendations</span> matching your skills
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
            className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 relative group hover:border-purple-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Today's Earnings</h2>
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 break-words truncate w-full">₹2,000</p>
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
              className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 relative group hover:border-purple-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Total Earnings</h2>
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-400 whitespace-nowrap py-0.5 px-1 rounded">
                        <Award className="w-2.5 h-2.5" /> Top 10%
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 break-words truncate w-full">₹24,500</p>
                    <div className="flex items-center gap-2 flex-nowrap min-w-0 w-full overflow-hidden">
                      <p className="text-sm text-white/60 truncate">from 48 jobs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 relative group hover:border-purple-500/30 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="relative">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Active Hours</h2>
                      <span className="inline-flex items-center gap-1 text-xs text-blue-400">
                        <TrendingUp className="w-3 h-3" /> +8h
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 break-words truncate w-full">32.5h</p>
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
          className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 mb-8 relative group hover:border-purple-500/30 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center w-full py-1 px-0">
                {/* Avatar */}
                <motion.div 
                  initial={{ scale: 0.9 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.6 }} 
                  className="relative h-14 w-14 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300 flex-shrink-0"
                >
                  <Image
                    src="/images/avatar.jpg"
                    alt="Profile Picture"
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
                {/* Name and Rating */}
                <div className="flex flex-col justify-center flex-grow min-w-0 ml-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors truncate max-w-[120px]">John Doe</h2>
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
                  className="flex items-center px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200 rounded-xl bg-white/80 hover:bg-purple-50 transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-300 shadow-sm whitespace-nowrap ml-16"
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
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group/card"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Ready to work</p>
                  <p className="text-xs text-white/60">Toggle your availability</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600/50 group-hover:bg-purple-600 transition-colors cursor-pointer">
                  <motion.span 
                    initial={{ x: 0 }}
                    whileHover={{ x: -16 }}
                    className="absolute h-4 w-4 rounded-full bg-white right-1 transition-all duration-300 shadow-sm" 
                  />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 group/card"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">Availability & Service Area</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-white/60">Mon-Fri</span>
                      <span className="mx-1 text-xs text-white/30">|</span>
                      <span className="text-xs text-white/60">9AM-6PM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-white/70 ml-2">Within 10km radius</span>
                    </div>
                  </div>
                </div>
                <a
                  href="/freelancer/availability"
                  tabIndex={0}
                  aria-label="Edit Availability"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
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
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">2 New</span>
            </div>
            <motion.button 
              whileHover={{ x: 3 }}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
          <div className="grid gap-4">
            {[1, 2].map((job, index) => (
              <motion.div 
                key={job}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + (index * 0.1) }}
                className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 relative group hover:border-purple-500/30 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">Plumbing Work</h3>
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
                      <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">₹2,000</span>
                      <p className="text-[10px] text-white/40 font-medium">FIXED PRICE</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/60 mb-4">Need help fixing a leaky faucet and bathroom installation</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                        <Image
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                          alt="Client"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Sarah Wilson</p>
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn(
                                "h-3 w-3",
                                i < 4 ? "text-amber-400" : "text-purple-400/30"
                              )} />
                            ))}
                          </div>
                          <span className="text-xs text-white/60">(4.2)</span>
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
                    >
                      Quick Apply
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Your Skills</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">2 Skills</span>
            </div>
            <motion.button 
              whileHover={{ x: 3 }}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center transition-colors"
            >
              Add New
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 space-y-6 relative group hover:border-purple-500/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L7 11L8.4 9.55L12 13.15L15.6 9.55L17 11L12 16ZM7 19H17V13H7V19ZM7.5 11H16.5L15.25 8H8.75L7.5 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Plumbing</h3>
                    <p className="text-xs text-white/60">3 years experience</p>
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
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V13H3V11L5 6H19L21 11V13H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 19H17V13H7V19ZM7.5 11H16.5L15.25 8H8.75L7.5 11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Electrical</h3>
                    <p className="text-xs text-white/60">1.5 years experience</p>
                  </div>
                </div>
                <span className="text-sm text-white/60">Intermediate</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
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