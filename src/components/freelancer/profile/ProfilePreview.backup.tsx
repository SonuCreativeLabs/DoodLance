'use client';

import { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSectionObserver } from '@/hooks/useSectionObserver';
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
  // Router and refs
  const router = useRouter();
  const navContainerRef = useRef<HTMLDivElement>(null);
  
  // Use the section observer hook for scroll and tab management
  const { activeSection, handleTabClick, isScrolling } = useSectionObserver();
  
  // Function to scroll active tab into view
  const scrollToActiveTab = useCallback((sectionId: string) => {
    if (!navContainerRef.current) return;
    
    const navElement = document.getElementById(`nav-${sectionId}`);
    if (!navElement) return;
    
    const container = navContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = navElement.getBoundingClientRect();
    
    const containerCenter = containerRect.left + containerRect.width / 2;
    const elementCenter = elementRect.left + elementRect.width / 2;
    const scrollOffset = elementCenter - containerCenter;
    
    const newScrollLeft = container.scrollLeft + scrollOffset;
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  }, []);
  
  // Scroll active tab into view when active section changes
  useEffect(() => {
    if (activeSection) {
      scrollToActiveTab(activeSection);
    }
  }, [activeSection, scrollToActiveTab]);
  
  // Refs for section elements
  const sectionsRef = useRef<{[key: string]: HTMLElement | null}>({
    about: null,
    services: null,
    portfolio: null,
    experience: null,
    reviews: null,
  });
  
  // Track section elements for observation
  const sectionElementsRef = useRef<Element[]>([]);
  
  // Get all section elements with data-section attribute
  const getAllSectionElements = useCallback((): Element[] => {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll('[data-section]');
    return Array.from(elements);
  }, []);
  
  // Handle scroll to specific section when returning from a full page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if we need to scroll to the reviews section
    const scrollToReviews = sessionStorage.getItem('scrollToReviews');
    
    // Function to scroll to the reviews section
    const scrollToReviewsSection = () => {
      // Clear the scroll flag
      sessionStorage.removeItem('scrollToReviews');
      
      // Set a flag to indicate we're scrolling to the reviews section
      sessionStorage.setItem('scrollToReviews', 'true');
      
      // Scroll to the section after a small delay to ensure the modal is fully loaded
      const timer = setTimeout(() => {
        const section = document.getElementById('reviews');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          setActiveSection('reviews');
          scrollToActiveTab('reviews');
        }
      }, 100);
      
      return timer;
    };
    
    let timer: NodeJS.Timeout | null = null;
    
    // Check if we need to scroll to reviews
    if (scrollToReviews === 'true') {
      timer = scrollToReviewsSection();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);
  
  // Track scroll position and update active section
  useEffect(() => {
    if (!isOpen) return;
    
    // Store section elements for better performance
    const sectionElements = {
      about: document.getElementById('about'),
      services: document.getElementById('services'),
      portfolio: document.getElementById('portfolio'),
      experience: document.getElementById('experience'),
      reviews: document.getElementById('reviews')
    };
    
    // Get section IDs for scroll detection (excluding 'top')
    const sectionIds = ['about', 'services', 'portfolio', 'experience', 'reviews'];
    
    // Function to scroll the active tab into view
    const scrollActiveTabIntoView = (sectionId: string) => {
      const navElement = document.querySelector(`a[href="#${sectionId}"]`);
      const navContainer = navContainerRef.current;
      
      if (navElement && navContainer) {
        const navRect = navElement.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const navLeft = navRect.left - containerRect.left;
        const navWidth = navRect.width;
        
        // Calculate scroll position to center the active tab
        const scrollLeft = navContainer.scrollLeft;
        const targetScroll = navLeft + scrollLeft - (containerWidth / 2) + (navWidth / 2);
        
        // Smoothly scroll the nav container
        navContainer.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }
    };
    
    // Set initial active section to 'top' when the component mounts
    setActiveSection('top');
    activeSectionRef.current = 'top';
    
    // Get all section elements with data-section attribute
    const sections = Array.from(document.querySelectorAll('[data-section]'));
    
    // Check all sections (excluding 'top' since we handled it above)
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const sectionId = section.getAttribute('data-section');
      if (!sectionId) continue;
    const sectionsToObserve = getAllSectionElements();
    
    // Observe all section elements
    sectionsToObserve.forEach((el: Element) => {
      currentObserver.observe(el);
    });
    
    // Handle window resize for responsive adjustments
    const handleResize = () => {
      if (activeSectionRef.current) {
        scrollToActiveTab(activeSectionRef.current);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set initial active section if none is set
    if (sectionElementsRef.current.length > 0 && !activeSectionRef.current) {
      const firstSection = sectionElementsRef.current[0].getAttribute('data-section');
      if (firstSection) {
        setActiveSection(firstSection);
        scrollToActiveTab(firstSection);
      }
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Unobserve all elements
      if (currentObserver) {
        sectionElementsRef.current.forEach((el) => {
          currentObserver.unobserve(el);
        });
        sectionElementsRef.current = [];
      }
      
      // Clean up timers
      if (scrollTimer.current) {
        cancelAnimationFrame(scrollTimer.current);
        scrollTimer.current = null;
      }
      
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
        scrollEndTimer.current = null;
      }
      
      // Reset scrolling flag
      isScrolling.current = false;
    };
  }, [isOpen]);

  // Use the section observer hook
  const { activeSection, handleTabClick, isScrolling } = useSectionObserver();
  const navContainerRef = useRef<HTMLDivElement>(null);
    
    // Update active section immediately
    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
    isScrolling.current = true;
    
    // Clear any existing timeouts
    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current);
    }
    
    // Update URL hash without causing a page reload
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.hash = sectionId === 'top' ? '' : `#${sectionId}`;
      window.history.replaceState({}, '', newUrl.toString());
    }
    
    // Get the scrollable content container - use the modal's scroll container
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (!scrollContainer) return;
    
    // Handle top section - scroll to top of the content
    if (sectionId === 'top') {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      scrollToActiveTab(sectionId);
      
      scrollEndTimer.current = setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
      return;
    }
    
    // For other sections, find the element and scroll to it
    const element = document.getElementById(sectionId);
    if (element) {
      // Disable any default scroll behavior
      element.scrollIntoView = () => {};
      
      // Calculate the exact position relative to the scroll container
      const headerOffset = 80; // Height of the sticky header
      const elementRect = element.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      
      // Calculate the exact scroll position needed to show the element at the top of the viewport
      const scrollPosition = element.offsetTop - headerOffset;
      
      // If we're already at or very close to the target position, don't scroll
      const currentScroll = scrollContainer.scrollTop;
      if (Math.abs(currentScroll - scrollPosition) < 5) {
        isScrolling.current = false;
        return;
      }

      // Smooth scroll to the calculated position
      scrollContainer.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
      
      // Update the active tab in the navigation
      scrollToActiveTab(sectionId);
      
      // Reset scrolling flag after animation completes
      scrollEndTimer.current = setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };
  
  // Reset active section when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset to top when modal opens
      setActiveSection('top');
      activeSectionRef.current = 'top';
      
      // Ensure the profile tab is scrolled into view
      setTimeout(() => {
        scrollToActiveTab('top');
      }, 100);
    }
    
    return () => {
      // Cleanup function
    };
  }, [isOpen]);
  
  // Handle body scroll lock when modal is open
  // Store scroll position in a ref to persist between renders
  const scrollY = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    
    // Store current scroll position
    scrollY.current = window.scrollY || document.documentElement.scrollTop;
    
    // Set initial active section after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setActiveSection('top');
      activeSectionRef.current = 'top';
      // Force scroll to top to ensure we're at the start
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
      }
      scrollToActiveTab('top');
    }, 100);
    
    // Add a class to the body to handle the lock
    document.body.classList.add('preview-open');
    
    // Apply styles directly to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      // Restore body styles
      document.body.classList.remove('preview-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      // Restore scroll position
      window.scrollTo(0, scrollY.current);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal((
    <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header with title and actions (Share, Close) */}
      <div className="px-4 py-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="ml-0">
              <h1 className="text-lg font-semibold text-white">Profile Preview</h1>
              <p className="text-white/50 text-xs">Preview how your profile appears to others</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                try {
                  const shareData = {
                    title: 'Profile Preview',
                    text: 'Check out this profile preview',
                    url: typeof window !== 'undefined' ? window.location.href : ''
                  };
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {});
                  } else if (navigator.clipboard && shareData.url) {
                    navigator.clipboard.writeText(shareData.url).then(() => {
                      // Optional: show lightweight feedback; keeping silent per minimal change
                    }).catch(() => {});
                  }
                } catch {}
              }}
              aria-label="Share profile preview"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <Share2 className="h-4 w-4" />
              </div>
            </button>
            <button 
              onClick={onClose}
              aria-label="Close preview"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <X className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <section id="top" className="scroll-mt-20">
          <div className="w-full bg-[#0f0f0f]">
            <ProfileHeader {...profileData} isPreview={true} />
          </div>
        </section>
        
        <div className="w-full max-w-4xl mx-auto">
          {/* Optimized Sticky Navigation with Smooth Transitions */}
          <div className="sticky top-0 z-50 w-full bg-[#0f0f0f] border-b border-white/10 backdrop-blur-sm">
            <div className="relative">
              {/* Left gradient overlay */}
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none"></div>
              
              {/* Right gradient overlay */}
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none"></div>
              
              {/* Navigation container with horizontal scroll */}
              <div 
                ref={navContainerRef}
                className="relative w-full overflow-x-auto scrollbar-hide"
                style={{
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  scrollSnapType: 'x mandatory',
                  scrollPadding: '0 1.5rem'
                }}
              >
                <nav className="relative">
                  <div className="flex items-center px-6">
                    <ul className="flex space-x-6 py-1.5 pr-6">
                    {navTabs.map((tab) => {
                      const isActive = activeSection === tab.id;
                      return (
                        <li key={tab.id} className="flex-shrink-0 snap-start">
                          <a
                            id={`nav-${tab.id}`}
                            href={`#${tab.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTabClick(tab.id);
                            }}
                            className={`relative block py-2 text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                              isActive ? 'text-white' : 'text-white/60 hover:text-white/90'
                            }`}
                          >
                            {tab.label}
                            <span 
                              className={`absolute bottom-0 left-1 right-1 h-[2px] rounded-full transition-all duration-200 ${
                                isActive ? 'bg-white scale-100' : 'scale-0'
                              }`}
                            />
                          </a>
                        </li>
                      );
                    })}
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-6 pb-8">
            <div className="space-y-8">
            {/* About Section */}
            <section id="about" data-section="about" className="scroll-mt-20 pt-8">
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
              </div>
            </section>

            {/* Services Section */}
            <section id="services" data-section="services" className="pt-8 scroll-mt-20 relative group">
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
              <button 
                onClick={() => {
                  // Create a URL with the modal state and section hash
                  const url = new URL(window.location.href);
                  url.hash = '#services';
                  const currentUrl = url.toString();
                  
                  console.log('Storing return URL for services:', currentUrl);
                  sessionStorage.setItem('returnToProfilePreview', currentUrl);
                  
                  // Store services data in session storage
                  sessionStorage.setItem('servicesPreviewData', JSON.stringify(profileData.services));
                  sessionStorage.setItem('freelancerName', profileData.name);
                  
                  // Navigate to services page with preview flag
                  console.log('Navigating to services page');
                  window.location.href = `/services#fromPreview`;
                }}
                className="w-full mt-4 py-3 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" 
                style={{ borderRadius: '6px' }}
              >
                View All {profileData.services.length} Services
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" data-section="portfolio" className="pt-8 scroll-mt-20 relative group">
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
                  <button 
                    onClick={handleViewAllPortfolio}
                    className="w-full mt-2 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" 
                    style={{ borderRadius: '6px' }}
                  >
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
            <section 
              id="experience" 
              data-section="experience"
              className="pt-8 scroll-mt-20 relative group"
              ref={(el: HTMLElement | null) => {
                if (el) sectionsRef.current.experience = el;
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
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
            <section 
              id="reviews" 
              data-section="reviews"
              className="pt-8 scroll-mt-20 relative group">
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
                  <button 
                    onClick={handleViewAllReviews}
                    className="w-full mt-3 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white" 
                    style={{ borderRadius: '6px' }}
                  >
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
      </div>
      </div>
    </div>
  ), document.body);
}
