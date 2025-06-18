"use client"

import { useState } from 'react';
import { Star, Edit2, Plus, Briefcase, MessageSquare, CalendarDays, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Import components
import { ProfileHeader } from '@/components/freelancer/profile/ProfileHeader';
import { StatsCards } from '@/components/freelancer/profile/StatsCards';
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { PortfolioSection } from '@/components/freelancer/profile/PortfolioSection';
import { SkillsSection } from '@/components/freelancer/profile/SkillsSection';
import { ExperienceSection, Experience } from '@/components/freelancer/profile/ExperienceSection';

// Types
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
    startDate: '2020',
    endDate: '2023',
    isCurrent: false,
    description: 'Led a team of 5 designers to create user-centered designs for web and mobile applications.'
  },
  {
    id: '2',
    role: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    startDate: '2023',
    endDate: null,
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
  name: "Alex Johnson",
  title: "Senior UI/UX Designer & Frontend Developer",
  about: "I'm a passionate UI/UX designer with over 5 years of experience creating beautiful and functional digital experiences. I specialize in user-centered design and frontend development.",
  rating: 4.9,
  reviewCount: 128,
  responseTime: "2h 15m",
  deliveryTime: "3 days",
  completionRate: 98,
  online: true,
  location: "San Francisco, CA",
  skills: ["UI/UX Design", "Figma", "Adobe XD", "React", "TypeScript", "User Research"],
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
      title: "E-commerce Website",
      category: "Web Design",
      image: "/placeholder-portfolio-1.jpg"
    },
    {
      id: "2",
      title: "Mobile App UI",
      category: "App Design",
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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [profileData] = useState<FreelancerData>(freelancerData);
  
  return (
    <div className="min-h-screen bg-[#111111] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ProfileHeader 
          name={freelancerData.name}
          title={freelancerData.title}
          rating={freelancerData.rating}
          reviewCount={freelancerData.reviewCount}
          location={freelancerData.location}
          online={freelancerData.online}
          skills={freelancerData.skills}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StatsCards 
              completed={freelancerData.completedJobs}
              inProgress={freelancerData.activeJobs}
              rating={freelancerData.rating}
              responseTime={freelancerData.responseTime}
            />
            
            <ExperienceSection experiences={experiences} />
            
            <PortfolioSection portfolio={portfolioItems} />
            
            <SkillsSection skills={freelancerData.skills} />
          </div>
          
          <div className="space-y-6">
            <MonthlyActivities />
          </div>
        </div>
      </div>
    </div>
  );
}