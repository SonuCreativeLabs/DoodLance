"use client"

import { Briefcase, Code, Award, Star, FileText, Calendar, MessageSquare, Settings, User, Mail, Phone, Globe, MapPin, GraduationCap, Languages, Edit2, CheckCircle, CircleDollarSign, ChevronRight, BarChart2, Clock, Users, Target, Dumbbell, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import components
import { ProfileHeader } from '@/components/freelancer/profile/ProfileHeader';
import { ProfileStatsCard } from '@/components/freelancer/profile/ProfileStatsCard';
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { ProfileSectionCard } from '@/components/freelancer/profile/ProfileSectionCard';

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

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
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

// Mock data
const portfolioItems = [
  {
    id: '1',
    title: 'E-commerce Website',
    category: 'Web Development',
    image: '/placeholder-portfolio-1.jpg'
  },
  {
    id: '2',
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    image: '/placeholder-portfolio-2.jpg'
  },
  {
    id: '3',
    title: 'Brand Identity',
    category: 'Graphic Design',
    image: '/placeholder-portfolio-3.jpg'
  },
];

const experiences: Experience[] = [
  {
    id: '1',
    role: 'Senior UI/UX Designer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    isCurrent: false,
    description: 'Led a team of 5 designers to create user-centered designs for web and mobile applications.'
  },
  {
    id: '2',
    role: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    startDate: '2023-01-01',
    endDate: undefined,
    isCurrent: true,
    description: 'Designing intuitive user experiences for enterprise SaaS products.'
  }
];

// Extend FreelancerData interface to include missing properties
type ExtendedFreelancerData = FreelancerData & {
  completedJobs: number;
  activeJobs: number;
  responseTime: string;
};

const freelancerData: ExtendedFreelancerData = {
  name: "Sathish Sonu",
  title: "Cricketer & AI Engineer",
  about: "I'm a passionate AI engineer and full-stack developer with expertise in building intelligent applications. I specialize in AI agents, prompt engineering, and modern web development.",
  rating: 4.9,
  reviewCount: 42,
  responseTime: "1h",
  deliveryTime: "2 days",
  completionRate: 100,
  online: true,
  location: "Chennai, India",
  skills: ["Cricket", "Cycling", "Off Spin", "Batting", "Vibe Coder", "Prompt Engg", "AI Agent Builder"],
  services: [
    {
      id: "1",
      title: "UI/UX Design",
      description: "Custom UI/UX design for your web or mobile application.",
      price: "$500",
      deliveryTime: "7 days"
    },
    {
      id: "2",
      title: "Frontend Development",
      description: "Frontend development with React and TypeScript.",
      price: "$800",
      deliveryTime: "14 days"
    }
  ],
  portfolio: [
    {
      id: "1",
      title: "AI-Powered Chatbot",
      category: "AI Development",
      image: "/placeholder-portfolio-1.jpg"
    },
    {
      id: "2",
      title: "Custom AI Agent",
      category: "AI Development",
      image: "/placeholder-portfolio-2.jpg"
    }
  ],
  clientReviews: [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      comment: "Amazing work! Exceeded my expectations.",
      date: "2023-05-15"
    },
    {
      id: "2",
      author: "Mike Chen",
      rating: 5,
      comment: "Great communication and delivered on time.",
      date: "2023-04-22"
    }
  ],
  availability: [
    { day: "Monday", available: true },
    { day: "Tuesday", available: true },
    { day: "Wednesday", available: true },
    { day: "Thursday", available: true },
    { day: "Friday", available: true },
    { day: "Saturday", available: false },
    { day: "Sunday", available: false }
  ],
  // Additional properties for ExtendedFreelancerData
  completedJobs: 124,
  activeJobs: 5
};

// Main Profile Page Component
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white pb-20 md:pb-24">
      <ProfileHeader 
        name={freelancerData.name}
        title={freelancerData.title}
        rating={freelancerData.rating}
        reviewCount={freelancerData.reviewCount}
        online={freelancerData.online}
        location={freelancerData.location}
        skills={freelancerData.skills}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">My Profile</h2>
          <p className="text-white/60">Manage your professional profile and settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileSectionCard
            title="Personal Details"
            description="Manage your profile and contact information"
            href="/freelancer/profile/personal"
            icon={<User className="h-4 w-4" />}
          />
          <ProfileSectionCard
            title="Portfolio"
            description="Showcase your best work with images and details"
            href="/freelancer/profile/portfolio"
            icon={<Briefcase className="h-4 w-4" />}
          />

          <ProfileSectionCard
            title="Skills"
            description="Highlight your expertise and proficiency levels"
            href="/freelancer/profile/skills"
            icon={<Code className="h-4 w-4" />}
          />

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
            title="Identity Verification"
            description="Complete your KYC verification to unlock all features"
            href="/freelancer/profile/verification"
            icon={<CheckCircle className="h-4 w-4" />}
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
    </div>
  );
}