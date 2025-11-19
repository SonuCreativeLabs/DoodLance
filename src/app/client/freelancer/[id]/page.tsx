"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Calendar,
  Check,
  ChevronDown,
  Share2,
  X,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavbar } from '@/contexts/NavbarContext';
import { professionals } from '@/app/client/nearby/mockData';
import { IdVerifiedBadge } from '@/components/freelancer/profile/IdVerifiedBadge';
import { SkillInfoDialog } from '@/components/common/SkillInfoDialog';
import { getSkillInfo, type SkillInfo } from '@/utils/skillUtils';

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
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  image: string;
  expertise: string[];
  description: string;
  availability: {
    day: string;
    available: boolean;
  }[];
  online: boolean;

  // Additional profile fields for detailed view
  bio?: string;
  about?: string;
  cricketRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  languages?: string;
  completionRate?: number;
  skills?: string[];

  // Services data
  services?: {
    id: string;
    title: string;
    description: string;
    price: string | number;
    deliveryTime: string;
    features?: string[];
    category?: string;
  }[];

  // Portfolio data
  portfolio?: {
    id: string;
    title: string;
    image: string;
    category: string;
  }[];

  // Experience data
  experienceDetails?: {
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
  }[];

  // Reviews data
  reviewsData?: {
    id: string;
    author: string;
    role?: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState<SkillInfo | null>(null);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('top');
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const freelancerId = params.id as string;

  const tabs = [
    { id: 'top', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Experience' },
    { id: 'reviews', label: 'Reviews' }
  ];

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
    const foundFreelancer = professionals.find((p: typeof professionals[0]) => p.id.toString() === freelancerId);
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
        reviewCount: foundFreelancer.reviewCount || foundFreelancer.reviews,
        completedJobs: foundFreelancer.completedJobs,
        responseTime: foundFreelancer.responseTime,
        image: foundFreelancer.image,
        expertise: foundFreelancer.expertise,
        description: foundFreelancer.bio || foundFreelancer.about || `${foundFreelancer.name} is a ${foundFreelancer.experience} cricket professional specializing in ${foundFreelancer.service.toLowerCase()} with expertise in ${foundFreelancer.expertise?.slice(0, 3).join(', ')}${foundFreelancer.expertise && foundFreelancer.expertise.length > 3 ? ' & more' : ''}.`,
        availability: foundFreelancer.availability || [],
        online: Math.random() > 0.5,

        // Additional profile fields
        bio: foundFreelancer.bio,
        about: foundFreelancer.about,
        cricketRole: foundFreelancer.cricketRole,
        battingStyle: foundFreelancer.battingStyle,
        bowlingStyle: foundFreelancer.bowlingStyle,
        languages: foundFreelancer.languages,
        completionRate: foundFreelancer.completionRate,
        skills: foundFreelancer.skills,

        // Services, portfolio, experience, and reviews data
        services: foundFreelancer.services,
        portfolio: foundFreelancer.portfolio,
        experienceDetails: foundFreelancer.experienceDetails,
        reviewsData: foundFreelancer.reviewsData
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

  const handleSkillClick = (skillName: string) => {
    const skillInfo = getSkillInfo(skillName);
    setSelectedSkillInfo(skillInfo);
    setIsSkillDialogOpen(true);
  };

  const handleViewAllServices = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fromPortfolio');
      sessionStorage.removeItem('fromReviews');
      sessionStorage.setItem('fromServices', 'true');
      sessionStorage.setItem('lastVisitedSection', 'services');
      
      const url = new URL(window.location.href);
      url.hash = '#services';
      const currentUrl = url.toString();
      
      sessionStorage.setItem('returnToProfilePreview', currentUrl);
      
      window.location.href = `/services#fromPreview`;
    }
  };

  const handleViewAllReviews = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('fromServices');
      sessionStorage.removeItem('fromPortfolio');
      sessionStorage.setItem('fromReviews', 'true');
      
      const url = new URL(window.location.href);
      url.hash = '#reviews';
      const currentUrl = url.toString();
      
      sessionStorage.setItem('returnToProfilePreview', currentUrl);
      
      window.location.href = `/freelancer/profile/preview/reviews`;
    }
  };

  const handleShare = async () => {
    if (!freelancer) return;

    const shareData = {
      title: `${freelancer.name}'s Profile`,
      text: `Check out ${freelancer.name}'s profile on DoodLance`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    // Try Web Share API first
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    // Fallback to clipboard
    if (navigator.clipboard && shareData.url) {
      await navigator.clipboard.writeText(shareData.url);
      return;
    }

    // Fallback for browsers that don't support either API
    const input = document.createElement('input');
    input.value = shareData.url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tabId);
    
    if (tabId === 'top') {
      // Special handling for profile (top) tab
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (history.pushState) {
        history.pushState(null, '', '#');
      } else {
        window.location.hash = '';
      }
      return;
    }
    
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Intersection Observer for tab navigation
  useEffect(() => {
    if (!freelancer) return;

    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveTab(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [freelancer]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
          <div className="text-white/60">Loading...</div>
        </div>
      )}

      {!loading && !freelancer && (
        <div className="flex flex-col items-center justify-center h-screen bg-[#0F0F0F]">
          <div className="text-white/60 text-lg">Freelancer not found</div>
          <Button
            onClick={handleBack}
            className="mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Go Back
          </Button>
        </div>
      )}

      {!loading && freelancer && (
        <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Header - Using ProfileHeader component style */}
            <section id="top" data-section="top" className="scroll-mt-20">
              <div className="w-full bg-[#0f0f0f]">
                {/* Cover Photo */}
                <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">
                  {/* Back and Share Buttons */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBack}
                      className="h-10 w-10 rounded-xl bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-200 border border-white/10"
                      aria-label="Back"
                    >
                      <ArrowLeft className="h-5 w-5 text-white" />
                    </Button>

                    <button
                      onClick={handleShare}
                      aria-label="Share profile"
                      className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors duration-200">
                        <Share2 className="h-4 w-4" />
                      </div>
                    </button>
                  </div>

                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="/images/cover-pic.JPG"
                      alt="Profile Cover"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDEyMDAgMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNkI0NkMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Dcmlja2V0IENvdmVyPC90ZXh0Pjwvc3ZnPg=='
                      }}
                    />
                  </div>
                </div>

                {/* Profile Content */}
                <div className="max-w-6xl mx-auto px-4 relative">
                  <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between -mt-16 mb-4 relative">
                    {/* Profile Picture */}
                    <div className="relative group">
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E] overflow-hidden bg-[#111111]">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={freelancer.image} alt={freelancer.name} />
                          <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      </div>
                      {/* ID Verified Badge - Mobile: left side of profile picture */}
                      <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 -left-28 ml-0">
                        <IdVerifiedBadge isVerified={true} />
                      </div>
                      {/* Online Badge - Mobile: right side of profile picture */}
                      <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 left-full ml-10">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-bold border-2 shadow-lg whitespace-nowrap transform rotate-[-2deg] ${
                          freelancer.online
                            ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/50 border-dashed'
                            : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/50 border-dashed'
                        }`}>
                          <span className="tracking-widest font-black">{freelancer.online ? 'GAME ON' : 'OFFLINE'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Online Badge - Desktop: top right corner */}
                    <div className="hidden md:block absolute top-8 right-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border-2 shadow-xl whitespace-nowrap transform rotate-[1deg] ${
                        freelancer.online
                          ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/60 border-dashed'
                          : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/60 border-dashed'
                      }`}>
                        <span className="tracking-widest font-black">{freelancer.online ? 'GAME ON' : 'OFFLINE'}</span>
                      </div>
                    </div>
                    
                    {/* ID Verified Badge - Desktop: left corner of profile picture */}
                    <div className="hidden md:block absolute top-8 -left-28 transform rotate-[1deg]">
                      <IdVerifiedBadge isVerified={true} isDesktop={true} />
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <h1 className="text-2xl font-bold text-white">{freelancer.name}</h1>
                    </div>
                    <p className="text-purple-400 mt-0.5">{freelancer.service}</p>
                    
                    <div className="mt-2 flex flex-col items-center gap-0.5 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <span>{freelancer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(freelancer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                          />
                        ))}
                        <span className="ml-1 font-medium text-white">{freelancer.rating.toFixed(1)}</span>
                        <span className="mx-1">·</span>
                        <span>{freelancer.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>


                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 pb-2">
                    {(freelancer.skills || freelancer.expertise)?.map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => handleSkillClick(skill)}
                        className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 rounded-full px-2 py-0.5 text-xs transition-colors cursor-pointer"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Sticky Tab Navigation */}
            <div className="sticky -top-1 z-50 bg-[#0f0f0f] border-b border-white/5">
              <div className="relative w-full overflow-hidden">
                <div 
                  className="flex overflow-x-auto hide-scrollbar px-4 max-w-4xl mx-auto tabs-container" 
                  ref={tabsContainerRef}
                  style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}>
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        onClick={(e) => handleTabClick(tab.id, e)}
                        className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-200 relative ${
                          isActive 
                            ? 'text-white font-semibold' 
                            : 'text-white/60 hover:text-white/90'
                        }`}
                        style={{
                          position: 'relative',
                          zIndex: isActive ? 2 : 1,
                        }}
                      >
                        {tab.label}
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Gradient fade effect on the right side */}
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
              </div>
            </div>

            <div className="w-full max-w-4xl mx-auto">
              {/* Main Content */}
              <div className="px-6 pb-8">
                <div className="space-y-8">
                  {/* About Section */}
                  <section id="about" data-section="about" className="scroll-mt-20 pt-4">
                    <p className="text-white mb-6 whitespace-pre-line">{freelancer.bio || freelancer.about}</p>

                    {/* Cricket Information */}
                    <div className="space-y-2 mb-6">
                      {freelancer.cricketRole && (
                        <div className="text-white/80">
                          <span className="text-white/50">Role:</span> <span className="text-white">{freelancer.cricketRole}</span>
                        </div>
                      )}
                      {freelancer.battingStyle && (
                        <div className="text-white/80">
                          <span className="text-white/50">Batting Style:</span> <span className="text-white">{freelancer.battingStyle}</span>
                        </div>
                      )}
                      {freelancer.bowlingStyle && (
                        <div className="text-white/80">
                          <span className="text-white/50">Bowling Style:</span> <span className="text-white">{freelancer.bowlingStyle}</span>
                        </div>
                      )}
                      {freelancer.languages && (
                        <div className="text-white/80">
                          <span className="text-white/50">Languages:</span> <span className="text-white">{freelancer.languages}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-6 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-white/60">Response Time</span>
                          <span className="font-medium text-white">{freelancer.responseTime}</span>
                        </div>
                      </div>
                      <div className="h-4 w-px bg-white/10"></div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-white/60">Completion Rate</span>
                          <span className="font-medium text-white">{freelancer.completionRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-white">Availability</h3>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
                            <span>Available</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {freelancer.availability.map((day, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                  day.available
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-white/5 text-white/40'
                                }`}
                              >
                                {day.day.substring(0, 1)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Working Hours Dropdown */}
                        <div className="mt-4">
                          <button
                            onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                            className="w-full flex items-center justify-between p-3 bg-[#1E1E1E] border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-400" />
                              <span className="text-sm text-white font-medium">Working Hours</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isHoursDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isHoursDropdownOpen && (
                            <div className="mt-2 p-3 bg-[#1E1E1E] border border-white/10 rounded-lg">
                              {/* Detailed hours by day */}
                              <div className="space-y-1">
                                {freelancer.availability.filter(day => day.available).map((day, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-white/60">{day.day}:</span>
                                    <span className="text-white/80">9 AM - 6 PM</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-white mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills?.map((skill, i) => (
                            <button
                              key={i}
                              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs rounded-full transition-colors cursor-pointer"
                            >
                              {skill}
                            </button>
                          )) || freelancer.expertise?.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Services Section */}
                  {freelancer.services && freelancer.services.length > 0 && (
                    <section id="services" data-section="services" className="pt-8 scroll-mt-20 relative group">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-white mb-1">My Services</h2>
                        <p className="text-white/60 text-sm">Professional services tailored to your needs</p>
                      </div>

                      <div className="relative">
                        <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                          <div className="flex gap-4 px-2">
                            {freelancer.services.map((service) => (
                              <div key={service.id} className="w-80 flex-shrink-0 p-5 pt-8 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full relative">
                                <div className="flex flex-col h-full">
                                  <div className="flex-1 mt-2">
                                    <div className="flex items-start justify-between">
                                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                                    </div>

                                    <p className="text-white/70 mt-2 text-sm">{service.description}</p>

                                    {service.features && service.features.length > 0 && (
                                      <ul className="mt-3 space-y-2">
                                        {service.features.map((feature, i) => (
                                          <li key={i} className="flex items-start text-sm text-white/80">
                                            <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>

                                  <div className="mt-4 pt-4 relative">
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                    <div className="flex flex-col gap-3">
                                      <div className="flex items-center justify-between">
                                        <div className="text-xl font-bold text-white">
                                          {service.price}
                                        </div>
                                        <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">
                                          {service.deliveryTime}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                                          Hire Me
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleViewAllServices}
                        className="w-full mt-4 py-3 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white rounded-[6px]"
                      >
                        View All {freelancer.services.length} Services
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </section>
                  )}

                  {/* Portfolio Section */}
                  {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                    <section id="portfolio" data-section="portfolio" className="pt-8 scroll-mt-20 relative group">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-white mb-1">My Portfolio</h2>
                        <p className="text-white/60 text-sm">Showcase of my best work and projects</p>
                      </div>

                      <div className="relative">
                        <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                          <div className="flex gap-4 px-2">
                            {freelancer.portfolio.map((item) => (
                              <div
                                key={item.id}
                                className="w-80 flex-shrink-0 group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                                role="button"
                                tabIndex={0}
                                aria-label={`Open portfolio item: ${item.title}`}
                                onClick={() => {
                                  if (typeof window !== 'undefined') {
                                    try {
                                      const url = new URL(window.location.href);
                                      url.hash = '#portfolio';
                                      sessionStorage.setItem('returnToProfilePreview', url.toString());
                                    } catch {}
                                    window.location.href = `/freelancer/profile/preview/portfolio/${item.id}`;
                                  }
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    if (typeof window !== 'undefined') {
                                      try {
                                        const url = new URL(window.location.href);
                                        url.hash = '#portfolio';
                                        sessionStorage.setItem('returnToProfilePreview', url.toString());
                                      } catch {}
                                      window.location.href = `/freelancer/profile/preview/portfolio/${item.id}`;
                                    }
                                  }
                                }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 rounded-xl"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIFRodW1ibmFpbCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+'
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                  </div>
                                </div>
                                <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
                                  <div className="flex justify-between items-end">
                                    <div className="pr-2">
                                      <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            sessionStorage.removeItem('fromServices');
                            sessionStorage.removeItem('fromReviews');
                            sessionStorage.setItem('fromPortfolio', 'true');
                            sessionStorage.setItem('lastVisitedSection', 'portfolio');
                            
                            const url = new URL(window.location.href);
                            url.hash = '#portfolio';
                            const currentUrl = url.toString();
                            
                            sessionStorage.setItem('returnToProfilePreview', currentUrl);
                            
                            window.location.href = `/freelancer/profile/preview/portfolio#fromPreview`;
                          }
                        }}
                        className="w-full mt-2 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white rounded-[6px]"
                      >
                        View All {freelancer.portfolio.length} Portfolio Items
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </section>
                  )}

                  {/* Experience Section */}
                  {freelancer.experienceDetails && freelancer.experienceDetails.length > 0 && (
                    <section id="experience" data-section="experience" className="pt-8 scroll-mt-20 relative group z-0">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-1">Experience & Qualifications</h2>
                        <p className="text-white/60 text-sm">My professional journey and credentials</p>
                      </div>

                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10"></div>

                        <div className="space-y-4">
                          {freelancer.experienceDetails.map((exp) => (
                            <div key={exp.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center z-10">
                                  <Briefcase className="h-5 w-5 text-white" />
                                </div>
                                <div className="w-px h-full bg-white/10 my-2"></div>
                              </div>

                              <div className="flex-1 pb-4">
                                <h3 className="font-medium text-white">{exp.role}</h3>
                                <p className="text-white/70">{exp.company}</p>

                                <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>{exp.location}</span>
                                  <span className="mx-1">•</span>
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                  </span>
                                </div>

                                {exp.description && (
                                  <p className="mt-3 text-sm text-white/80 leading-relaxed">{exp.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Reviews Section */}
                  {freelancer.reviewsData && freelancer.reviewsData.length > 0 && (
                    <section id="reviews" data-section="reviews" className="pt-8 scroll-mt-20 relative group">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-white">Client Reviews</h2>
                          <p className="text-sm text-white/60">What clients say about working with me</p>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <div className="flex items-center text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(freelancer.rating) ? 'fill-current' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                          <div className="text-white">
                            <span className="font-medium">{freelancer.rating.toFixed(1)}</span>
                            <span className="text-white/60"> ({freelancer.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                          <div className="flex gap-4 px-2">
                            {freelancer.reviewsData.map((review) => (
                              <div
                                key={review.id}
                                className="w-80 flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                      <div className="w-5 h-5 rounded-full bg-white/20"></div>
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="font-medium text-white text-sm truncate">{review.author}</h4>
                                      {review.role && (
                                        <div className="text-xs text-white/60 truncate">
                                          {review.role}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-xs text-white/40 whitespace-nowrap ml-2">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-white/80 flex-1">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={handleViewAllReviews}
                        className="w-full mt-3 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white rounded-[6px]"
                      >
                        View All {freelancer.reviewsData.length} Reviews
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </section>
                  )}
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

          {/* Skill Info Dialog */}
          <SkillInfoDialog
            isOpen={isSkillDialogOpen}
            onClose={() => setIsSkillDialogOpen(false)}
            skillInfo={selectedSkillInfo}
          />
        </div>
      )}
    </div>
  );
}
