import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceSection } from "@/components/freelancer/profile/ExperienceSection";

// Import the Experience type
import { Experience } from "@/components/freelancer/profile/ExperienceSection";

// Mock data for experience
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
    role: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    startDate: '2018-06-01',
    endDate: '2020-01-01',
    isCurrent: false,
    description: 'Designed and prototyped user interfaces for web and mobile applications.'
  },
  {
    id: '3',
    role: 'Junior Designer',
    company: 'Creative Studio',
    location: 'Boston, MA',
    startDate: '2017-01-01',
    endDate: '2018-05-31',
    isCurrent: false,
    description: 'Assisted in creating visual designs and user interfaces for various clients.'
  }
];

export default function ExperiencePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/freelancer/profile" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Experience</h1>
            <p className="text-white/60 mt-1">Showcase your professional journey and achievements</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </div>

      <Card className="bg-[#1E1E1E] border border-white/5">
        <CardContent className="p-6">
          <ExperienceSection experiences={experiences} />
        </CardContent>
      </Card>
    </div>
  );
}
