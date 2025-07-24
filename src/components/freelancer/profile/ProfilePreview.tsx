'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  LayoutGrid,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  User,
  X
} from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Local Components
import { ProfileHeader } from './ProfileHeader';

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  type?: 'online' | 'in-person';
  deliveryTime: string;
  features?: string[];
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface Review {
  id: string;
  author: string;
  role?: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
}

interface Availability {
  day: string;
  available: boolean;
}

interface ProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
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
    skills: string[];
    experience: Experience[];
    services: Service[];
    portfolio: PortfolioItem[];
    reviews: Review[];
    availability: Availability[];

    completedJobs?: number;
    activeJobs?: number;
  };
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to get availability text
const getAvailabilityText = (availability: Array<{day: string, available: boolean}>) => {
  const availableDays = availability
    .filter(day => day.available)
    .map(day => day.day.substring(0, 3));
  
  if (availableDays.length === 7) return 'Available every day';
  if (availableDays.length === 5 && 
      !availableDays.includes('Sat') && 
      !availableDays.includes('Sun')) {
    return 'Available weekdays';
  }
  return `Available: ${availableDays.join(', ')}`;
};

export function ProfilePreview({ 
  isOpen = false, 
  onClose = () => {}, 
  profileData 
}: Partial<ProfilePreviewProps> & { profileData: ProfilePreviewProps['profileData'] }) {
  const [activeSection, setActiveSection] = useState('top');
  const [isMounted, setIsMounted] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout>();
  const isScrolling = useRef(false);
  const scrollEndTimer = useRef<NodeJS.Timeout>();
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Track scroll position and update active section
  useEffect(() => {
    if (!isOpen) return;
    
    const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement | null;
    if (!scrollContainer) {
      console.warn('Scroll container not found');
      return;
    }
    
    const updateActiveSection = () => {
      if (isScrolling.current) return;
      
      const sections = ['about', 'services', 'portfolio', 'experience', 'reviews'];
      const viewportHeight = window.innerHeight;
      let newActiveSection = 'top';
      let maxVisible = 0;
      
      // Check if we're at the top of the page
      const header = document.querySelector('.profile-header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        if (headerRect.top >= 0 && headerRect.bottom > viewportHeight * 0.7) {
          setActiveSection('top');
          return;
        }
      }
      
      // Find which section has the most visible area in the viewport
      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibleRatio = visibleHeight / viewportHeight;
        
        if (visibleRatio > maxVisible) {
          maxVisible = visibleRatio;
          newActiveSection = section;
        }
      }
      
      // If we found a section with significant visibility, update the active tab
      if (maxVisible > 0.2 && newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };
    
    // Debounce scroll handler
    const handleScroll = () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      scrollTimer.current = setTimeout(() => {
        updateActiveSection();
      }, 50);
    };
    
    // Handle smooth scrolling to section
    const scrollToSection = (sectionId: string) => {
      isScrolling.current = true;
      setActiveSection(sectionId);
      
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Reset the scrolling flag after the scroll is complete
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
      }
      scrollEndTimer.current = setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    };
    
    // Store the scrollToSection function in the component's scope
    (window as any).scrollToSection = scrollToSection;
    
    // Add scroll listener to the window
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    updateActiveSection();
    
    // Cleanup
    return () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
      }
      window.removeEventListener('scroll', handleScroll);
      delete (window as any).scrollToSection;
    };
  }, [isOpen, activeSection]);
  
  // Handle tab click - scroll to section
  const handleTabClick = (sectionId: string) => {
    if (sectionId === activeSection) return;
    
    setActiveSection(sectionId);
    
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Reset the scrolling flag after the scroll is complete
    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current);
    }
    scrollEndTimer.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };
  
  // Set mounted state when component mounts
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      // Cleanup function
      setIsMounted(false);
    };
  }, []);
  
  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (!isOpen) return;
    
    // Store the current scroll position
    const scrollY = window.scrollY;
    // Prevent body from scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.classList.add('preview-open');
    
    return () => {
      // Restore body scrolling and position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.classList.remove('preview-open');
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [isOpen]);
  
  if (!isOpen || !isMounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal((
    <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header with back button, title, and share button */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/5 bg-[#0F0F0F]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        
        <h2 className="text-base font-medium text-white/90">Profile Preview</h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // TODO: Implement share functionality
            console.log('Share profile');
          }}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share profile</span>
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Full Width Profile Header */}
        <div className="w-full bg-[#0f0f0f]">
          <ProfileHeader {...profileData} isPreview={true} />
        </div>
        
        <div className="w-full max-w-4xl mx-auto">
          {/* Optimized Sticky Navigation with Smooth Transitions */}
          <div className="sticky top-0 z-50 w-full bg-[#0f0f0f] border-b border-white/10 backdrop-blur-sm">
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none"></div>
                <nav className="relative px-4 overflow-x-auto scrollbar-hide">
                  <ul className="flex space-x-8 min-w-max">
                    <li className="flex-shrink-0">
                      <a
                        href="#top"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabClick('top');
                        }}
                        className={`relative block py-3 px-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                          activeSection === 'top' ? 'text-white' : 'text-white/60 hover:text-white/90'
                        }`}
                      >
                        Profile
                        <span 
                          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200 ${
                            activeSection === 'top' ? 'bg-white scale-100' : 'scale-0'
                          }`}
                        />
                      </a>
                    </li>
                    {['about', 'services', 'portfolio', 'experience', 'reviews'].map((item) => {
                      const isActive = activeSection === item;
                      return (
                        <li key={item} className="flex-shrink-0">
                          <a
                            href={`#${item}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTabClick(item);
                            }}
                            className={`relative block py-3 px-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                              isActive ? 'text-white' : 'text-white/60 hover:text-white/90'
                            }`}
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                            <span 
                              className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200 ${
                                isActive ? 'bg-white scale-100' : 'scale-0'
                              }`}
                            />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-6 pb-8">
            <div className="space-y-8">
            {/* About Section */}
            <section id="about" className="scroll-mt-20 pt-8">
              <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
              <p className="text-white/80 mb-6">{profileData.about}</p>
              
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-white/60">Response Time</span>
                    <span className="font-medium text-white">{profileData.responseTime}</span>
                  </div>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-white/60">Completion Rate</span>
                    <span className="font-medium text-white">{profileData.completionRate}%</span>
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
                    {profileData.availability.map((day, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                            day.available 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-white/5 text-white/40'
                          }`}
                        >
                          {day.day.substring(0, 1)}
                        </div>
                        <span className="text-[10px] text-white/60">
                          {day.day.substring(0, 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-white/5 text-white/80 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 py-3 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" style={{ borderRadius: '6px' }}>
                  View All {profileData.reviews.length} Reviews
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="pt-8 scroll-mt-20 relative group">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-1">My Services</h2>
                <p className="text-white/60 text-sm">Professional services tailored to your needs</p>
              </div>
              
              <div className="relative">
                <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                  <div className="flex gap-4 px-2">
                    {profileData.services.map((service) => (
                      <div key={service.id} className="w-80 flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                              {service.type && (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                  service.type === 'online' 
                                    ? 'bg-blue-500/10 text-blue-400' 
                                    : 'bg-green-500/10 text-green-400'
                                }`}>
                                  {service.type === 'online' ? 'Online' : 'In-Person'}
                                </span>
                              )}
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
                                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                                  <MessageCircle className="h-5 w-5" />
                                </button>
                                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                                  Book Now
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
              <button className="w-full mt-4 py-3 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" style={{ borderRadius: '6px' }}>
                View All 4 Services
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="pt-8 scroll-mt-20 relative group">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-1">My Portfolio</h2>
                <p className="text-white/60 text-sm">Showcase of my best work and projects</p>
              </div>
              
              {profileData.portfolio.length > 0 ? (
                <div className="relative">
                  <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex gap-4 px-2">
                      {profileData.portfolio.map((item) => (
                        <div 
                          key={item.id} 
                          className="w-80 flex-shrink-0 group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                          <div className="relative w-full h-full">
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
                                  <p className="text-xs text-white/80 mt-0.5">{item.category}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full mt-2 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" style={{ borderRadius: '6px' }}>
                    View All {profileData.portfolio.length} Portfolio Items
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 rounded-3xl border border-white/10 bg-white/5">
                  <Award className="h-12 w-12 mx-auto text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white">No portfolio items yet</h3>
                  <p className="text-white/60 mt-1">Showcase your best work to attract more clients</p>
                </div>
              )}
            </section>

            {/* Experience Section */}
            <section id="experience" className="pt-8 scroll-mt-20 relative group"
              ref={(el) => {
                sectionsRef.current.experience = el;
              }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Experience & Qualifications</h2>
                <p className="text-white/60 text-sm">My professional journey and credentials</p>
              </div>
              
              {profileData.experience?.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10"></div>
                  
                  <div className="space-y-4">
                    {profileData.experience.map((exp) => (
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
              ) : (
                <div className="text-center py-8 rounded-2xl border border-white/10 bg-white/5">
                  <Briefcase className="h-10 w-10 mx-auto text-white/20 mb-3" />
                  <h3 className="text-lg font-medium text-white">No experience added yet</h3>
                  <p className="text-white/60 mt-1">Add your professional experience to build trust with clients</p>
                </div>
              )}
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="pt-8 scroll-mt-20 relative group">
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
                        className={`h-5 w-5 ${i < Math.floor(profileData.rating) ? 'fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <div className="text-white">
                    <span className="font-medium">{profileData.rating.toFixed(1)}</span>
                    <span className="text-white/60"> ({profileData.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              {profileData.reviews?.length > 0 ? (
                <div className="relative">
                  <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                    <div className="flex gap-4 px-2">
                      {profileData.reviews.map((review) => (
                        <div 
                          key={review.id} 
                          className="w-80 flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-white/60" />
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
                  <button className="w-full mt-3 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" style={{ borderRadius: '6px' }}>
                    View All {profileData.reviews.length} Reviews
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 rounded-3xl border border-white/10 bg-white/5">
                  <MessageSquare className="h-12 w-12 mx-auto text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white">No reviews yet</h3>
                  <p className="text-white/60 mt-1">Your reviews will appear here once clients leave feedback</p>
                </div>
              )}
            </section>
          </div>
        </div>

          {/* CTA Buttons - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#111111]/95 backdrop-blur-sm py-3 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-2 gap-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base transition-all duration-200 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message Me
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10 h-12 text-base transition-all duration-200 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Hire Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), document.body);
}
