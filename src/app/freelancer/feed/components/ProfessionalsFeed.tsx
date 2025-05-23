"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  client: string;
  clientRating: number;
  budget: number;
  currency: string;
  description: string;
  location: string;
  distance: number;
  posted: string;
  duration: string;
  coords: [number, number];
  availability: string[];
  skills: string[];
  category: string;
  proposals: number;
}

interface ProfessionalsFeedProps {
  jobs: Job[];
}

export default function ProfessionalsFeed({ jobs }: ProfessionalsFeedProps) {
  return (
    <div className="space-y-4 p-4 pb-24">
      {jobs.map((job) => (
        <div key={job.id} className="bg-[#1A1A1A] rounded-xl p-4 shadow-lg border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">{job.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-400 text-sm">{job.client}</span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs ml-0.5">{job.clientRating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-400">
                {job.currency}{job.budget}
              </div>
              <div className="text-xs text-white/50">{job.duration}</div>
            </div>
          </div>

          <p className="text-sm text-white/80 mt-3 line-clamp-2">{job.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {job.skills.map((skill, i) => (
              <span key={i} className="text-xs bg-black/40 text-white/80 px-2.5 py-1 rounded-full border border-white/5">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="flex items-center">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.distance} km away
              </span>
              <span>•</span>
              <span>{job.posted}</span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {job.proposals} proposals
              </span>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
