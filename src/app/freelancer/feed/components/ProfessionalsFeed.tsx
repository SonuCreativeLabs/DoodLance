"use client";

import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, ArrowLeft } from 'lucide-react';
import JobDetailsFull from './JobDetailsFull';
import OverlayPortal from './OverlayPortal';
import { Job } from '../types';
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
  workMode?: 'remote' | 'onsite' | 'hybrid';
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
  onApply?: (jobId: string) => void;
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
  // Use filteredProfessionals if available, otherwise use jobs
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
    if (onApply) {
      onApply(jobId);
    } else {
      // Default apply behavior
      console.log('Applying to job:', jobId);
      handleBack();
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
        <JobDetailsFull job={selectedJob} onBack={handleBack} onApply={handleApply} />
      </OverlayPortal>
    );
  }

  // Otherwise show the list of items
  return (
    <div className="space-y-4 pb-24">
      {items.map((item: any) => (
        <div
          key={item.id}
          className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10 min-h-[220px] h-full"
          onClick={() => filteredProfessionals ? handleProfessionalClick(item) : handleJobClick(item as Job)}
        >
          <div className="space-y-3">
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
                        <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {item.category || item.service}
                        </span>
                        {item.workMode && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/5 text-white/70">
                            {item.workMode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Fallback for jobs (no avatar) */}
            {!filteredProfessionals && (
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {item.category || item.service}
                  </span>
                  {item.workMode && (
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/5 text-white/70">
                      {item.workMode}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed">
              {item.description || `${item.name} is available for ${item.service}`}
            </p>

            {/* Location and Date */}
            <div className="flex items-center gap-3 text-[12px] text-white/60 pt-1">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate" title={item.location}>{item.location}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="w-3 h-3 flex-shrink-0 text-white/50" />
                <span className="text-white/60 text-[11px] whitespace-nowrap">
                  {item.responseTime || 
                   (item.postedAt 
                    ? new Date(item.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : item.availability?.[0] || 'Available now')}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex gap-2 items-center pt-1">
              {(item.skills || []).slice(0, 2).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/70 backdrop-blur-sm whitespace-nowrap"
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
            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-[17px] font-semibold text-white">
                  ₹{item.budget?.toLocaleString()}
                </span>
                <span className="text-[13px] text-white/60">
                  {item.priceUnit ? ` / ${item.priceUnit}` : 
                   item.category === 'Sports' ? ' / session' :
                   item.category?.toLowerCase().includes('tutoring') ? ' / session' :
                   item.category?.toLowerCase().includes('coach') ? ' / session' :
                   item.category?.toLowerCase().includes('fitness') ? ' / session' :
                   item.category?.toLowerCase().includes('makeup') ? ' / session' :
                   item.category?.toLowerCase().includes('diet') ? ' / plan' :
                   ' / project'}
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
                className="px-4 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 group-hover:shadow-lg group-hover:shadow-purple-500/20"
              >
                <span>Apply Now</span>
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
