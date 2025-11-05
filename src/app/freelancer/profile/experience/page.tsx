import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    role: 'Cricket Performance Consultant',
    company: 'Freelance Cricket Services',
    location: 'India',
    startDate: '2020-01-01',
    endDate: null,
    isCurrent: true,
    description: 'Providing cricket performance analysis and consulting services. Specializing in match strategy, player development, and team performance optimization. Working with clubs and individual players to enhance their cricket skills and competitive edge.'
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
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Work Experience</h1>
              <p className="text-white/50 text-xs">Add and manage your work experience and employment history</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <ExperienceSection experiences={experiences} />
        </div>
      </div>
    </div>
  );
}
