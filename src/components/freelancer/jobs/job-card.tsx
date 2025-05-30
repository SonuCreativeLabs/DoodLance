import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, FileText, ClockIcon } from 'lucide-react';
import { IndianRupee } from 'lucide-react';

import { Job } from './types';
import { getStatusStyles, formatTimeRemaining } from './utils';
import { getMatchingSkills } from './mock-data';

interface JobCardProps {
  job: Job;
  index: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full px-0"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-white/10 transition-all duration-200 w-full shadow-lg hover:shadow-purple-500/10"
      >
        <div className="space-y-5">
          {/* Job Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).bg} ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).text} text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).border} ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).shadow} backdrop-blur-sm`}>
                  {job.status === 'pending' || job.status === 'confirmed' ? 'Upcoming' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </div>
                {(job.status === 'pending' || job.status === 'confirmed') && (
                  <div className="text-xs font-medium bg-gray-800/50 text-gray-300 px-2.5 py-1.5 rounded-full border border-gray-700/50 backdrop-blur-sm flex items-center gap-1.5">
                    <ClockIcon className="w-3 h-3 text-gray-400" />
                    <span className="font-mono">{formatTimeRemaining(`${job.date}T${job.time}`)}</span>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
              {job.title}
            </h3>
            
            {/* Job Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {job.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50">
                  {job.category}
                </span>
              )}
              {job.experienceLevel && (
                <span className="text-white/60">
                  {job.experienceLevel}
                </span>
              )}
              {job.duration && (
                <span className="flex items-center text-white/60">
                  <ClockIcon className="w-3.5 h-3.5 mr-1" />
                  {job.duration}
                </span>
              )}
            </div>
            
            {/* Skills */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-white/60">Skills:</span>
                <span className="text-xs text-white/40">
                  {getMatchingSkills(job.skills).length} of {job.skills?.length || 0} match
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skills?.slice(0, 6).map((skill, i) => {
                  const isMatching = getMatchingSkills(job.skills).includes(skill);
                  return (
                    <span 
                      key={i} 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                        isMatching 
                          ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
                {job.skills && job.skills.length > 6 && (
                  <span className="text-xs text-white/40 self-center">
                    +{job.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-white/80 leading-relaxed">{job.description}</p>
          )}

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <CalendarIcon className="w-4 h-4 text-purple-400" />
              <span>{format(new Date(job.date), 'MMM d, yyyy')} • {job.time}</span>
            </div>
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-white/60">
              <IndianRupee className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-white/80">₹{job.payment}</span>
              <span className="text-sm">/job</span>
            </div>
          </div>

          {/* View Details Button */}
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-black/30 border-gray-700 hover:bg-gray-800/50 hover:border-purple-500/50 text-white/90 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
