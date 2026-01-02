"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';
import { useNearbyProfessionals } from '@/contexts/NearbyProfessionalsContext';
import type { Freelancer } from './types';

// Define BaseProfessional interface to match what we receive from hirefeed
interface BaseProfessional {
  id: string | number;
  name?: string;
  title?: string;
  service?: string;
  rating?: number;
  reviews?: number;
  completedJobs?: number;
  location: string;
  responseTime?: string;
  image?: string;
  avatar?: string;
  distance?: number;
  price?: number;
  priceUnit?: string;
  expertise?: string[];
  experience?: string;
  description?: string;
  cricketRole?: string;
}

interface ProfessionalsFeedProps {
  filteredProfessionals?: BaseProfessional[];
}

export default function ProfessionalsFeed({ filteredProfessionals }: ProfessionalsFeedProps) {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const { professionals } = useNearbyProfessionals();
  const displayProfessionals = filteredProfessionals || professionals;

  const getNumericId = (id: string | number): number => {
    return typeof id === 'string' ? parseInt(id) : id;
  };

  const handleToggleFavorite = (id: string | number) => {
    const numericId = getNumericId(id);
    setFavoriteIds(prev =>
      prev.includes(numericId) ? prev.filter(fId => fId !== numericId) : [...prev, numericId]
    );
  };

  const handleProfessionalClick = (freelancer: BaseProfessional) => {
    if (freelancer && freelancer.id) {
      router.push(`/client/freelancer/${freelancer.id}?source=list`);
    }
  };

  if (!displayProfessionals || displayProfessionals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No professionals available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {displayProfessionals.map(freelancer => {
        if (!freelancer || !freelancer.id) return null;

        return (
          <div
            key={freelancer.id}
            className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10 min-h-[220px] h-full relative cursor-pointer"
            onClick={() => handleProfessionalClick(freelancer)}
          >
            <button
              className={`absolute top-3 right-3 z-20 p-1 transition-colors ${favoriteIds.includes(getNumericId(freelancer.id)) ? 'text-red-500' : 'text-white/60 hover:text-red-400'}`}
              style={{ background: 'transparent', border: 'none' }}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(freelancer.id);
              }}
              aria-label="Add to favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteIds.includes(getNumericId(freelancer.id)) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
              </svg>
            </button>

            {/* Profile Picture Section */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                  <img
                    src={freelancer.avatar || freelancer.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                    alt={freelancer.name || 'Professional'}
                    className="relative w-16 h-16 rounded-full border-2 border-purple-200/50 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">{freelancer.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-400/10 rounded-full px-2 py-0.5 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="text-xs font-bold text-yellow-400">{freelancer.rating}</span>
                        <span className="text-[10px] text-yellow-300/80">({freelancer.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-white/80 whitespace-nowrap">{freelancer.cricketRole || 'All Rounder'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed">{freelancer.description || `${freelancer.name} is available for ${freelancer.service || 'cricket services'}`}</p>
                <div className="flex items-center gap-4 text-[12px] text-white/60">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate max-w-[120px]" title={`${freelancer.location}${freelancer.distance ? ` | ${freelancer.distance < 1 ? `${(freelancer.distance * 1000).toFixed(0)}m` : `${freelancer.distance.toFixed(1)}km`} away` : ''}`}>{freelancer.location}{freelancer.distance ? <><span className="text-white/30 mx-1 text-[10px]">|</span>{freelancer.distance < 1 ? `${(freelancer.distance * 1000).toFixed(0)}m` : `${freelancer.distance.toFixed(1)}km`} away</> : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-green-400" />
                    <span className="text-green-400 font-medium">{freelancer.responseTime}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-1 text-[11px] text-white/60">
                    <Briefcase className="w-3 h-3" />
                    <span>{freelancer.completedJobs} jobs</span>
                  </div>
                  <div className="text-white/30">•</div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-300">
                    <Clock className="w-3 h-3" />
                    <span>{freelancer.experience}</span>
                  </div>
                </div>
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1">
                  {freelancer.expertise?.slice(0, 3).map((skill: string, index: number) => (
                    <span key={index} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {freelancer.expertise && freelancer.expertise.length > 3 && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      +{freelancer.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-purple-400">₹{freelancer.price}</span>
                <span className="text-[11px] text-white/50">/{freelancer.priceUnit}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-medium transition-all duration-200 border border-purple-500/20">
                  View Profile
                </button>
                <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-lg">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 