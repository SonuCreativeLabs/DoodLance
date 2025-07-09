"use client"

import { Briefcase, Code, Award, Star, FileText, Calendar, MessageSquare, Settings, User, Mail, Phone, Globe, MapPin, GraduationCap, Languages, Edit2, CheckCircle } from 'lucide-react';
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProfileStatsCard 
              completed={124}
              inProgress={5}
              responseTime="1 hour"
              totalEarnings="$12,450"
              pendingJobs={3}
            />
          </div>
          <div className="lg:col-span-1">
            <MonthlyActivities />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">My Profile</h2>
          <p className="text-white/60">Manage your professional profile and settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileSectionCard
            title="Personal Details"
            description="View and edit your contact information, location, and professional background"
            href="/freelancer/profile/personal"
            icon={<User className="h-5 w-5" />}
          />
          <ProfileSectionCard
            title="Portfolio"
            description="Showcase your best work with descriptions, images, and links"
            href="/freelancer/profile/portfolio"
            icon={<Briefcase className="h-5 w-5" />}
            count={portfolioItems.length}
          />

          <ProfileSectionCard
            title="Skills"
            description="Highlight your expertise and proficiency levels"
            href="/freelancer/profile/skills"
            icon={<Code className="h-5 w-5" />}
            count={freelancerData.skills?.length || 0}
          />

          <ProfileSectionCard
            title="Experience"
            description="List your professional experience and achievements"
            href="/freelancer/profile/experience"
            icon={<Award className="h-5 w-5" />}
            count={experiences.length}
          />

          <ProfileSectionCard
            title="Service Packages"
            description="Define your service offerings and pricing"
            href="/freelancer/profile/services"
            icon={<FileText className="h-5 w-5" />}
            count={freelancerData.services?.length || 0}
          />

          <ProfileSectionCard
            title="Client Reviews"
            description="View and manage client feedback"
            href="/freelancer/profile/reviews"
            icon={<Star className="h-5 w-5" />}
            count={freelancerData.clientReviews?.length || 0}
          />

          <ProfileSectionCard
            title="Availability"
            description="Set your working hours and availability"
            href="/freelancer/profile/availability"
            icon={<Calendar className="h-5 w-5" />}
          />
          
          <ProfileSectionCard
            title="Identity Verification"
            description="Complete your KYC verification to unlock all features"
            href="/freelancer/profile/verification"
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
}