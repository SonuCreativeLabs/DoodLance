"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Users, DollarSign, Bookmark } from 'lucide-react';

import { Job } from '../types';

interface JobFeedProps {
  jobs: Job[];
}

export default function JobFeed({ jobs }: JobFeedProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-white/60 text-sm">No jobs found</p>
      </div>
    );
  }

  console.log('Rendering JobFeed with jobs:', jobs);

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/10"
          >
            <div className="space-y-5">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-300 flex-shrink-0">
                    <img 
                      src={job.companyLogo} 
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300 truncate">
                        {job.title}
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white/40 hover:text-purple-400 transition-colors duration-300 flex-shrink-0 sm:hidden"
                      >
                        <Bookmark className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <p className="text-sm text-white/60 mt-1">{job.company}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden sm:block text-white/40 hover:text-purple-400 transition-colors duration-300 flex-shrink-0"
                >
                  <Bookmark className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Description */}
              <p className="text-sm text-white/80 leading-relaxed">{job.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/80 border border-white/10 group-hover:border-purple-500/30 transition-all duration-300 hover:bg-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">{job.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{job.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{job.proposals} proposals</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-5 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-medium transition-all duration-300 border border-purple-500/30"
                >
                  <Briefcase className="w-4 h-4" />
                  Apply Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
