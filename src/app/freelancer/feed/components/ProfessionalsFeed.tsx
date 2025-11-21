"use client";

import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import JobDetailsFull from './JobDetailsFull';
import OverlayPortal from './OverlayPortal';
import { Job, getWorkModeLabel, getJobDurationLabel } from '../types';
import { useRouter, useSearchParams } from 'next/navigation';

// Define a base professional type with common fields
export type BaseProfessional = {
  id: string | number;
  name?: string;
  title?: string;
  service?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  completedJobs?: number;
  location: string;
  responseTime?: string;
  image?: string;
  avatar?: string;
  distance?: number;
  price?: number;
  rate?: number;
  priceUnit?: string;
  budget?: number;
  coords?: [number, number];
  availability?: string[];
  skills?: string[];
  workMode?: 'remote' | 'onsite' | 'all';
  type?: string;
  postedAt?: string;
  description?: string;
  expertise?: string[];
  experience?: string;
};

interface ProfessionalsFeedProps {
  jobs?: Job[];
  filteredProfessionals?: BaseProfessional[];
  onProfessionalSelect?: (professional: BaseProfessional) => void;
  onJobSelect?: (job: Job) => void;
  onApply?: (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => void;
  className?: string;
}

export default function ProfessionalsFeed({ 
  jobs = [], 
  filteredProfessionals, 
  onProfessionalSelect,
  onJobSelect,
  onApply,
  className = ''
}: ProfessionalsFeedProps) {
  const formatScheduledDate = (scheduledAt: string) => {
    if (!scheduledAt) return 'Date TBD';
    try {
      const date = new Date(scheduledAt);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${dateStr}, ${timeStr}`;
    } catch (error) {
      return 'Date TBD';
    }
  };
  type ItemType = Job | BaseProfessional;
  const items: ItemType[] = (filteredProfessionals || jobs || []) as ItemType[];
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  // Check for job ID in URL
  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      const job = items.find((j: any) => j.id === jobId) as Job;
      if (job) {
        setSelectedJob(job);
        setShowFullView(true);
      }
    }
  }, [searchParams, items]);

  const handleJobClick = (item: Job) => {
    setSelectedJob(item);
    if (onJobSelect) {
      onJobSelect(item);
    } else {
      // Default behavior if no onJobSelect handler is provided
      router.push(`?jobId=${item.id}`, { scroll: false });
      setShowFullView(true);
    }
  };

  const handleProfessionalClick = (professional: BaseProfessional) => {
    if (onProfessionalSelect) {
      onProfessionalSelect(professional);
    } else {
      // Default behavior if no onProfessionalSelect handler is provided
      router.push(`/client/freelancer/${professional.id}`);
    }
  };

  const handleBack = () => {
    router.back();
    setShowFullView(false);
  };

  const handleApply = (jobId: string) => {
    // For list view, open the job details modal instead of applying directly
    const job = items.find((item: any) => item.id === jobId);
    if (job) {
      handleJobClick(job as Job);
    }
  };

  const handleJobApply = (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => {
    if (onApply) {
      onApply(jobId, proposal, rate, rateType, attachments);
    } else {
      // Default behavior: just log for now
      console.log('Apply to job:', { jobId, proposal, rate, rateType, attachments });
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-white/60">
        {filteredProfessionals ? 'No professionals found' : 'No jobs found'}
      </div>
    );
  }

  console.log('ProfessionalsFeed - Rendering items:', items.length);

  // If in full view, only show the selected job (only for job items)
  if (showFullView && selectedJob && !filteredProfessionals) {
    return (
      <OverlayPortal>
        <JobDetailsFull job={selectedJob} onBack={handleBack} onApply={handleJobApply} />
      </OverlayPortal>
    );
  }

  // Otherwise show the list of items
  return (
    <div className="space-y-4 pb-24">
      {items.map((item: any) => (
        <div
          key={item.id}
          className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl px-6 py-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10"
          onClick={() => filteredProfessionals ? handleProfessionalClick(item) : handleJobClick(item as Job)}
        >
          <div className="space-y-2">
            {/* Avatar + Rating (for professionals) */}
            {filteredProfessionals && (
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                    <img
                      src={item.avatar || item.image}
                      alt={item.name}
                      className="relative w-14 h-14 rounded-full border-2 border-purple-200/50 object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                          {item.title || item.name}
                        </h3>
                        {(item.rating || item.reviews) && (
                          <div className="flex items-center gap-1 bg-yellow-400/10 rounded-full px-2 py-0.5 flex-shrink-0">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                            <span className="text-xs font-bold text-yellow-400">{item.rating ?? '-'}</span>
                            {item.reviews && <span className="text-[10px] text-yellow-300/80">({item.reviews})</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                          {item.category || item.service}
                        </span>
                        {item.workMode && (
                          <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                            {getWorkModeLabel(item.workMode)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Job header with client profile */}
            {!filteredProfessionals && (
              <div className="flex items-center gap-3 mb-1">
                <div className="relative flex-shrink-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20 group-hover:ring-white/30 transition-all duration-300">
                    <Image
                      src={item.clientImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.clientName || 'Client')}&background=6B46C1&color=fff&bold=true`}
                      alt="Client"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                      {item.category || item.service}
                    </span>
                    {item.workMode && (
                      <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                        {getWorkModeLabel(item.workMode)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed mb-1">
              {item.description || `${item.name} is available for ${item.service}`}
            </p>

            {/* Location and Date */}
            <div className="flex items-center justify-between text-[12px] text-white/60 mb-2">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate" title={item.location}>{item.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0 text-white/50" />
                <span className="text-white/60 text-[11px] whitespace-nowrap">
                  {item.responseTime || 
                   (filteredProfessionals ? 
                    (item.postedAt 
                     ? new Date(item.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                     : item.availability?.[0] || 'Available now') :
                    (item.scheduledAt 
                     ? formatScheduledDate(item.scheduledAt)
                     : 'Date TBD'))}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-1">
              {(item.skills || []).slice(0, 2).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/70 backdrop-blur-sm truncate max-w-[100px]"
                  title={skill}
                >
                  {skill}
                </span>
              ))}
              {(item.skills || []).length > 2 && (
                <span className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/50 whitespace-nowrap">
                  +{(item.skills || []).length - 2} more
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
              <div className="flex items-baseline gap-1 min-w-0 flex-1">
                <span className="text-[17px] font-semibold text-white truncate max-w-[120px]" title={`₹${item.budget?.toLocaleString()}`}>
                  ₹{item.budget?.toLocaleString()}
                </span>
                <span className="text-[13px] text-white/60 truncate leading-tight max-w-[80px]">
                  / {filteredProfessionals ? 'hour' : getJobDurationLabel(item as Job)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (filteredProfessionals) {
                    onProfessionalSelect?.(item);
                  } else {
                    handleApply(item.id);
                  }
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 flex items-center justify-center gap-1.5 group-hover:shadow-lg group-hover:shadow-purple-500/20 flex-shrink-0"
              >
                <span>{filteredProfessionals ? 'Hire Me' : 'Apply Now'}</span>
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
