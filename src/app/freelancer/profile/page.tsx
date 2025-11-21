"use client"

import { Briefcase, Code, Award, Star, FileText, Calendar, MessageSquare, Settings, User, Mail, Phone, Globe, MapPin, GraduationCap, Languages, Edit2, CheckCircle, CircleDollarSign, ChevronRight, BarChart2, Clock, Users, Target, Dumbbell, Trophy, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import components
import { ProfileHeader } from '@/components/freelancer/profile/ProfileHeader';
import { ProfileStatsCard } from '@/components/freelancer/profile/ProfileStatsCard';
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { ProfileSectionCard } from '@/components/freelancer/profile/ProfileSectionCard';
import { SkillsSection } from '@/components/freelancer/profile/SkillsSection';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { type PortfolioItem } from '@/contexts/PortfolioContext';
import { getSessionFlag, removeSessionItem } from '@/utils/sessionStorage';

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
  portfolio: PortfolioItem[];
  clientReviews: Review[];
  availability: Availability[];
};



const experiences: Experience[] = [
  {
    id: '1',
    role: 'Senior Cricket Coach',
    company: 'Chennai Cricket Academy',
    location: 'Chennai, India',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    isCurrent: false,
    description: 'Led coaching programs for 50+ players, specializing in batting and bowling techniques. Coached teams that won multiple district-level tournaments.'
  },
  {
    id: '2',
    role: 'Professional Cricket Player',
    company: 'Tamil Nadu Cricket Association',
    location: 'Chennai, India',
    startDate: '2023-01-01',
    endDate: undefined,
    isCurrent: true,
    description: 'Competitive cricketer playing in state-level tournaments. Right-handed batsman and off-spin bowler with championship-level experience.'
  }
];

// Extend FreelancerData interface to include missing properties
type ExtendedFreelancerData = FreelancerData & {
  completedJobs: number;
  activeJobs: number;
  responseTime: string;
};

import { freelancerData } from './profileData';

// Main Profile Page Component
export default function ProfilePage() {
  const searchParams = useSearchParams();
  const personalDetailsRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

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

  // Helper function to handle section scrolling
  const scrollToSectionIfNeeded = (sectionId: string, ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return false;
    
    // Force a reflow to ensure the element is in the DOM
    void ref.current.offsetHeight;
    scrollToSection(ref);
    return true;
  };

  useEffect(() => {
    // Function to handle hash changes and section scrolling
    const handleHashChange = () => {
      const hash = window.location.hash;
      const isFromPortfolio = getSessionFlag('scrollToPortfolio');
      
      console.log('Hash change detected:', hash, 'isFromPortfolio:', isFromPortfolio);
      
      // Small delay to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        // Check for section hashes first
        if (hash === '#personal-details') {
          scrollToSectionIfNeeded('personal-details', personalDetailsRef);
        } else if (hash === '#portfolio' || isFromPortfolio) {
          console.log('Scrolling to portfolio section');
          if (isFromPortfolio) {
            removeSessionItem('scrollToPortfolio');
          }
          scrollToSectionIfNeeded('portfolio', portfolioRef);
        } else if (hash === '#skills') {
          scrollToSectionIfNeeded('skills', skillsRef);
        }
      }, 200); // Increased delay for better reliability
      
      return () => clearTimeout(timer);
    };
    
    // Initial check
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange, false);
    
    // Clean up
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []); // Remove searchParams dependency to ensure it always runs
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20 md:pb-24">
      <ProfileHeader />

      {/* Gradient separation line */}
      <div className="relative py-1">
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 pt-2 pb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-1">My Profile</h2>
          <p className="text-sm text-white/60">Manage your professional profile and settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              id="personal-details" 
              ref={personalDetailsRef}
              className="scroll-mt-24" // Add scroll margin to account for fixed header
            >
              <ProfileSectionCard
                title="Personal Details"
                description="Manage your profile and contact information"
                href="/freelancer/profile/personal?from=profile#personal-details"
                icon={<User className="h-4 w-4" />}
              />
            </div>
          <div 
            id="portfolio" 
            ref={portfolioRef}
            className="scroll-mt-24" // Add scroll margin to account for fixed header
          >
            <ProfileSectionCard
              title="Portfolio"
              description="Showcase your best work with images and details"
              href="/freelancer/profile/portfolio?from=profile#portfolio"
              icon={<Briefcase className="h-4 w-4" />}
            />
          </div>

          <div 
            id="skills" 
            ref={skillsRef}
            className="scroll-mt-24" // Add scroll margin to account for fixed header
          >
            <ProfileSectionCard
              title="Skills"
              description="Highlight your expertise and proficiency levels"
              href="/freelancer/profile/skills?from=profile#skills"
              icon={<Code className="h-4 w-4" />}
            />
          </div>

          <ProfileSectionCard
            title="Experience"
            description="List your professional experience and achievements"
            href="/freelancer/profile/experience"
            icon={<Award className="h-4 w-4" />}
          />

          <ProfileSectionCard
            title="Service Packages"
            description="Define your service offerings and pricing"
            href="/freelancer/profile/services"
            icon={<FileText className="h-4 w-4" />}
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
            title="Settings"
            description="Manage your account, notifications and preferences"
            href="/freelancer/profile/settings"
            icon={<SettingsIcon className="h-4 w-4" />}
          />
          
          <Link 
            href="/client" 
            className="w-full h-full flex items-center justify-between p-4 bg-gradient-to-l from-[var(--purple)] to-[var(--purple-hover)] hover:opacity-90 rounded-xl transition-all duration-200 group shadow-md shadow-purple-500/20 hover:shadow-purple-500/30"
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
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Hidden SkillsSection to sync skills immediately on page load */}
      <div className="hidden">
        <SkillsSection />
      </div>
    </div>
  );
}