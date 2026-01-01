'use client';

import { useRef, useEffect, useCallback, useMemo, memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  Share2,
  X,
  Check,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Briefcase,
  MapPin,
  Calendar,
  Star,
  ChevronDown,
  Clock,
  Award
} from 'lucide-react';
import { SkillInfoDialog } from '@/components/common/SkillInfoDialog';
import { getSkillInfo, type SkillInfo } from '@/utils/skillUtils';
import { IconButton } from '@/components/ui/icon-button';
import { ProfileHeader } from './ProfileHeader';
import { PortfolioItemModal } from '@/components/common/PortfolioItemModal';

// Types
import type {
  ProfileData,
  ProfilePreviewProps as Props
} from '@/types/freelancer/profile';

// Utils
import {
  formatDate,
  calculateAverageRating,
  groupServicesByType,
  formatExperienceDuration,
  getRecentExperiences,
  getAvailabilityText,
  formatTime
} from '@/utils/profileUtils';

// Memoized component to prevent unnecessary re-renders
const ProfilePreview = memo(({
  isOpen = false,
  onClose = () => { },
  profileData
}: Partial<Props> & { profileData: ProfileData }) => {
  const router = useRouter();
  // Refs
  const scrollY = useRef(0);
  const scrollTimer = useRef<number | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef('top');
  const isScrollingRef = useRef(false);
  const [activeTab, setActiveTab] = useState('top');
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState<SkillInfo | null>(null);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  // Define tabs with their corresponding section IDs
  const tabs = [
    { id: 'top', label: 'Profile' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'experience', label: 'Experience' },
  ] as const;

  type TabId = typeof tabs[number]['id'];

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior = 'smooth', retryCount = 1, delayMs = 100) => {
    if (typeof window === 'undefined') return;

    const scroll = (attempt = 0): boolean => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior });
        return true;
      } else if (attempt < retryCount) {
        // If element isn't available yet, try again after a delay
        scrollTimer.current = window.setTimeout(() => {
          scroll(attempt + 1);
        }, delayMs);
      }
      return false;
    };

    // Clear any existing timeout to prevent multiple timers
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
      scrollTimer.current = null;
    }

    // Start the scroll attempt
    scroll();
  }, []);

  // Handle tab click with special case for 'top' section
  const handleTabClick = useCallback((tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log('Tab clicked:', tabId);

    // Ignore if already on this tab
    if (activeTabRef.current === tabId) {
      console.log('Tab already active, ignoring');
      return;
    }

    // Set scrolling flag to prevent scroll handler from interfering
    isScrollingRef.current = true;

    // Update active tab immediately for better UX
    setActiveTab(tabId);
    activeTabRef.current = tabId;

    // Special handling for profile (top) tab
    if (tabId === 'top') {
      console.log('Scrolling to top of page');

      // First try to find the top section by ID
      const topSection = document.getElementById('top');
      if (topSection) {
        console.log('Found top section, scrolling to it');
        topSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback to window scroll if top section not found
        console.log('Top section not found, using window scroll');
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      // Update URL hash without causing a scroll
      if (history.pushState) {
        history.pushState(null, '', '#');
      } else {
        window.location.hash = '';
      }

      // Reset scroll flag after a delay
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
      return;
    }

    // Special handling for portfolio section
    if (tabId === 'portfolio') {
      const portfolioSection = document.querySelector('[data-section="portfolio"]');
      if (portfolioSection) {
        console.log('Scrolling to portfolio section');
        portfolioSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL hash without causing a scroll
        if (history.pushState) {
          history.pushState(null, '', '#portfolio');
        } else {
          window.location.hash = '#portfolio';
        }
        // Reset scroll flag after a delay
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
        return;
      }
    }

    // Function to reset the scrolling flag
    const resetScrollFlag = () => {
      // Add a small delay to ensure all animations are complete
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);

      // Also reset on the next animation frame
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    if (tabId === 'top') {
      // For the top/Profile tab, scroll to the very top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Update URL without causing a scroll
      if (history.pushState) {
        history.pushState(null, '', '#');
      } else {
        window.location.hash = '';
      }

      resetScrollFlag();
      return;
    }

    // For other tabs, find the section and scroll to it
    console.log(`Looking for section with id: ${tabId}`);
    let element = document.getElementById(tabId);

    // Try finding by data-section if not found by ID
    if (!element) {
      const selector = `[data-section="${tabId}"]`;
      console.log(`Trying to find element with selector: ${selector}`);
      element = document.querySelector(selector);
      console.log('Element found by data-section:', element);
    }

    if (!element) {
      console.error(`Element with ID or data-section="${tabId}" not found`);
      // Try one more time with a small delay in case of rendering delay
      setTimeout(() => {
        const retryElement = document.querySelector(`[data-section="${tabId}"]`) || document.getElementById(tabId);
        if (retryElement) {
          retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      resetScrollFlag();
      return;
    }

    // Scroll to the element with smooth behavior
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Update URL hash without causing a scroll
    if (history.pushState) {
      history.pushState(null, '', `#${tabId}`);
    } else {
      window.location.hash = `#${tabId}`;
    }

    // Also ensure the tab is visible in the tab bar
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement;
    const tabsContainer = tabsContainerRef.current;

    if (tabElement && tabsContainer) {
      const tabRect = tabElement.getBoundingClientRect();
      const containerRect = tabsContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;

      // Calculate scroll position to center the tab with padding
      const scrollTo = Math.max(
        0,
        Math.min(
          tabElement.offsetLeft - (containerWidth / 2) + (tabRect.width / 2),
          tabsContainer.scrollWidth - containerWidth
        )
      );

      tabsContainer.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }

    // Reset the scroll flag after a delay
    resetScrollFlag();

    // Additional safety reset
    const safetyTimer = setTimeout(resetScrollFlag, 1000);
    return () => clearTimeout(safetyTimer);
  }, []);

  /**
   * Scrolls to a section with retry logic
   * @param sectionId The ID of the section to scroll to
   * @param behavior Scroll behavior ('auto' or 'smooth')
   * @param retryCount Number of times to retry if element is not found
   * @param delayMs Delay between retries in milliseconds
   */

  // Handle navigation to full page views
  const navigateToFullView = useCallback((type: 'portfolio' | 'reviews') => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.hash = `#${type}`;
    const currentUrl = url.toString();

    // Store current state for return navigation
    sessionStorage.setItem('returnToProfilePreview', currentUrl);
    sessionStorage.setItem(`${type}PreviewData`, JSON.stringify(profileData[type]));
    sessionStorage.setItem('freelancerName', profileData.name);

    // Navigate to the full view
    router.push(`/freelancer/profile/preview/${type}#fromPreview`);
  }, [profileData, router]);

  // Handle view all portfolio click
  const handleViewAllPortfolio = useCallback(() => {
    // Clear other section flags
    sessionStorage.removeItem('fromServices');
    sessionStorage.removeItem('fromReviews');
    sessionStorage.setItem('fromPortfolio', 'true');
    navigateToFullView('portfolio');
  }, [navigateToFullView]);

  // Handle view all reviews click
  const handleViewAllReviews = useCallback(() => {
    // Clear other section flags
    sessionStorage.removeItem('fromServices');
    sessionStorage.removeItem('fromPortfolio');
    sessionStorage.setItem('fromReviews', 'true');
    navigateToFullView('reviews');
  }, [navigateToFullView]);

  // Handle view all services click
  const handleViewAllServices = () => {
    // Clear other section flags
    sessionStorage.removeItem('fromPortfolio');
    sessionStorage.removeItem('fromReviews');
    sessionStorage.setItem('fromServices', 'true');
    sessionStorage.setItem('lastVisitedSection', 'services');

    // Create a URL with the modal state and section hash
    const url = new URL(window.location.href);
    url.hash = '#services';
    const currentUrl = url.toString();

    sessionStorage.setItem('returnToProfilePreview', currentUrl);

    // Store services data in session storage
    sessionStorage.setItem('servicesPreviewData', JSON.stringify(profileData.services));
    sessionStorage.setItem('freelancerName', profileData.name);

    // Navigate to services page with preview flag
    router.push(`/services#fromPreview`);
  };

  // Handle active tab update using Intersection Observer
  useEffect(() => {
    if (!isOpen) return;

    const observerOptions = {
      root: null, // viewport
      rootMargin: '-80px 0px -60% 0px', // Adjusted margins for better section detection
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // Multiple thresholds for better precision
    };

    let lastScrollTime = 0;
    const scrollDebounceTime = 50; // ms
    let isUpdating = false;
    let lastKnownSection = activeTabRef.current;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Skip if we're currently programmatically scrolling or already updating
      if (isScrollingRef.current || isUpdating) return;

      const now = Date.now();
      if (now - lastScrollTime < scrollDebounceTime) return;
      lastScrollTime = now;
      isUpdating = true;

      try {
        const viewportHeight = window.innerHeight;
        const viewportMiddle = viewportHeight / 2;

        // Process all entries to find the most visible section
        let mostVisibleSection = null;
        let maxScore = -1;

        entries.forEach(entry => {
          // Skip if not intersecting at all
          if (!entry.isIntersecting) return;

          const rect = entry.boundingClientRect;
          const sectionId = entry.target.id || entry.target.getAttribute('data-section');

          // Calculate visibility ratio (0 to 1)
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const visibilityRatio = Math.min(1, visibleHeight / viewportHeight);

          // Calculate center weight (1 when centered, 0 at viewport edges)
          const sectionCenter = rect.top + (rect.height / 2);
          const distanceFromCenter = Math.abs(sectionCenter - viewportMiddle);
          const centerWeight = Math.max(0, 1 - (distanceFromCenter / viewportMiddle));

          // Combine scores (60% visibility, 40% center position)
          const score = (visibilityRatio * 0.6) + (centerWeight * 0.4);

          if (score > maxScore) {
            maxScore = score;
            mostVisibleSection = sectionId;
          }
        });

        // Only update if we have a visible section and it's different
        if (mostVisibleSection && mostVisibleSection !== lastKnownSection) {
          // Special case for top section
          if (mostVisibleSection === 'top' && window.scrollY < 100) {
            updateActiveTab('top');
            lastKnownSection = 'top';
          }
          // Only update if section is significantly visible
          else if (maxScore > 0.2) {
            updateActiveTab(mostVisibleSection);
            lastKnownSection = mostVisibleSection;
          }
        }
      } catch (error) {
        console.error('Error in intersection observer:', error);
      } finally {
        isUpdating = false;
      }

    };

    const updateActiveTab = (sectionId: string) => {
      // Don't update if we're already on this tab
      if (sectionId === activeTabRef.current) return;

      // Update the active tab state
      setActiveTab(sectionId);
      activeTabRef.current = sectionId;

      // Find the tab element and container
      const tabElement = document.querySelector(`[data-tab-id="${sectionId}"]`) as HTMLElement;
      const tabsContainer = tabsContainerRef.current;

      if (tabElement && tabsContainer) {
        const tabRect = tabElement.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;

        // Calculate scroll position to center the tab with padding
        const scrollTo = Math.max(
          0, // Don't scroll past the start
          Math.min(
            tabElement.offsetLeft - (containerWidth / 2) + (tabRect.width / 2),
            tabsContainer.scrollWidth - containerWidth // Don't scroll past the end
          )
        );

        // Only scroll if tab is not fully visible or we're at the edges
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          isScrollingRef.current = true;
          tabsContainer.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
          });

          // Re-enable scroll events after animation
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 300);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe all section elements
    const sectionElements = tabs
      .map(tab => document.getElementById(tab.id))
      .filter(Boolean) as HTMLElement[];

    sectionElements.forEach(section => observer.observe(section));

    // Initial check for all sections
    if (sectionElements.length > 0) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const entries = sectionElements.map(section => {
          const rect = section.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          return {
            target: section,
            isIntersecting: isInView,
            intersectionRatio: isInView ? 1 : 0,
            boundingClientRect: rect,
            intersectionRect: isInView ? rect : {} as DOMRectReadOnly,
            rootBounds: document.documentElement.getBoundingClientRect(),
            time: performance.now()
          } as unknown as IntersectionObserverEntry;
        });

        // Process initial visibility
        handleIntersect(entries);

        // Force update after a short delay to catch any missed updates
        setTimeout(() => {
          const updatedEntries = sectionElements.map(section => {
            const rect = section.getBoundingClientRect();
            return {
              target: section,
              isIntersecting: rect.top < window.innerHeight && rect.bottom > 0,
              boundingClientRect: rect,
              time: performance.now()
            } as unknown as IntersectionObserverEntry;
          });
          handleIntersect(updatedEntries);
        }, 100);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [isOpen, tabs]);

  // Handle scroll behavior when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position
    scrollY.current = window.scrollY || document.documentElement.scrollTop;

    // Lock body scroll using CSS classes
    document.body.classList.add('preview-open', 'scroll-locked');
    document.body.style.setProperty('--scroll-y', `-${scrollY.current}px`);

    // Get the last visited section from session storage
    const lastVisitedSection = sessionStorage.getItem('lastVisitedSection');
    const isFromPreview = window.location.hash === '#fromPreview';

    // Scroll to the appropriate section
    requestAnimationFrame(() => {
      const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement;

      // Check for explicit hash first
      if (window.location.hash && window.location.hash !== '#fromPreview') {
        const sectionId = window.location.hash.substring(1);
        if (sectionId) {
          scrollToSection(sectionId, 'smooth', 3);
          return;
        }
      }
    });

    // Cleanup function
    return () => {
      // Clear any pending scroll timers
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }

      // Restore body styles and scroll position
      document.body.classList.remove('preview-open', 'scroll-locked');
      document.body.style.removeProperty('--scroll-y');
      window.scrollTo(0, scrollY.current);
    };
  }, [isOpen, scrollToSection]);

  // Memoize expensive calculations
  const averageRating = useMemo(
    () => calculateAverageRating(profileData.reviews || []),
    [profileData.reviews]
  );

  const { online: onlineServices, inPerson: inPersonServices } = useMemo(
    () => groupServicesByType(profileData.services || []),
    [profileData.services]
  );

  const recentExperiences = useMemo(
    () => getRecentExperiences(profileData.experience || []),
    [profileData.experience]
  );

  const handleSkillClick = (skillName: string) => {
    const skillInfo = getSkillInfo(skillName);
    setSelectedSkillInfo(skillInfo);
    setIsSkillDialogOpen(true);
  };

  if (!isOpen) return null;

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
            <div className="relative">
              <IconButton
                icon={Share2}
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
                    // Handle share cancellation gracefully without logging
                    if (error instanceof Error && error.name === 'AbortError') {
                      // User canceled the share - no need to log this
                      return;
                    }
                    console.error('Error sharing profile:', error);
                  }
                }}
                id="share-button"
                aria-label="Share profile preview"
                data-copied="false"
              />
              <style jsx>{`
                button[data-copied="true"]:after {
                  content: '✓ Copied!';
                }
                button[data-copied="false"]:after {
                  content: 'Share Profile';
                }
              `}</style>
            </div>
            <IconButton
              icon={X}
              onClick={onClose}
              aria-label="Close preview"
            />
          </div>
        </div>
      </div>


      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <section id="top" data-section="top" className="scroll-mt-20">
          <div className="w-full bg-[#0f0f0f]">
            <ProfileHeader
              isPreview={true}
              avatarUrl={undefined}
              coverImageUrl={undefined}
            />
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
                scrollbarWidth: 'none', // Hide scrollbar in Firefox
                msOverflowStyle: 'none' // Hide scrollbar in IE/Edge
              }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={(e) => handleTabClick(tab.id, e)}
                    className={`px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-200 relative ${isActive
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
                <h2 className="text-lg font-semibold text-white mb-3">About Me</h2>
                <p className="text-white mb-6 whitespace-pre-line">{profileData.bio || profileData.about}</p>

                {/* Cricket Information */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-white border-b border-white/10 pb-2">Cricket Profile</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 w-24">Role:</span>
                      <span className="text-white">{profileData.cricketRole || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 w-24">Batting:</span>
                      <span className="text-white">{profileData.battingStyle || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 w-24">Bowling:</span>
                      <span className="text-white">{profileData.bowlingStyle || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Section - Moved above response time */}
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {profileData.skills.map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => handleSkillClick(skill)}
                        className="px-1.5 py-0.5 bg-white/10 text-white/80 border border-white/20 text-xs rounded-full transition-colors cursor-pointer hover:bg-white/20"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

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
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${day.available
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
                            {profileData.availability.filter(day => day.available).map((day, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-white/60">{day.day}:</span>
                                <span className="text-white/80">
                                  {day.timeSlots && day.timeSlots.length > 0
                                    ? day.timeSlots.map(slot => `${formatTime(slot.start)} - ${formatTime(slot.end)}`).join(', ')
                                    : '9 AM - 6 PM'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                        <div key={service.id} className="w-80 flex-shrink-0 p-5 pt-8 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors flex flex-col h-full relative">
                          {service.category && (
                            <div className="absolute top-3 left-3 bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs rounded-full border">
                              {service.category}
                            </div>
                          )}
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
                  View All {profileData.services.length} Services
                  <ArrowRight className="h-4 w-4" />
                </button>
              </section>

              {/* Portfolio Section */}


              {/* Experience Section */}
              <section
                id="experience"
                data-section="experience"
                className="pt-8 scroll-mt-20 relative group z-0"
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
                    <button
                      onClick={handleViewAllReviews}
                      className="w-full mt-3 py-2.5 px-4 border border-white/30 hover:bg-white/5 transition-colors text-sm font-medium flex items-center justify-center gap-2 text-white rounded-[6px]"
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

      {/* Skill Info Dialog */}
      <SkillInfoDialog
        isOpen={isSkillDialogOpen}
        onClose={() => setIsSkillDialogOpen(false)}
        skillInfo={selectedSkillInfo}
      />

      {/* Portfolio Modal */}
      <PortfolioItemModal
        item={selectedPortfolioItem}
        isOpen={isPortfolioModalOpen}
        onClose={() => {
          setIsPortfolioModalOpen(false);
          setSelectedPortfolioItem(null);
        }}
      />
    </div>
  ), document.body);
}, (prevProps, nextProps) => {
  // Only re-render if isOpen or profileData changes
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.profileData === nextProps.profileData
  );
});

ProfilePreview.displayName = 'ProfilePreview';

export default ProfilePreview;
