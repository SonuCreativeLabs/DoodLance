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
  cricketRole?: string;
};

interface ProfessionalsFeedProps {
  jobs?: Job[];
  filteredProfessionals?: BaseProfessional[];
  onProfessionalSelect?: (professional: BaseProfessional) => void;
  onJobSelect?: (job: Job) => void;
  onApply?: (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => void;
  className?: string;
  searchQuery?: string;
  selectedCategory?: string;
}

export default function ProfessionalsFeed({ 
  jobs = [], 
  filteredProfessionals, 
  onProfessionalSelect,
  onJobSelect,
  onApply,
  className = '',
  searchQuery = '',
  selectedCategory = 'All'
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
      router.push(`/client/freelancer/${professional.id}?source=list`);
    }
  };

  const handleBack = () => {
    router.back();
    setShowFullView(false);
  };

  const handleJobApply = (jobId: string) => {
    // For list view, open the job details modal instead of applying directly
    const job = items.find((item: any) => item.id === jobId);
    if (job) {
      handleJobClick(job as Job);
    }
  };

  const getServicePrice = (item: any, searchQuery: string, selectedCategory: string): number => {
    // Service-specific pricing based on search/filter criteria - Updated competitive rates
    const servicePricing: { [key: string]: number } = {
      'Fast Bowler': 750,        // Reduced from 800
      'Net Bowler': 550,         // Reduced from 600
      'Sidearm Specialist': 450,  // Reduced from 500
      'Batting Coach': 1100,     // Reduced from 1200
      'Sports Conditioning Trainer': 850,  // Reduced from 900
      'Fitness Trainer': 700,    // Reduced from 750
      'Cricket Analyst': 1400,   // Reduced from 1500
      'Physio': 1500,           // Reduced from 1600
      'Scorer': 350,            // Reduced from 400
      'Umpire': 600,            // Reduced from 650
      'Cricket Photo/Videography': 1700,  // Reduced from 1900
      'Cricket Content Creator': 1200,    // Reduced from 1300
      'Commentator': 1800,      // Reduced from 2000
      'Match Player': 1600,     // Reduced from 1800
      'Net Batsman': 500,       // Reduced from 550
      'Coach': 500,             // Reduced from 550
      // Added missing services with competitive rates
      'Spin Bowler': 700,       // New addition
      'Wicket Keeper': 600,     // New addition
      'All Rounder': 900,       // New addition
      'Physiotherapist': 1450,  // New addition
      'Videographer': 1650,     // New addition
      'Content Creator': 1150,  // New addition
    };

    // If there's a specific search query, try to match it to a service price
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchedPrice = Object.entries(servicePricing).find(([serviceName]) => 
        serviceName.toLowerCase().includes(query) || query.includes(serviceName.toLowerCase())
      );
      if (matchedPrice) return matchedPrice[1];
    }

    // If there's a category filter, use category-specific pricing
    if (selectedCategory && selectedCategory !== 'All') {
      const categoryServices: { [key: string]: string[] } = {
        'Playing Services': ['Match Player', 'Net Bowler', 'Net Batsman', 'Sidearm Specialist', 'Bowler', 'Batsman', 'Fast Bowler', 'Spin Bowler', 'Wicket Keeper', 'All Rounder'],
        'Coaching & Training': ['Coach', 'Batting Coach', 'Sports Conditioning Trainer', 'Fitness Trainer'],
        'Support Staff': ['Cricket Analyst', 'Physio', 'Physiotherapist', 'Scorer', 'Umpire'],
        'Media & Content': ['Cricket Photo/Videography', 'Cricket Content Creator', 'Commentator', 'Videographer', 'Content Creator']
      };
      
      const allowedServices = categoryServices[selectedCategory] || [];
      if (allowedServices.length > 0) {
        // Find the lowest price among allowed services for this freelancer
        const freelancerServices = allowedServices.filter(service => 
          item.service?.toLowerCase().includes(service.toLowerCase()) ||
          item.category?.toLowerCase().includes(service.toLowerCase())
        );
        
        if (freelancerServices.length > 0) {
          const prices = freelancerServices.map(service => servicePricing[service]).filter(price => price);
          if (prices.length > 0) return Math.min(...prices);
        }
      }
    }

    // Default to service-specific pricing or fallback to item.budget
    const matchedPrice = Object.entries(servicePricing).find(([serviceName]) => 
      item.service?.toLowerCase().includes(serviceName.toLowerCase()) ||
      item.category?.toLowerCase().includes(serviceName.toLowerCase())
    );
    
    return matchedPrice ? matchedPrice[1] : (item.budget || item.price || 500);
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-white/60">
        {filteredProfessionals ? 'No professionals found' : 'No jobs found'}
      </div>
    );
  }

  // If in full view, only show the selected job (only for job items)
  if (showFullView && selectedJob && !filteredProfessionals) {
    return (
      <OverlayPortal>
        <JobDetailsFull job={selectedJob} onBack={handleBack} onApply={handleJobApply} />
      </OverlayPortal>
    );
  }

  // Helper function to render each item
  const renderItem = (item: any) => {
    if (filteredProfessionals) {
      return (
        <div key={item.id || item.name} className="bg-[#111111] shadow-lg rounded-xl p-3 border border-white/10 backdrop-blur-xl cursor-pointer overflow-hidden group relative" onClick={() => handleProfessionalClick(item)}>
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="relative flex flex-col items-center w-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-purple-600/50 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
                <img
                  src={item.avatar || item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full border-2 border-purple-200/50 relative z-10 object-cover shadow-xl ring-2 ring-purple-500/20 ring-offset-2 ring-offset-black/50"
                />
              </div>
              <div className="flex flex-col items-center mt-2 mb-1">
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-0.5 shadow-lg border border-white/5 backdrop-blur-sm mb-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow" />
                  <span className="text-xs font-bold text-white drop-shadow">{item.rating}</span>
                </div>
                <span className="text-xs text-white/70 font-medium drop-shadow">({item.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-lg text-white leading-tight drop-shadow-sm">{item.title || item.name}</h3>
              </div>
              <div className="flex items-center text-sm text-white/80 font-medium mb-1">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="drop-shadow-sm">{item.cricketRole || 'All Rounder'}</span>
              </div>
              <div className="flex items-center text-sm text-white/60 mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                <span className="drop-shadow-sm">{item.location}{item.distance ? <><span className="text-white/30 mx-1 text-[10px]">|</span>{item.distance < 1 ? `${(item.distance * 1000).toFixed(0)}m` : `${item.distance.toFixed(1)}km`} away</> : ''}</span>
              </div>
              <div className="flex items-center text-sm text-white/60">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span className="drop-shadow-sm">{item.responseTime || 'Available now'}</span>
              </div>
            </div>
          </div>
          {/* Footer - Price and Hire Button */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-3 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-white/70 drop-shadow-sm">From</span>
              <span className="text-lg font-bold text-white drop-shadow-sm">₹{getServicePrice(item, searchQuery, selectedCategory).toLocaleString()}</span>
            </div>
            <button className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:from-purple-700 hover:to-purple-500 relative z-20" onClick={(e) => { e.stopPropagation(); }}>
              <span className="relative z-10">Hire Now</span>
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div
          key={item.id || item.name}
          className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl px-6 py-4 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10 cursor-pointer"
          onClick={() => handleJobClick(item as Job)}
        >
          {/* Job header with client profile */}
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-shrink-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/20">
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
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                  {item.category}
                </span>
                {item.workMode && (
                  <span className="text-[12px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                    {item.workMode === 'remote' ? 'Remote' : item.workMode === 'onsite' ? 'On-site' : 'All'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed mb-2">
            {item.description}
          </p>

          {/* Location and Date */}
          <div className="flex items-center justify-between text-[12px] text-white/60 mb-2">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate" title={`${item.location}${item.distance ? ` | ${item.distance < 1 ? `${(item.distance * 1000).toFixed(0)}m` : `${item.distance.toFixed(1)}km`} away` : ''}`}>{item.location}{item.distance ? <><span className="text-white/30 mx-1 text-[10px]">|</span>{item.distance < 1 ? `${(item.distance * 1000).toFixed(0)}m` : `${item.distance.toFixed(1)}km`} away</> : ''}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Clock className="w-3 h-3 flex-shrink-0 text-white/50" />
              <span className="text-white/60 text-[11px] whitespace-nowrap">
                {(() => {
                  const scheduledAt = item.scheduledAt ? new Date(item.scheduledAt) : new Date();
                  const date = scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const time = scheduledAt.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true
                  });
                  return `${date}, ${time}`;
                })()}
              </span>
            </div>
          </div>

          {/* Skills */}
          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.skills.slice(0, 2).map((skill: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/70 backdrop-blur-sm whitespace-nowrap">
                  {skill}
                </span>
              ))}
              {item.skills.length > 2 && (
                <span className="px-2.5 py-1 h-6 flex items-center text-[11px] rounded-full bg-white/5 text-white/50 whitespace-nowrap">
                  +{item.skills.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-semibold text-white">
                ₹{(item.budget || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[13px] text-white/60">
                / {getJobDurationLabel(item)}
              </span>
            </div>
            <button className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 flex items-center justify-center gap-1.5" onClick={(e) => { e.stopPropagation(); handleJobApply(item.id); }}>
              <span>Apply Now</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      );
    }
  };

  // Otherwise show the list of items
  return (
    <div className="space-y-4 pb-24">
      {items.map((item: any) => renderItem(item))}
    </div>
  );
}
