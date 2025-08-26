'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X,
  User,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  MessageCircle,
  Award,
  Share2,
  MessageSquare,
  Check,
  ArrowRight
} from 'lucide-react';

// Local Components
import { ProfileHeader } from './ProfileHeader';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Types
import type { 
  ProfileData, 
  ProfilePreviewProps as Props
} from '@/types/freelancer/profile';

// Utils
import { 
  formatDate, 
  calculateAverageRating, 
  formatExperienceDuration, 
  getRecentExperiences,
  getAvailabilityText
} from '@/utils/profileUtils';

// Types
interface TabType {
  id: string;
  label: string;
}

// Tabs configuration
const tabs: TabType[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'experience', label: 'Experience' },
  { id: 'reviews', label: 'Reviews' },
];

const ProfilePreview = memo(({ 
  isOpen = false, 
  onClose = () => {}, 
  profileData 
}: { 
  isOpen?: boolean;
  onClose?: () => void;
  profileData: ProfileData & { avatar?: string };
}) => {
  // State for active section and sticky header
  const [activeSection, setActiveSection] = useState('profile');
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for section highlighting
  useEffect(() => {
    const sections = ['profile', 'about', 'services', 'portfolio', 'experience', 'reviews'];
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.1
      }
    );

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isOpen]);

  // Refs for scroll handling
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for sticky header
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      if (!headerRef.current) return;
      
      const headerHeight = headerRef.current.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > headerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
    };
  }, [isOpen]);

  // Handle scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = headerRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Set up intersection observer for active section detection
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [isOpen]);

  // Memoize expensive calculations
  const averageRating = useMemo(
    () => profileData.reviews?.reduce((acc, review) => acc + review.rating, 0) / (profileData.reviews?.length || 1) || 0,
    [profileData.reviews]
  );

  // Group services by type with proper typing
  const groupedServices = useMemo(() => {
    const groups: { online: typeof profileData.services; inPerson: typeof profileData.services } = { 
      online: [], 
      inPerson: [] 
    };
    
    profileData.services?.forEach(service => {
      if (service.type === 'online') {
        groups.online?.push(service);
      } else {
        groups.inPerson?.push(service);
      }
    });
    return groups;
  }, [profileData.services]);
  
  const { online: onlineServices, inPerson: inPersonServices } = groupedServices;

  const recentExperiences = useMemo(
    () => getRecentExperiences(profileData.experience || []),
    [profileData.experience]
  );

  // Handle backdrop click to close modal
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const handleNavClick = useCallback((section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!isOpen) return null;

  return createPortal((
    <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      {/* Fixed Header */}
      <div className="flex-none z-30 bg-[#0F0F0F] border-b border-white/5">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="ml-0">
                <h1 className="text-lg font-semibold text-white">Profile Preview</h1>
                <p className="text-white/50 text-xs">Preview how your profile appears to others</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={async () => {
                    try {
                      const shareData = {
                        title: `${profileData.name}'s Profile`,
                        text: `Check out ${profileData.name}'s profile on DoodLance`,
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
                      // Show feedback
                      const button = document.getElementById('share-button');
                      if (button) {
                        button.setAttribute('data-copied', 'true');
                        setTimeout(() => {
                          button.setAttribute('data-copied', 'false');
                        }, 2000);
                      }
                      return;
                    }

                    // Fallback for browsers that don't support either API
                      const input = document.createElement('input');
                      input.value = shareData.url;
                      document.body.appendChild(input);
                      input.select();
                      document.execCommand('copy');
                      document.body.removeChild(input);
                      
                      // Show feedback
                      const button = document.getElementById('share-button');
                      if (button) {
                        button.setAttribute('data-copied', 'true');
                        setTimeout(() => {
                          button.setAttribute('data-copied', 'false');
                        }, 2000);
                      }
                  } catch (error) {
                    console.error('Error sharing profile:', error);
                    // Optionally show an error message to the user
                  }
                }}
                id="share-button"
                aria-label="Share profile preview"
                className="group relative inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                data-copied="false"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                  <Share2 className="h-4 w-4" />
                </div>
                <span className="share-tooltip">Share Profile</span>
              </button>
              <style jsx>{`
                .share-tooltip {
                  position: absolute;
                  top: -30px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: var(--card-background);
                  color: var(--foreground);
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  white-space: nowrap;
                  opacity: 0;
                  pointer-events: none;
                  transition: opacity 0.2s;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
                button:hover .share-tooltip {
                  opacity: 1;
                }
                button[data-copied="true"] .share-tooltip::after {
                  content: '✓ Copied!';
                }
                button[data-copied="false"] .share-tooltip::after {
                  content: 'Share Profile';
                }
              `}</style>
            </div>
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
        {/* Sticky Header */}
        <div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-200"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback>{profileData.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{profileData.name}</h2>
                  <p className="text-sm text-muted-foreground">{profileData.title}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeSection === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="px-6 pb-8">
            <div className="space-y-8">
              {/* Profile Section */}
              <section id="profile" className="scroll-mt-20 pt-8">
                {/* Profile content */}
              </section>
              
              {/* About Section */}
              <section id="about" data-section="about" className="scroll-mt-20 pt-8">
              <h2 className="text-xl font-semibold text-white mb-4">About Me</h2>
              <p className="text-white/80 mb-6 whitespace-pre-line">{profileData.about}</p>
              
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
                      <div key={service.id} className="w-80 flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full">
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
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('services')}>
                View All <span className="ml-1">→</span>
              </Button>
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
                          <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                              <div 
                                ref={headerRef}
                                className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-200 ${
                                  isSticky ? 'shadow-md' : ''
                                }`}
                              >
                                <div className="container mx-auto px-4">
                                  <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center space-x-4">
                                      <Avatar>
                                        <AvatarImage src={profileData.avatar} alt={profileData.name} />
                                        <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h2 className="text-lg font-semibold">{profileData.name}</h2>
                                        <p className="text-sm text-muted-foreground">{profileData.title}</p>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={onClose}>
                                      <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                  
                                  {/* Tabs */}
                                  <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
                                    <div className="flex space-x-8">
                                      {tabs.map((tab) => (
                                        <button
                                          key={tab.id}
                                          onClick={() => scrollToSection(tab.id)}
                                          className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                            activeSection === tab.id
                                              ? 'border-primary text-primary'
                                              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/20'
                                          }`}
                                        >
                                          {tab.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
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
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => scrollToSection('portfolio')}>
                    View All <span className="ml-1">→</span>
                  </Button>
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
              className="pt-8 scroll-mt-20 relative group"
            >
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
                  <Button variant="outline" size="sm" onClick={() => scrollToSection('reviews')}>
                    View All <span className="ml-1">→</span>
                  </Button>
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
  ), document.body);


ProfilePreview.displayName = 'ProfilePreview';

export default ProfilePreview;
