import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServicePackages } from "@/components/freelancer/profile/ServicePackages";

// Professional Services
const services = [
  {
    id: '1',
    title: 'AI Development Consultation',
    description: 'Expert guidance on AI implementation for your business needs',
    price: '₹25,000',
    type: 'online' as const,
    deliveryTime: '1 week',
    features: [
      '1-hour consultation session',
      'Technical requirements analysis',
      'Solution architecture design',
      'Implementation roadmap',
      'Follow-up email support for 1 week'
    ]
  },
  {
    id: '2',
    title: 'Custom AI Solution Development',
    description: 'Tailored AI application development for your specific needs',
    price: '₹1,50,000',
    type: 'online' as const,
    deliveryTime: '4-6 weeks',
    features: [
      'Custom AI model development',
      'API integration',
      'Testing & deployment',
      'Documentation',
      '1 month of maintenance support'
    ]
  },
  {
    id: '3',
    title: 'Cricket Coaching (Batting)',
    description: 'Personalized batting coaching sessions',
    price: '₹2,000',
    type: 'in-person' as const,
    deliveryTime: '2 hours',
    features: [
      'Technical skill assessment',
      'Personalized training plan',
      'Video analysis',
      'Match simulation drills',
      'Mental conditioning tips'
    ]
  },
  {
    id: '4',
    title: 'Cricket Coaching (Bowling)',
    description: 'Professional off-spin bowling coaching',
    price: '₹2,500',
    type: 'in-person' as const,
    deliveryTime: '2 hours',
    features: [
      'Bowling action analysis',
      'Variations coaching',
      'Match situation practice',
      'Fitness & conditioning advice',
      'Video analysis session'
    ]
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
