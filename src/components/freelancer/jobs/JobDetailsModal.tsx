'use client';

import { X, MessageCircle, Phone, MapPin, CalendarIcon, ClockIcon, IndianRupee, ArrowLeft, AlertCircle, User, UserCheck, Star, ChevronDown, ChevronUp, CheckCircle, ThumbsUp, Award, Heart, Zap, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CancellationDetails {
  cancelledBy: 'client' | 'freelancer';
  cancelledAt: string;
  notes?: string;
}

interface ClientInfo {
  name: string;
  phoneNumber?: string;
  rating?: number;
  jobsCompleted?: number;
  image?: string;
  memberSince?: string;
  freelancerAvatars?: string[];
  freelancersWorked?: number;
  moneySpent?: number;
  location?: string;
}

interface JobDetailsModalProps {
  job: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    payment: string | number;
    duration: string;
    category: string;
    experienceLevel: string;
    skills: string[];
    status?: 'upcoming' | 'completed' | 'cancelled' | 'confirmed' | 'pending';
    client?: ClientInfo;
    jobDate?: string;
    jobTime?: string;
    cancellationDetails?: CancellationDetails;
    completedAt?: string;
    earnings?: {
      amount: number;
      platformFee: number;
      total: number;
    };
    clientRating?: {
      stars: 1 | 2 | 3 | 4 | 5;
      feedback: string;
      date: string;
    };
  };
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`bg-white/5 rounded-lg border border-white/10 overflow-hidden ${className}`}>
      <button 
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
};

export function JobDetailsModal({ job }: JobDetailsModalProps) {
  const router = useRouter();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hasRated, setHasRated] = useState(false);
  
  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.back();
  };
  
  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rating submitted:', { rating, feedback });
    setHasRated(true);
    setShowRatingForm(false);
  };

  // Handle button actions
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Initiate chat with client');
    // Implement chat functionality here
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.client?.phoneNumber) {
      console.log('Calling client at', job.client.phoneNumber);
      // Implement call functionality here
    }
  };

  const handleCancelJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to cancel this job?')) {
      console.log('Job cancelled');
      // Implement job cancellation logic here
    }
  };

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Mark this job as complete?')) {
      console.log('Job marked as complete');
      // Implement job completion logic here
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white/80" />
        </button>
        <div className="ml-4">
          <div className="text-sm font-medium text-white">
            {job.status === 'upcoming' || job.status === 'confirmed' || job.status === 'pending' 
              ? 'Upcoming Job' 
              : job.status === 'completed' 
                ? 'Completed Job' 
                : 'Cancelled Job'}
          </div>
          <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-[100dvh] w-full pt-20 pb-24">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="space-y-8">
            <div className="relative">
              <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <p className="text-white/70 text-sm">{job.category} • {job.experienceLevel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-0.5">
                      Scheduled Date & Time
                    </h3>
                    <p className="text-white/90">
                      {new Date(job.jobDate || job.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-white/70">{job.jobTime || job.time}</p>
                  </div>
                </div>

                {job.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-white/60 mb-0.5">Location</h3>
                      <p className="text-white/90">{job.location}</p>
                      <button className="mt-1 text-sm text-purple-400 hover:underline flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        View on map
                      </button>
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
                    <p className="text-xs text-white/60 mt-1">Payment will be released upon job completion</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white/60 mb-0.5">Estimated Duration</h3>
                    <p className="text-white/90">{job.duration || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {job.description && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Job Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white/80">{job.description}</p>
                </div>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 text-sm rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Client Info Section */}
            {job.client && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Client Profile</h3>
                <div className="p-6 bg-[#111111] rounded-xl border border-gray-800/80">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      {job.client?.image ? (
                        <img 
                          src={job.client.image} 
                          alt={job.client.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-medium">{job.client?.name || 'Unknown Client'}</h2>
                      <p className="text-sm text-gray-400">{job.client?.location || 'Location not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">Job Posted</h3>
                        <p className="text-sm">
                          {new Date(job.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">Member Since</h3>
                        <p className="text-sm">
                          {job.client?.memberSince ? 
                            new Date(job.client.memberSince).getFullYear() : 
                            new Date().getFullYear() - 1}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {job.client?.freelancerAvatars?.length ? (
                                job.client.freelancerAvatars.map((avatar: string, i: number) => (
                                  <img 
                                    key={i}
                                    src={avatar}
                                    alt={`Freelancer ${i + 1}`}
                                    className="w-7 h-7 rounded-full border-2 border-[#111111] object-cover"
                                  />
                                ))
                              ) : (
                                Array.from({ length: Math.min(3, job.client?.freelancersWorked || 1) }).map((_, i) => (
                                  <div key={i} className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-purple-300" />
                                  </div>
                                ))
                              )}
                              {job.client?.freelancersWorked && job.client.freelancersWorked > 3 && (
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                                  <span className="text-xs font-medium text-purple-300">
                                    +{job.client.freelancersWorked - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-300 font-medium">
                                {job.client?.freelancersWorked || 0} Freelancers
                              </p>
                              <p className="text-xs text-gray-500">Worked with this client</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < Math.floor(job.client?.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-white">
                                {job.client?.rating?.toFixed(1) || '5.0'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Client Rating</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-medium text-gray-400 mb-1">Money Spent</h3>
                          <p className="text-sm font-medium">
                            ₹{(job.client?.moneySpent || 0).toLocaleString('en-IN')}+
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">On DoodLance</p>
                          <p className="text-xs text-green-400">
                            {job.client?.jobsCompleted || 0} {job.client?.jobsCompleted === 1 ? 'Project' : 'Projects'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for upcoming/pending jobs */}
            {(job.status === 'upcoming' || job.status === 'pending' || job.status === 'confirmed') && (
              <div className="mt-6 p-4 bg-[#111111] rounded-xl border border-gray-800/80">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <button 
                    onClick={handleChat}
                    className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                  <button 
                    onClick={handleCall}
                    className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button 
                    onClick={handleCancelJob}
                    className="px-4 py-3 rounded-lg bg-transparent hover:bg-red-900/20 text-red-400 border border-red-900/50 hover:border-red-800/70 transition-colors text-sm font-medium flex items-center justify-center gap-2 col-span-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel Job
                  </button>
                  <button 
                    onClick={handleMarkComplete}
                    className="px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white border border-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 col-span-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              </div>
            )}

            {/* Only show Chat button for completed jobs */}
            {job.status === 'completed' && (
              <div className="mt-6 p-4 bg-[#111111] rounded-xl border border-gray-800/80">
                <div className="flex">
                  <button 
                    onClick={handleChat}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with Client
                  </button>
                </div>
              </div>
            )}

            {/* Job Status Specific Sections */}
            {job.status === 'completed' && (
              <div className="space-y-4">
                <div className="w-full text-center py-3 bg-green-900/10 rounded-lg border border-green-900/20">
                  <p className="text-green-400 mb-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-900/20 text-green-400 border border-green-800/50">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Job Completed on {new Date(job.completedAt || job.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-green-300">
                    {job.client?.name || 'The client'} has marked this job as completed.
                  </p>
                </div>

                {job.earnings && (
                  <div className="p-4 bg-[#111111] rounded-lg border border-white/5">
                    <h3 className="text-sm font-medium text-white/80 mb-3">Earnings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/60">Amount</span>
                        <span className="text-sm font-medium">₹{job.earnings.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/60">Platform Fee</span>
                        <span className="text-sm">-₹{job.earnings.platformFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-white/90">Total Earned</span>
                          <span className="text-sm font-medium text-green-400">₹{job.earnings.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {job.clientRating ? (
                  <div className="p-4 bg-[#111111] rounded-lg border border-white/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white/80 mb-1">Your Rating</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < (job.clientRating?.stars || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                            />
                          ))}
                          <span className="ml-2 text-sm text-white/70">{job.clientRating?.stars?.toFixed(1) || '0.0'}</span>
                        </div>
                        {job.clientRating.feedback && (
                          <p className="mt-2 text-sm text-white/70">"{job.clientRating.feedback}"</p>
                        )}
                        <p className="mt-1 text-xs text-white/50">
                          Rated on {new Date(job.clientRating.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowRatingForm(true)}
                        className="text-xs text-purple-400 hover:text-purple-300"
                      >
                        Edit Rating
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowRatingForm(true)}
                    className="w-full py-3 px-4 text-sm font-medium text-center text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Rate This Client
                  </button>
                )}
              </div>
            )}

            {job.status === 'cancelled' && job.cancellationDetails && (
              <div className="p-4 bg-[#1a0a0a] rounded-lg border border-red-900/50">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/20 text-red-400 border border-red-800/30 whitespace-nowrap">
                          {job.cancellationDetails.cancelledBy === 'client' ? (
                            <User className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          ) : (
                            <UserCheck className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          )}
                          {job.cancellationDetails.cancelledBy === 'client' ? 'Cancelled by Client' : 'Cancelled by You'}
                        </span>
                      </div>
                      <span className="text-xs text-white/60 whitespace-nowrap">
                        {new Date(job.cancellationDetails.cancelledAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {job.cancellationDetails.notes && (
                      <div className="p-3 -mx-1 bg-black/20 rounded-md border border-white/5">
                        <p className="text-sm leading-relaxed text-white/80">{job.cancellationDetails.notes}</p>
                      </div>
                    )}
                    
                    <div className="pt-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-3 text-xs text-white/60 hover:text-white/80 hover:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle message click
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                        Message Client
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      

    </div>
  );
}
