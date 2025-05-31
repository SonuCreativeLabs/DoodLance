'use client';

import { X, MessageCircle, MapPin, CalendarIcon, ClockIcon, IndianRupee, ArrowLeft, AlertCircle, User, UserCheck, Star, ChevronDown, ChevronUp, CheckCircle, ThumbsUp, Award, Heart, Zap, MessageSquare, Search, FileText } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CancellationDetails {
  cancelledBy: 'client' | 'freelancer';
  cancelledAt: string;
  notes?: string;
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
    client?: {
      name: string;
      rating?: number;
      jobsCompleted?: number;
    };
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
    // Handle rating submission
    console.log('Rating submitted:', { rating, feedback });
    setHasRated(true);
    setShowRatingForm(false);
    
    // In a real app, you would send this to your backend
    // await api.submitClientRating(job.id, { rating, feedback });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto">
      <div className="min-h-[100dvh] w-full pt-16 pb-24">
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
        
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="space-y-8">
            <div className="relative">
              <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                <p className="text-white/70 text-sm">{job.category} • {job.experienceLevel}</p>
              </div>
              
              {job.client && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium text-white/80 mb-2">Client Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                      {job.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{job.client.name}</p>
                      {job.client.rating && (
                        <div className="flex items-center text-sm text-yellow-400">
                          ★ {job.client.rating.toFixed(1)}
                          {job.client.jobsCompleted && (
                            <span className="ml-2 text-white/60">• {job.client.jobsCompleted} jobs</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="pt-6 border-t border-white/10">
              {job.status === 'upcoming' && (
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-white/10 hover:bg-white/5 w-full sm:w-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle message click
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Client
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-white/10 hover:bg-white/5 text-red-400 hover:text-red-300 hover:border-red-400/30 w-full sm:w-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle cancel job
                      }}
                    >
                      Cancel Job
                    </Button>
                  </div>
                  
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle job completion
                    }}
                  >
                    Mark as Complete
                  </Button>
                </div>
              )}
              
              {job.status === 'completed' && (
                <div className="space-y-6">
                  {/* Completion Status */}
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
                    <p className="text-sm text-white/70">
                      Thanks for completing this job! Your payment is being processed.
                    </p>
                  </div>
                  
                  {/* Action Buttons for Completed Jobs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="h-12 px-6 border-white/20 hover:bg-white/10 hover:text-white/90 transition-colors flex-1"
                      onClick={() => {
                        console.log('Message client clicked');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Client
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-12 px-6 border-purple-400/30 text-purple-400 hover:bg-purple-900/20 hover:border-purple-400/50 hover:text-purple-300 transition-colors flex-1"
                      onClick={() => {
                        console.log('View invoice clicked');
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoice
                    </Button>
                  </div>

                  {/* Your Earnings */}
                  <CollapsibleSection title="Your Earnings">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Amount earned</span>
                        <span className="font-medium">₹{typeof job.payment === 'number' ? job.payment.toLocaleString() : job.payment}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-white/60">
                        <span>Platform fee ({job.earnings?.platformFee ? (job.earnings.platformFee / Number(job.payment) * 100) : 10}%)</span>
                        <span>- ₹{job.earnings?.platformFee || Math.round(Number(job.payment) * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-white/10 my-1"></div>
                      <div className="flex justify-between items-center font-medium">
                        <span>Total earnings</span>
                        <span className="text-lg">
                          ₹{job.earnings?.total?.toLocaleString() || (typeof job.payment === 'number' 
                            ? Math.round(job.payment * 0.9).toLocaleString() 
                            : Math.round(Number(job.payment) * 0.9).toLocaleString())}
                        </span>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Rating Section */}
                  {job.clientRating ? (
                    <CollapsibleSection title="Client's Feedback">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-5 h-5 ${star <= job.clientRating!.stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-white/60">
                            {job.clientRating.date && new Date(job.clientRating.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">"{job.clientRating.feedback}"</p>
                        
                        <div className="pt-3 border-t border-white/10">
                          <h4 className="text-sm font-medium text-white/80 mb-2">What they loved:</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Professionalism', 'Quality of Work', 'Communication'].map((item) => (
                              <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900/20 text-green-400 border border-green-800/30">
                                <ThumbsUp className="w-3 h-3 mr-1.5" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleSection>
                  ) : showRatingForm ? (
                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                      <h3 className="font-medium text-white mb-3">Rate Your Client</h3>
                      <form onSubmit={handleSubmitRating}>
                        <div className="flex items-center justify-center mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              key={star}
                              type="button"
                              className="p-1"
                              onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                            >
                              <Star 
                                className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 mb-3"
                          rows={3}
                          placeholder="Share details about your experience (optional)"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowRatingForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Submit Rating
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <Button 
                      variant={hasRated ? 'default' : 'outline'}
                      className={`w-full ${hasRated ? 'bg-green-600 hover:bg-green-700' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90'}`}
                      onClick={hasRated ? undefined : () => setShowRatingForm(true)}
                    >
                      {hasRated ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          You've Rated This Client
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Rate Your Client
                        </>
                      )}
                    </Button>
                  )}

                  {/* Ask for Review Button */}
                  {!job.clientRating && !showRatingForm && !hasRated && (
                    <Button 
                      variant="ghost" 
                      className="w-full bg-white/5 hover:bg-white/10 text-white/90"
                      onClick={() => {
                        // Handle ask for review
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Rating from Client is Pending
                    </Button>
                  )}

                  {/* Message Client Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message click
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Client
                  </Button>
                </div>
              )}
              
              {job.status === 'cancelled' && job.cancellationDetails && (
                <div className="space-y-4">
                  <div className="w-full p-4 bg-red-900/10 border border-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
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
                  
                  {/* Action Buttons for Cancelled Jobs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 px-6 border-white/20 hover:bg-white/10 hover:text-white/90 transition-colors flex-1"
                      onClick={() => {
                        console.log('Message client clicked');
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Client
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-12 px-6 border-blue-400/30 text-blue-400 hover:bg-blue-900/20 hover:border-blue-400/50 hover:text-blue-300 transition-colors flex-1"
                      onClick={() => {
                        console.log('Find similar jobs clicked');
                      }}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Similar Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons for Upcoming Jobs */}
            {(job.status === 'upcoming' || job.status === 'confirmed' || job.status === 'pending') && (
              <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-4 px-4 z-40">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 justify-end">
                  <Button 
                    variant="outline" 
                    className="h-12 px-6 border-white/20 hover:bg-white/10 hover:text-white/90 transition-colors flex-1 sm:flex-initial"
                    onClick={() => {
                      // Handle message client
                      console.log('Message client clicked');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-12 px-6 border-red-400/30 text-red-400 hover:bg-red-900/20 hover:border-red-400/50 hover:text-red-300 transition-colors flex-1 sm:flex-initial"
                    onClick={() => {
                      // Handle cancel job
                      console.log('Cancel job clicked');
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Job
                  </Button>
                  
                  <Button 
                    className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all flex-1 sm:flex-initial"
                    onClick={() => {
                      // Handle mark as complete
                      console.log('Mark as complete clicked');
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
