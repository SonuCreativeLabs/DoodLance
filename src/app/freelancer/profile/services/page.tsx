import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServicePackages } from "@/components/freelancer/profile/ServicePackages";

// Professional Services
const services = [
  {
    id: '1',
    title: 'Net Bowling Sessions',
    description: 'Professional net bowling sessions with personalized coaching',
    price: '₹500',
    type: 'online' as const,
    deliveryTime: '1 hour',
    features: [
      '1-hour net session',
      'Ball analysis',
      'Technique improvement',
      'Q&A session'
    ],
    category: 'Net Bowler'
  },
  {
    id: '2',
    title: 'Match Player',
    description: 'Professional match player ready to play for your team per match',
    price: '₹1,500',
    type: 'in-person' as const,
    deliveryTime: 'Per match',
    features: [
      'Full match participation',
      'Team contribution',
      'Match commitment',
      'Performance guarantee'
    ],
    category: 'Match Player'
  },
  {
    id: '3',
    title: 'Match Videography',
    description: 'Professional match videography and reel content creation during games',
    price: '₹800',
    type: 'in-person' as const,
    deliveryTime: 'Same day',
    features: [
      'Full match recording',
      'Highlight reel creation',
      'Social media content',
      'Priority editing'
    ],
    category: 'Cricket Photo / Videography'
  },
  {
    id: '4',
    title: 'Sidearm Bowling',
    description: 'Professional sidearm bowler delivering 140km/h+ speeds for practice sessions',
    price: '₹1,500',
    type: 'in-person' as const,
    deliveryTime: 'per hour',
    features: [
      '140km/h+ sidearm bowling',
      'Practice session delivery',
      'Consistent speed & accuracy',
      'Training session support'
    ],
    category: 'Sidearm'
  },
  {
    id: '5',
    title: 'Batting Coaching',
    description: 'Professional batting technique training and skill development',
    price: '₹1,200',
    type: 'in-person' as const,
    deliveryTime: 'per hour',
    features: [
      'Batting technique analysis',
      'Footwork drills',
      'Shot selection training',
      'Mental preparation coaching'
    ],
    category: 'Coach'
  },
  {
    id: '6',
    title: 'Performance Analysis',
    description: 'Comprehensive cricket performance analysis and improvement recommendations',
    price: '₹2,000',
    type: 'online' as const,
    deliveryTime: '2-3 weeks',
    features: [
      'Match statistics review',
      'Strength/weakness analysis',
      'Improvement recommendations',
      'Progress tracking'
    ],
    category: 'Analyst'
  }
];

export default function ServicesPage() {
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
              <h1 className="text-lg font-semibold text-white">My Services</h1>
              <p className="text-white/50 text-xs">Manage the services you offer to clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <ServicePackages services={services} />
        </div>
      </div>
    </div>
  );
}
