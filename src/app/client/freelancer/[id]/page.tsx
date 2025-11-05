"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, MessageSquare, Star, MapPin, Clock, Briefcase, Award, Calendar, Check } from 'lucide-react';
import { useNavbar } from '@/contexts/NavbarContext';
import { professionals } from '@/app/client/nearby/mockData';

interface FreelancerDetail {
  id: string;
  name: string;
  service: string;
  experience: string;
  location: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  responseTime: string;
  image: string;
  expertise: string[];
  description: string;
  availability: string[];
  online: boolean;
}

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const freelancerId = params.id as string;

  // Hide navbar when detail page is mounted
  useEffect(() => {
    setNavbarVisibility(false);
    
    // Show navbar when component unmounts (when leaving detail page)
    return () => {
      setNavbarVisibility(true);
    };
  }, [setNavbarVisibility]);

  // Load freelancer data
  useEffect(() => {
    const foundFreelancer = professionals.find(p => p.id.toString() === freelancerId);
    if (foundFreelancer) {
      setFreelancer({
        id: foundFreelancer.id.toString(),
        name: foundFreelancer.name,
        service: foundFreelancer.service,
        experience: foundFreelancer.experience,
        location: foundFreelancer.location,
        price: foundFreelancer.price,
        priceUnit: foundFreelancer.priceUnit,
        rating: foundFreelancer.rating,
        reviews: foundFreelancer.reviews,
        completedJobs: foundFreelancer.completedJobs,
        responseTime: foundFreelancer.responseTime,
        image: foundFreelancer.image,
        expertise: foundFreelancer.expertise,
        description: foundFreelancer.description || `${foundFreelancer.name} is a ${foundFreelancer.experience} cricket professional specializing in ${foundFreelancer.service.toLowerCase()} with expertise in ${foundFreelancer.expertise?.slice(0, 3).join(', ')}${foundFreelancer.expertise && foundFreelancer.expertise.length > 3 ? ' & more' : ''}. ${foundFreelancer.completedJobs}+ successful sessions completed.`,
        availability: ['Available now', 'Next 24 hours', 'This week'],
        online: Math.random() > 0.5
      });
    }
    setLoading(false);
  }, [freelancerId]);

  const handleBack = () => {
    router.back();
  };

  const handleBook = () => {
    // Navigate to booking page with freelancer ID
    router.push(`/client/bookings/new?freelancerId=${freelancerId}`);
  };

  const handleMessage = () => {
    // Navigate to inbox with this freelancer
    router.push(`/client/inbox?freelancerId=${freelancerId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        <div className="text-white/60 text-lg">Freelancer not found</div>
        <Button
          onClick={handleBack}
          className="mt-4 bg-purple-600 hover:bg-purple-700"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100vh] fixed inset-0 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-white/5 bg-gradient-to-b from-[#1a1a1a] to-[#111111] backdrop-blur-xl sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-10 w-10 rounded-xl hover:bg-purple-500/10 transition-all duration-200"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-white/70" />
        </Button>

        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-purple-500/30">
              <AvatarImage src={freelancer.image} alt={freelancer.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-xs">
                {freelancer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {freelancer.online && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#1a1a1a] animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-white truncate text-sm">{freelancer.name}</h2>
              {freelancer.online && (
                <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 truncate">{freelancer.service}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-xl hover:bg-purple-500/10 transition-all duration-200 group ml-1"
          aria-label="Call"
        >
          <Phone className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        {/* Hero Section */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20"></div>
          <div className="absolute -bottom-12 left-4">
            <Avatar className="h-24 w-24 ring-4 ring-[#111111] shadow-xl">
              <AvatarImage src={freelancer.image} alt={freelancer.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold text-lg">
                {freelancer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-4 pt-16 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">{freelancer.name}</h1>
              <p className="text-white/80 text-sm mb-2">{freelancer.service}</p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="font-medium">{freelancer.rating}</span>
                  <span>({freelancer.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{freelancer.completedJobs}+ jobs</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">₹{freelancer.price.toLocaleString()}</div>
              <div className="text-xs text-white/60">{freelancer.priceUnit}</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-xs text-white/60">Location</div>
              <div className="text-sm font-medium text-white truncate">{freelancer.location}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-xs text-white/60">Response</div>
              <div className="text-sm font-medium text-white">{freelancer.responseTime}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-xs text-white/60">Experience</div>
              <div className="text-sm font-medium text-white">{freelancer.experience}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            <p className="text-sm text-white/80 leading-relaxed">{freelancer.description}</p>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Availability</h3>
            <div className="space-y-2">
              {freelancer.availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white/80">{slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#111111] to-transparent border-t border-white/10 p-4 backdrop-blur-xl">
        <div className="flex gap-3">
          <Button
            onClick={handleMessage}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            onClick={handleBook}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
