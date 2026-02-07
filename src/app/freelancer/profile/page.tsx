"use client"

import { Briefcase, Code, Award, Star, FileText, Calendar, User, CheckCircle, BarChart2, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import components
import { ProfileHeader } from '@/components/freelancer/profile/ProfileHeader';
import { ProfileStatsCard } from '@/components/freelancer/profile/ProfileStatsCard';
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { ProfileSectionCard } from '@/components/freelancer/profile/ProfileSectionCard';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getSessionFlag, removeSessionItem } from '@/utils/sessionStorage';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import FreelancerProfileLogin from '@/components/freelancer/FreelancerProfileLogin';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';
import { useFreelancerProfile } from '@/contexts/FreelancerProfileContext';
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';

// Types
type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string; // Made optional for current positions
  isCurrent: boolean;
  description: string;
};

type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  type?: 'online' | 'in-person';
  deliveryTime: string;
  features?: string[];
};


type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

type Skill = string;

type Availability = {
  day: string;
  available: boolean;
};

type FreelancerData = {
  name: string;
  title: string;
  about: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  deliveryTime: string;
  completionRate: number;
  online: boolean;
  location: string;
  skills: Skill[];
  services: Service[];
  clientReviews: Review[];
  availability: Availability[];
};




// Extend FreelancerData interface to include missing properties
type ExtendedFreelancerData = FreelancerData & {
  completedJobs: number;
  activeJobs: number;
  responseTime: string;
};

import { createClient } from '@/lib/supabase/client';

// Main Profile Page Component
export default function ProfilePage() {
  const searchParams = useSearchParams();
  const personalDetailsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);


  // Use cached profile data from context
  const { headerDataLoaded, isLoading: contextLoading } = usePersonalDetails();
  const { requireAuth, openLoginDialog, setOpenLoginDialog, isAuthenticated } = useRequireAuth();
  const { profileData, loading: profileLoading } = useFreelancerProfile();

  useEffect(() => {
    // Require authentication to access profile, but don't force profile completion
    requireAuth('view-profile', {
      redirectTo: '/freelancer/profile',
      skipProfileCheck: true // Allow viewing profile dashboard even if incomplete
    });
  }, [requireAuth]);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      // ProfileHeader is not fixed, so no header height offset needed
      const headerHeight = 0;

      // Get the element's position relative to the viewport
      const elementRect = ref.current.getBoundingClientRect();

      // Calculate the scroll position to place the element just below the header
      const scrollPosition = window.scrollY + elementRect.top - headerHeight - 16; // 16px extra spacing

      // Scroll to the calculated position
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant' // Use instant for immediate scrolling
      });

      // Remove the hash without page reload
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  useEffect(() => {
    // Handle hash scrolling on mount or hash change
    const hash = window.location.hash;
    // Debug log
    console.log("Hash change detected:", hash);

    if (hash === '#personal-details' && personalDetailsRef.current) {
      // Small timeout to ensure layout is stable
      setTimeout(() => scrollToSection(personalDetailsRef), 100);
    } else if (hash === '#skills' && skillsRef.current) {
      setTimeout(() => scrollToSection(skillsRef), 100);
    }
  }, [searchParams]);

  if (!isAuthenticated && !contextLoading && !profileLoading) {
    return <FreelancerProfileLogin />;
  }

  // Show skeleton only while critical header data is loading
  if (!headerDataLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 md:pb-24">
      {/* Mobile Header (Full Width) */}
      <div className="md:hidden">
        <ProfileHeader />
      </div>

      {/* Gradient separation line (Mobile only) */}
      <div className="md:hidden relative py-1">
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 pt-4 md:pt-8 pb-6">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* Desktop Left Sidebar (Profile Header) */}
          <div className="hidden md:block w-[340px] lg:w-[380px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                <ProfileHeader compact={true} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">My Profile</h2>
              <p className="text-sm text-white/60">Manage your professional profile and settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div
                id="personal-details"
                ref={personalDetailsRef}
                className="scroll-mt-24"
              >
                <ProfileSectionCard
                  title="Personal Details"
                  description="Manage your profile and contact information"
                  href="/freelancer/profile/personal?from=profile#personal-details"
                  icon={<User className="h-4 w-4" />}
                />
              </div>

              <ProfileSectionCard
                title="Sports Services"
                description="List your services with videos, descriptions, and pricing"
                href="/freelancer/profile/services"
                icon={<FileText className="h-4 w-4" />}
              />

              <div
                id="skills"
                ref={skillsRef}
                className="scroll-mt-24"
              >
                <ProfileSectionCard
                  title="Skills"
                  description="Highlight your expertise and proficiency levels"
                  href="/freelancer/profile/skills?from=profile#skills"
                  icon={<Code className="h-4 w-4" />}
                />
              </div>

              <ProfileSectionCard
                title="Achievements"
                description="Showcase your sports achievements and highlights"
                href="/freelancer/profile/achievements"
                icon={<Award className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Availability"
                description="Set your working hours and availability"
                href="/freelancer/profile/availability"
                icon={<Calendar className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Bank Account"
                description="Manage your bank account details for payments"
                href="/freelancer/profile/bank-account"
                icon={<CreditCard className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Identity Verification"
                description="Complete your KYC verification to unlock all features"
                href="/freelancer/profile/verification"
                icon={<CheckCircle className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Client Reviews"
                description="View and manage client feedback"
                href="/freelancer/profile/reviews"
                icon={<Star className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Performance Activity"
                description="Track your performance metrics and analytics"
                href="/freelancer/profile/performance"
                icon={<BarChart2 className="h-4 w-4" />}
              />

              <ProfileSectionCard
                title="Settings"
                description="Manage your account, notifications and preferences"
                href="/freelancer/profile/settings"
                icon={<SettingsIcon className="h-4 w-4" />}
              />

              <Link
                href="/client"
                className="col-span-1 md:col-span-2 w-full flex items-center justify-between p-4 bg-gradient-to-l from-[var(--purple)] to-[var(--purple-hover)] hover:opacity-90 rounded-xl transition-all duration-200 group shadow-md shadow-purple-500/20 hover:shadow-purple-500/30"
              >
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M21 2v6h-6" />
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                    <path d="M3 22v-6h6" />
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Switch to Client</div>
                    <div className="text-xs text-white/80">Access client dashboard</div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white/80 group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}