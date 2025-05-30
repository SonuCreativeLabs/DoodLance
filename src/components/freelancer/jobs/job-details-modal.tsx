'use client';

import { X, MessageCircle, MapPin, CalendarIcon, ClockIcon, IndianRupee, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface JobDetailsModalProps {
  job: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    payment: string;
    duration: string;
    category: string;
    experienceLevel: string;
    skills: string[];
  };
}

export function JobDetailsModal({ job }: JobDetailsModalProps) {
  const router = useRouter();
  
  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.back();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
      >
        <div className="min-h-[100dvh] w-full pt-16 pb-24">
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 p-4">
            <button 
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
          </div>
          
          <div className="max-w-6xl mx-auto p-4 md:p-6">
          
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50">
                    {job.category}
                  </span>
                  {job.experienceLevel && (
                    <span className="text-sm text-white/60">
                      {job.experienceLevel}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">₹{job.payment}</div>
                <div className="text-sm text-white/60">Fixed Price</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-0.5">Date & Time</h3>
                    <p className="text-white/90">
                      {new Date(job.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-white/70">{job.time}</p>
                  </div>
                </div>

                {job.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-white/60 mb-0.5">Location</h3>
                      <p className="text-white/90">{job.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IndianRupee className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-0.5">Payment</h3>
                    <p className="text-white/90">₹{job.payment} <span className="text-sm text-white/60">/ job</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-0.5">Duration</h3>
                    <p className="text-white/90">{job.duration || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {job.description && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Job Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80 leading-relaxed">{job.description}</p>
                </div>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/5 text-white/80 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
              <Button 
                variant="outline" 
                className="bg-transparent border-white/10 hover:bg-white/5"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle message click
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Client
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle apply click
                }}
              >
                Apply for Job
              </Button>
            </div>
          </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
