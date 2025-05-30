import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, ClockIcon, MessageCircle } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Job } from './types';
import { getStatusStyles, formatTimeRemaining } from './utils';

interface JobCardProps {
  job: Job;
  index: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const router = useRouter();
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/freelancer/jobs/${job.id}`);
  };
  
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle message button click
    console.log('Message button clicked for job:', job.id);
  };

  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full px-0 cursor-pointer"
      onClick={handleCardClick}
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
            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
              <div className="flex items-start gap-2 text-white/60">
                <CalendarIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/40">Date & Time</div>
                  <div className="text-white/80">{format(new Date(job.date), 'MMM d, yyyy')} • {job.time}</div>
                </div>
              </div>
              {job.location && (
                <div className="flex items-start gap-2 text-white/60">
                  <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/40">Location</div>
                    <div className="text-white/80">{job.location}</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 text-white/60">
                <IndianRupee className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/40">Payment</div>
                  <div className="text-white/80">₹{job.payment} <span className="text-xs">/job</span></div>
                </div>
              </div>
              {job.experienceLevel && (
                <div className="flex items-start gap-2 text-white/60">
                  <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40">Experience</div>
                    <div className="text-white/80">{job.experienceLevel}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 bg-transparent hover:bg-white/5 border-white/10 text-white/80 hover:text-white"
              onClick={handleMessageClick}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex-1 flex items-center justify-center gap-2 text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
              onClick={handleCardClick}
            >
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
