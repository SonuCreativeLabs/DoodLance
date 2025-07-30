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
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('top');
  const activeSectionRef = useRef('top');
  const scrollTimer = useRef<number | null>(null);

  // Handle view all portfolio click
  const handleViewAllPortfolio = () => {
    if (typeof window !== 'undefined') {
      // Create a URL with the modal state and section hash
      const url = new URL(window.location.href);
      url.hash = '#portfolio';
      const currentUrl = url.toString();
      
      console.log('Storing return URL for portfolio:', currentUrl);
      sessionStorage.setItem('returnToProfilePreview', currentUrl);
      
      // Store portfolio data in session storage
      sessionStorage.setItem('portfolioPreviewData', JSON.stringify(profileData.portfolio));
      sessionStorage.setItem('freelancerName', profileData.name);
      
      // Navigate to portfolio page with preview flag
      console.log('Navigating to portfolio page');
      window.location.href = `/freelancer/profile/preview/portfolio#fromPreview`;
    }
  };

  // Handle view all reviews click
  const handleViewAllReviews = () => {
    if (typeof window !== 'undefined') {
      // Create a URL with the modal state and section hash
      const url = new URL(window.location.href);
      url.hash = '#reviews';
      const currentUrl = url.toString();
      
      console.log('Storing return URL for reviews:', currentUrl);
      sessionStorage.setItem('returnToProfilePreview', currentUrl);
      
      // Store reviews data in session storage
      sessionStorage.setItem('reviewsPreviewData', JSON.stringify(profileData.reviews));
      sessionStorage.setItem('freelancerName', profileData.name);
      
      // Navigate to reviews page with preview flag
      console.log('Navigating to reviews page');
      window.location.href = `/freelancer/profile/preview/reviews#fromPreview`;
    }
  };
  const scrollEndTimer = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Define navigation tabs type
  type NavTab = {
    id: string;
    label: string;
  };
  
  // Define navigation tabs
  const navTabs: NavTab[] = [
    { id: 'top', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Experience' },
    { id: 'reviews', label: 'Reviews' }
  ];
  
  // Function to scroll to the active tab in the navigation
  const scrollToActiveTab = (sectionId: string) => {
    if (!navContainerRef.current) return;
    
    // If it's the top section, scroll to start
    if (sectionId === 'top') {
      navContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const navElement = document.getElementById(`nav-${sectionId}`);
    if (!navElement) return;
    
    const container = navContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = navElement.getBoundingClientRect();
    
    // Calculate the center position of the element relative to the container
    const containerCenter = containerRect.left + (containerRect.width / 2);
    const elementCenter = elementRect.left + (elementRect.width / 2);
    const scrollOffset = elementCenter - containerCenter;
    
    // Calculate the new scroll position
    const newScrollLeft = container.scrollLeft + scrollOffset;
    
    // Smooth scroll to the calculated position
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

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
    const sectionIds = navTabs
      .filter((tab) => tab.id !== 'top')
      .map(tab => tab.id);
    
    // Function to scroll the active tab into view
    const scrollActiveTabIntoView = (sectionId: string) => {
      const navElement = document.querySelector(`a[href="#${sectionId}"]`);
      const navContainer = navContainerRef.current;
      
      if (navElement && navContainer) {
        const navRect = navElement.getBoundingClientRect();
        const containerRect = navContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const navLeft = navRect.left - containerRect.left;
        const navRight = navRect.right - containerRect.left;
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
    
    const updateActiveSection = () => {
      if (isScrolling.current) return;
      
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportMiddle = scrollPosition + (viewportHeight / 2);
      
      // Check all sections including 'top'
      for (const sectionId of ['top', ...sectionIds]) {
        const element = sectionId === 'top' 
          ? document.getElementById('top')
          : sectionElements[sectionId as keyof typeof sectionElements];
        
        if (!element) continue;
        
        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;
        
        // If the middle of the viewport is within this section
        if (viewportMiddle >= elementTop && viewportMiddle <= elementBottom) {
          if (activeSectionRef.current !== sectionId) {
            activeSectionRef.current = sectionId;
            setActiveSection(sectionId);
            scrollToActiveTab(sectionId);
          }
          return;
        }
      }
      
      // Default to the first section if none are in view
      let newActiveSection = sectionIds[0] || 'top';
      
      // Update active section if it has changed
      if (newActiveSection !== activeSectionRef.current) {
        activeSectionRef.current = newActiveSection;
        setActiveSection(newActiveSection);
        scrollToActiveTab(newActiveSection);
      }
    };
    
    // Throttle scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Initialize the observer ref if it doesn't exist
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && sectionId !== activeSectionRef.current) {
              activeSectionRef.current = sectionId;
              setActiveSection(sectionId);
              scrollActiveTabIntoView(sectionId);
            }
          }
        }
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
      });
    }
    
    // Store the current observer in a const for the cleanup function
    const currentObserver = observer.current;
    
    // Observe all section elements
    Object.values(sectionElements).forEach(el => {
      if (el) currentObserver.observe(el);
    });
    
    // Initial check
    updateActiveSection();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set up resize observer to handle window resizing
    const handleResize = () => {
      scrollToActiveTab(activeSectionRef.current);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Unobserve all elements
      Object.values(sectionElements).forEach(el => {
        if (el && currentObserver) {
          currentObserver.unobserve(el);
        }
      });
      
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

  // Handle tab click - scroll to section
  const handleTabClick = (sectionId: string) => {
    if (sectionId === activeSectionRef.current) return;
    
    // Update the active section immediately
    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
    isScrolling.current = true;
    
    // Scroll the navigation to make the active tab visible
    scrollToActiveTab(sectionId);
    
    // Scroll to the section
    if (sectionId === 'top') {
      const profileSection = document.getElementById('top');
      if (profileSection) {
        profileSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback to window scroll if section not found
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 150; // Increased offset to account for sticky header and some padding
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        // Use the browser's native smooth scrolling for better performance
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Manually adjust the scroll position to account for the fixed header
        const adjustScroll = () => {
          const currentScroll = window.pageYOffset;
          const targetScroll = offsetPosition;
          
          if (Math.abs(currentScroll - targetScroll) > 1) {
            window.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            });
            requestAnimationFrame(adjustScroll);
          } else {
            isScrolling.current = false;
          }
        };
        
        // Start the adjustment
        requestAnimationFrame(adjustScroll);
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
  
  // Component mount cleanup
  useEffect(() => {
    // Any mount initialization can go here
    
    return () => {
      // Cleanup function
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
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal((
    <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
      {/* Header with back button and title */}
      <div className="px-4 py-2 border-b border-white/5">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">Profile Preview</h1>
            <p className="text-white/50 text-xs">Preview how your profile appears to others</p>
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
