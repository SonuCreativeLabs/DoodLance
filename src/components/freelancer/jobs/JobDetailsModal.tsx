'use client';

import { X, MessageCircle, Phone, MapPin, CalendarIcon, ClockIcon, IndianRupee, ArrowLeft, AlertCircle, User, UserCheck, Star, ChevronDown, ChevronUp, CheckCircle, MessageSquare, AlertTriangle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { calculateJobEarnings } from './utils';
import { Job } from './types';

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
  job: Job;
  onClose?: () => void;
  onJobUpdate?: (jobId: string, newStatus: 'completed' | 'cancelled', notes?: string, completionData?: {rating: number, review: string, feedbackChips: string[]}) => void;
  initialShowComplete?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function JobDetailsModal({ job, onClose, onJobUpdate, initialShowComplete = false }: JobDetailsModalProps) {
  console.log('JobDetailsModal received job data:', {
    id: job.id,
    status: job.status,
    hasFreelancerRating: !!job.freelancerRating,
    freelancerRating: job.freelancerRating,
    completedAt: job.completedAt
  });
  const router = useRouter();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(initialShowComplete);
  const [cancelNotes, setCancelNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(0);

  // Calculate earnings preview for the job
  const earningsPreview = calculateJobEarnings(job);

  // Force re-render when job data changes
  useEffect(() => {
    setRenderTrigger(prev => prev + 1);
  }, [job.status, job.freelancerRating]);

  // Helper function to check if 8 hours have passed since completion
  const isWithin8Hours = (completedAt?: string) => {
    if (!completedAt) return true;
    const completionTime = new Date(completedAt).getTime();
    const now = new Date().getTime();
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    return (now - completionTime) < eightHoursInMs;
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Handle button actions
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to inbox with specific job chat selection
    router.push(`/freelancer/inbox?jobId=${job.id}`);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.client?.phoneNumber) {
      // Show phone number and allow user to call
      const phoneNumber = job.client.phoneNumber;
      if (confirm(`Call client at ${phoneNumber}?`)) {
        // In a real app, this would initiate a call
        // For demo purposes, we'll show the number
        alert(`Calling ${phoneNumber}\n\nIn a real application, this would initiate a phone call.`);
      }
    } else {
      alert('Phone number not available for this client.');
    }
  };

  const handleCancelJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Cancel button clicked'); // Debug log
    setShowCancelDialog(true);
  };

  const confirmCancelJob = async () => {
    if (!cancelNotes.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    try {
      console.log('Attempting to cancel job:', job.id);
      console.log('API URL:', `http://localhost:3000/api/jobs/${job.id}`);

      const response = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          notes: cancelNotes,
          cancelledBy: 'freelancer',
          cancelledAt: new Date().toISOString()
        }),
      });

      console.log('Cancel API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Cancel API success:', responseData);
        alert('Job cancelled successfully!');
        setShowCancelDialog(false);
        setCancelNotes('');
        if (onClose) onClose();
        if (onJobUpdate) onJobUpdate(job.id, 'cancelled', cancelNotes);
      } else {
        const errorData = await response.json();
        console.error('Cancel API error response:', errorData);
        alert(`Failed to cancel job: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error cancelling job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      alert(`Failed to cancel job: ${errorMessage}`);
    }
  };

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Mark complete button clicked'); // Debug log
    setShowCompleteDialog(true);
  };

  const confirmMarkComplete = async () => {
    if (rating === 0) {
      alert('Please select a rating before marking as complete.');
      return;
    }

    if (!review.trim()) {
      alert('Please provide additional feedback before marking as complete.');
      return;
    }

    try {
      console.log('Attempting to complete job:', job.id);
      console.log('API URL:', `http://localhost:3000/api/jobs/${job.id}`);

      const response = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          freelancerRating: {
            stars: rating,
            review: review.trim(), // Keep only the review text, not the chips
            feedbackChips: selectedChips,
            date: new Date().toISOString()
          }
        }),
      });

      console.log('Complete API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Complete API success:', responseData);

        // Clear form data first
        setReview('');
        setRating(0);
        setSelectedChips([]);

        // Close modal AFTER data processing is complete
        setShowCompleteDialog(false);

        // Call the parent handler to update the job status
        if (onJobUpdate) {
          onJobUpdate(job.id, 'completed', undefined, {
            rating: rating,
            review: review.trim(), // Keep only the review text, not the chips
            feedbackChips: selectedChips
          });
        }

        alert('Job marked as complete! Payment will be processed shortly.');
      } else {
        const errorData = await response.json();
        console.error('Complete API error response:', errorData);
        alert(`Failed to complete job: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error completing job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      alert(`Failed to complete job: ${errorMessage}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0a0a0a] overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking outside content
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
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
      <div className="min-h-[100dvh] w-full pt-20 pb-24" onClick={(e) => e.stopPropagation()}>
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

            {/* Chat and Call buttons for completed jobs (within 8 hours) */}
            {job.status === 'completed' && isWithin8Hours(job.completedAt) && (
              <div className="mt-6 p-4 bg-[#111111] rounded-xl border border-gray-800/80">
                <div className="grid grid-cols-2 gap-3">
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
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Available for 8 hours after completion
                </p>
              </div>
            )}

            {/* Only Chat for completed jobs (after 8 hours) */}
            {job.status === 'completed' && !isWithin8Hours(job.completedAt) && (
              <div className="mt-6 p-4 bg-[#111111] rounded-xl border border-gray-800/80">
                <button
                  onClick={handleChat}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with Client
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Communication limited after 8 hours
                </p>
              </div>
            )}

            {/* Job Status Specific Sections */}
            {job.status === 'completed' && (
              <div className="space-y-4">
                <div className="w-full text-center py-3 bg-green-900/10 rounded-lg border border-green-900/20">
                  <p className="text-green-400 mb-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-900/20 text-green-400 border border-green-800/50">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Job Completed on {job.completedAt ? new Date(job.completedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date not available'}
                    </span>
                  </p>
                  <p className="text-sm text-green-300">
                    {job.client?.name || 'The client'} has marked this job as completed.
                  </p>
                </div>

                {job.earnings && (
                  <div className="p-4 bg-[#111111] rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-medium text-white/80">Earnings</h3>
                    </div>

                    {/* Total Earnings Summary - Always Visible */}
                    <div className="text-center mb-3 p-3 bg-emerald-900/10 rounded-lg border border-emerald-900/20">
                      <p className="text-xs text-emerald-300 mb-1">Total Earned</p>
                      <p className="text-2xl font-bold text-emerald-400">₹{job.earnings.totalEarnings.toLocaleString()}</p>
                    </div>

                    {/* Collapsible Breakdown */}
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-sm text-white/70 hover:text-white/90 transition-colors list-none">
                        <span className="flex items-center gap-2">
                          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                          View Breakdown
                        </span>
                      </summary>

                      <div className="mt-3 space-y-2 pl-6">
                        {/* Base Amount */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/70">Base Amount</span>
                          <span className="text-white font-medium">₹{job.earnings.baseAmount.toLocaleString()}</span>
                        </div>

                        {/* Tips */}
                        {job.earnings.tips > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white/70">Tips</span>
                            <span className="text-emerald-400 font-medium">+₹{job.earnings.tips.toLocaleString()}</span>
                          </div>
                        )}

                        {/* Add-on Services */}
                        {job.earnings.breakdown?.addOnServices && job.earnings.breakdown.addOnServices.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-white/70">Add-on Services</span>
                              <span className="text-blue-400 font-medium">+₹{job.earnings.addOnServices.toLocaleString()}</span>
                            </div>
                            {job.earnings.breakdown.addOnServices.map((service, index) => (
                              <div key={index} className="flex justify-between items-center text-xs ml-4">
                                <span className="text-white/50">{service.name}</span>
                                <span className="text-blue-300">₹{service.amount.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Platform Commission */}
                        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                          <span className="text-white/70">Platform Fee ({(job.earnings.commissionRate || 0.1) * 100}%)</span>
                          <span className="text-red-400 font-medium">-₹{job.earnings.platformCommission.toLocaleString()}</span>
                        </div>

                        {/* Total Earnings (Repeated for clarity) */}
                        <div className="flex justify-between items-center text-sm font-semibold border-t border-white/20 pt-2">
                          <span className="text-white">Total Earned</span>
                          <span className="text-emerald-400 text-base">₹{job.earnings.totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                )}

                {job.freelancerRating ? (
                  <div className="p-4 bg-[#111111] rounded-lg border border-white/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-white/80 mb-1">Your Rating & Review</h3>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (job.freelancerRating?.stars || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-white/70">
                            {job.freelancerRating?.stars % 1 === 0
                              ? `${Math.floor(job.freelancerRating.stars)}/5`
                              : `${job.freelancerRating.stars.toFixed(2)}/5`}
                          </span>
                        </div>
                        {job.freelancerRating.feedbackChips && job.freelancerRating.feedbackChips.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {job.freelancerRating.feedbackChips.map((chip: string, index: number) => (
                              <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                        {job.freelancerRating.review && (
                          <p className="text-sm text-white/70">&quot;{job.freelancerRating.review}&quot;</p>
                        )}
                        <p className="mt-1 text-xs text-white/50">
                          Submitted on {job.freelancerRating?.date ? new Date(job.freelancerRating.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
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
                        <p className="text-sm leading-relaxed text-white/80">&quot;{job.cancellationDetails.notes}&quot;</p>
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

      {/* Cancel Job Full Page */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCancelDialog(false);
                setCancelNotes('');
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Cancel Job</div>
              <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-500/30">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Cancel Job</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Are you sure you want to cancel this job? This action cannot be undone and may affect your rating.
                    </p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white/80">Job Details</h2>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {job.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 flex-shrink-0">Project:</span>
                      <span className="text-white font-medium text-right break-words max-w-[calc(100%-60px)]">{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment:</span>
                      <span className="text-white font-medium">₹{job.payment}</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason */}
                <div className="space-y-3">
                  <Label htmlFor="cancel-notes" className="text-base font-medium text-white">
                    Reason for cancellation <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="cancel-notes"
                      value={cancelNotes}
                      onChange={(e) => setCancelNotes(e.target.value)}
                      placeholder="Please provide a detailed reason for cancelling this job..."
                      className="min-h-[120px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20 resize-none"
                      maxLength={500}
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {cancelNotes.length}/500
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-gray-800/50 hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={() => {
                      setShowCancelDialog(false);
                      setCancelNotes('');
                    }}
                  >
                    Keep Job Active
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-200"
                    onClick={confirmCancelJob}
                    disabled={!cancelNotes.trim()}
                  >
                    Yes, Cancel Job
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Full Page */}
      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCompleteDialog(false);
                setReview('');
                setRating(0);
                setSelectedChips([]);
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Mark Job Complete</div>
              <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/20 border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Mark Job as Complete</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Please rate your experience and provide feedback before marking the job as complete.
                    </p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-white/80">Job Details</h2>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      {job.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 flex-shrink-0">Project:</span>
                      <span className="text-white font-medium text-right break-words max-w-[calc(100%-60px)]">{job.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment:</span>
                      <span className="text-white font-medium">₹{job.payment}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-white">
                    How would you rate this experience? <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            star <= rating
                              ? 'text-yellow-400 bg-yellow-400/10 scale-110'
                              : 'text-gray-600 hover:text-gray-400 hover:scale-105'
                          }`}
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-white/90">
                        {rating === 0 ? 'Select a rating' :
                         rating === 1 ? 'Poor' :
                         rating === 2 ? 'Fair' :
                         rating === 3 ? 'Good' :
                         rating === 4 ? 'Very Good' : 'Excellent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback Chips - Now Optional */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    What did you love about this experience? <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Professional coaching',
                      'Clear communication',
                      'Punctual sessions',
                      'Expert knowledge',
                      'Friendly approach',
                      'Good facilities',
                      'Value for money',
                      'Skill improvement'
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSelectedChips(prev =>
                            prev.includes(chip)
                              ? prev.filter(c => c !== chip)
                              : [...prev, chip]
                          );
                        }}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedChips.includes(chip)
                            ? 'bg-purple-600/20 border-purple-600/30 text-purple-300'
                            : 'bg-[#111111] border-gray-600 text-gray-300 hover:bg-gray-800/50'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Additional Feedback - Now Mandatory */}
                <div className="space-y-3">
                  <Label htmlFor="review" className="text-base font-medium text-white">
                    Share your experience <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write a brief title for your review..."
                    className="min-h-[100px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-gray-800/50 hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={() => {
                      setShowCompleteDialog(false);
                      setReview('');
                      setRating(0);
                      setSelectedChips([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className={`flex-1 h-10 font-medium shadow-lg transition-all duration-200 ${
                      rating > 0 && review.trim()
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-600/25 hover:shadow-green-600/40'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={confirmMarkComplete}
                    disabled={!(rating > 0 && review.trim())}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
