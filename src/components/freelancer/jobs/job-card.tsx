import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, ClockIcon, MessageCircle, User, Star, IndianRupee } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Job } from './types';
import { getStatusStyles, formatTime12Hour } from './utils';

interface JobCardProps {
  job: Job & { isProposal?: boolean };
  index: number;
  onStatusChange?: (jobId: string, newStatus: 'completed' | 'cancelled' | 'started') => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index, onStatusChange }) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to proposal details for proposal jobs, job details for regular jobs
    // Encode the job ID to handle special characters like #
    const encodedId = encodeURIComponent(job.id);
    if (job.isProposal) {
      router.push(`/freelancer/proposals/${encodedId}`);
    } else {
      router.push(`/freelancer/jobs/${encodedId}`);
    }
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to freelancer inbox with jobId query param to auto-select the chat
    // We encode the job ID to handle any special characters
    const encodedId = encodeURIComponent(job.id);
    router.push(`/freelancer/inbox?jobId=${encodedId}`);
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
        className={`p-5 rounded-xl bg-[#1E1E1E] border w-full shadow-lg ${job.isProposal
          ? 'border-l-4 border-l-blue-500 border-t-white/5 border-r-white/5 border-b-white/5'
          : 'border-white/5'
          }`}
      >
        <div className="space-y-4">
          {/* Status and Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${getStatusStyles(job.status).bg} ${getStatusStyles(job.status).text} text-xs font-medium px-3 py-1 rounded-full border ${getStatusStyles(job.status).border} w-fit`}>
                {job.status === 'ongoing' || job.status === 'started' ? 'Ongoing' :
                  job.status === 'pending' ? 'Upcoming' :
                    job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <span className="font-mono text-xs">
                {job.id}
              </span>
            </div>
          </div>

          {/* Job Title and Client */}
          <div>
            <h3 className="text-base font-medium text-white line-clamp-2 mb-1">
              {job.title}
            </h3>
            {job.client && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>{job.client.name}</span>
              </div>
            )}
          </div>

          {/* Job Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 text-white/60">
              <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
                <CalendarIcon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <div className="text-sm text-white/90">
                  {(() => {
                    // 1. Prioritize legacy date/time fields as they are the source of truth for existing data
                    if (job.date && job.time) {
                      const dateObj = new Date(job.date);
                      if (!isNaN(dateObj.getTime())) {
                        const friendlyDate = dateObj.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        });
                        // job.time is already formatted like "1:00 PM" or "10:00 PM"
                        return `${friendlyDate} at ${job.time}`;
                      }
                      // Fallback if date parsing fails
                      return `${job.date} at ${job.time}`;
                    }

                    // 2. Fallback to scheduledAt (for future or migrated jobs where date/time might be missing)
                    const dateStr = job.scheduledAt || job.jobDate;

                    if (!dateStr) return 'Date not specified';

                    try {
                      const dateObj = new Date(dateStr);
                      // If invalid date
                      if (isNaN(dateObj.getTime())) return dateStr;

                      // Format to ensure local time is displayed, matching JobDetailsPage
                      const formattedDate = dateObj.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'Asia/Kolkata'
                      });
                      const formattedTime = dateObj.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata'
                      });

                      return `${formattedDate} at ${formattedTime}`;
                    } catch (e) {
                      return dateStr;
                    }
                  })()}
                </div>
              </div>
            </div>
            {job.location && (
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/40">Location</div>
                  <div className="text-white/80 line-clamp-1">
                    {job.location.split(',').slice(0, -1).join(',').trim() || job.location}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 text-white/60">
              <IndianRupee className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-white/40">Payment</div>
                <div className="text-white/80">₹{Math.round(Number(job.payment) / 1.05)}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-white/60">
              <ClockIcon className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-white/40">Duration</div>
                <div className="text-white/80">{job.duration || 'Flexible'}</div>
              </div>
            </div>
          </div>

          {/* Rating and Review for Completed Jobs */}
          {(job.status === 'completed' || job.status === 'delivered') && job.clientRating && (
            <div className="pt-3 border-t border-white/10">
              <div className="space-y-2">
                {/* Show client rating */}
                {job.clientRating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < (job.clientRating?.stars || 0)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-400'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/80">
                      {job.clientRating?.stars % 1 === 0
                        ? `${Math.floor(job.clientRating.stars)}/5`
                        : `${job.clientRating.stars.toFixed(2)}/5`} stars
                    </span>
                  </div>
                )}

                {/* Show only stars rating - removed review text and feedback chips */}
                {/*
                {job.clientRating?.feedback && (
                  <p className="text-sm text-white/70 line-clamp-2">
                    "{job.clientRating.feedback}"
                  </p>
                )}

                {job.clientRating?.feedbackChips && job.clientRating.feedbackChips.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {job.clientRating.feedbackChips.slice(0, 3).map((chip: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
                */}

                <div className="text-xs text-white/50 space-y-1">
                  <div>
                    Completed on {job.completedAt ? format(new Date(job.completedAt), 'dd/MM/yyyy') : 'Unknown date'} at {job.completedAt ? format(new Date(job.completedAt), 'HH:mm') : 'Unknown time'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Show for upcoming, pending, confirmed, and ongoing jobs */}
          {(job.status === 'upcoming' || job.status === 'pending' || job.status === 'ongoing') && (
            <div className="flex gap-2 pt-2">
              {/* Call Button */}
              <Button
                variant="default"
                size="sm"
                className="w-full text-white h-9 text-xs font-medium shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, #2131e2 0%, #1d59eb 100%)',
                  boxShadow: '0 4px 14px 0 rgba(33, 49, 226, 0.25)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1d2bcb 0%, #1a4fd3 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2131e2 0%, #1d59eb 100%)';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Check mapped phoneNumber
                  const phone = job.client?.phoneNumber || job.client?.phone;
                  if (phone) {
                    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
                  } else {
                    console.log('No phone number available for this client');
                    alert('No phone number available for this client');
                  }
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Call</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
