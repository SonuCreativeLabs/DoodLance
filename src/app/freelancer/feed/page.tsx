"use client"

import { motion } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, Clock, Users, DollarSign, Bookmark } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Full Stack Developer Needed for E-commerce Platform",
    description: "Looking for an experienced full stack developer to help build a modern e-commerce platform. Must have experience with React, Node.js, and PostgreSQL.",
    budget: "$5,000 - $8,000",
    duration: "2-3 months",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    postedAt: "2 hours ago",
    location: "Remote",
    proposals: 12,
    company: "TechCorp Solutions",
    companyLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=techcorp"
  },
  {
    id: 2,
    title: "Mobile App Developer for Health & Fitness App",
    description: "Need a skilled mobile developer to create a health and fitness tracking app. Experience with React Native and API integration required.",
    budget: "$3,000 - $5,000",
    duration: "1-2 months",
    skills: ["React Native", "iOS", "Android", "API Integration"],
    postedAt: "5 hours ago",
    location: "Remote",
    proposals: 8,
    company: "HealthTech Innovations",
    companyLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=healthtech"
  }
]

export default function FeedPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 bg-[#111111]/95"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">Job Feed</h1>
            <p className="text-white/60">Discover opportunities that match your skills</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white text-sm font-medium transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            Filter Jobs
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text"
            placeholder="Search for jobs..."
            className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500/30 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-6xl mx-auto space-y-6">
        {mockJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 backdrop-blur-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                        {job.title}
                      </h2>
                      <p className="text-sm text-white/60 mt-1">{job.company}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/40 hover:text-purple-400 transition-colors duration-300"
                  >
                    <Bookmark className="w-5 h-5" />
                  </motion.button>
                </div>

                <p className="text-sm text-white/80 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-lg text-sm bg-white/5 text-white/80 border border-white/10 group-hover:border-purple-500/30 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{job.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{job.proposals} proposals</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 