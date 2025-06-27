import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceSection } from "@/components/freelancer/profile/ExperienceSection";

// Import the Experience type
import { Experience } from "@/components/freelancer/profile/ExperienceSection";

// Professional Experience
const experiences: Experience[] = [
  {
    id: '1',
    role: 'Cricketer (All-Rounder)',
    company: 'Professional Cricket',
    location: 'India',
    startDate: '2015-01-01',
    endDate: null,
    isCurrent: true,
    description: 'Professional cricketer specializing in top-order batting and off-spin bowling. Experienced in high-pressure matches with a focus on building strong team performances.'
  },
  {
    id: '2',
    role: 'AI Engineer & Developer',
    company: 'Freelance',
    location: 'Remote',
    startDate: '2020-01-01',
    endDate: null,
    isCurrent: true,
    description: 'Developing AI solutions and applications with a focus on machine learning, natural language processing, and automation. Specializing in creating intelligent systems that solve complex problems.'
  },
  {
    id: '3',
    role: 'Cricket Coach',
    company: 'Local Academy',
    location: 'India',
    startDate: '2018-01-01',
    endDate: '2020-12-31',
    isCurrent: false,
    description: 'Coached young cricketers in batting techniques, bowling skills, and match strategies. Helped develop the next generation of cricket talent with a focus on both technical skills and mental toughness.'
  }
];

export default function ExperiencePage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Link 
            href="/freelancer/profile" 
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </Link>
          <div>
            <h1 className="text-xl font-bold">My Experience</h1>
            <p className="text-white/60 text-sm mt-0.5">Showcase your professional journey and achievements</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <ExperienceSection experiences={experiences} />
      </div>
    </div>
  );
}
