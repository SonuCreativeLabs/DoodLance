"use client";

import { CricketLoader } from '@/components/ui/cricket-loader';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Briefcase,
    Award,
    Check,
    ChevronDown,
    Share2,
    X,
    CheckCircle,
    ArrowRight,
    UserPlus,
    User
} from 'lucide-react';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from '@/components/auth/LoginDialog';
import ProfileCompletionDialog from '@/components/auth/ProfileCompletionDialog';
import { useRequireAuth, usePendingActionCheck } from '@/hooks/useRequireAuth';

import { IdVerifiedBadge } from '@/components/freelancer/profile/IdVerifiedBadge';
import { SkillInfoDialog } from '@/components/common/SkillInfoDialog';
import { getSkillInfo, type SkillInfo } from '@/utils/skillUtils';
import { formatTime } from '@/utils/profileUtils';
import Image from 'next/image';
import { IconButton } from '@/components/ui/icon-button';
import { PortfolioItemModal } from '@/components/common/PortfolioItemModal';
import { HireBottomSheet } from '@/components/hire/HireBottomSheet';

interface FreelancerDetail {
    id: string;
    name: string;
    service: string;
    experience: string;
    location: string;
    distance: number;
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
        timeSlots?: { start: string; end: string }[];
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
    coverImage?: string; // New field for unique cover images

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

interface FreelancerProfileProps {
    freelancerId?: string;
    isPublicView?: boolean;
}

export function FreelancerProfile({ freelancerId: propId, isPublicView = false }: FreelancerProfileProps) {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setNavbarVisibility } = useNavbar();
    const { user } = useAuth();
    const pathname = usePathname();
    const {
        requireAuth,
        isAuthenticated,
        isProfileComplete,
        openLoginDialog,
        setOpenLoginDialog,
        openProfileDialog,
        setOpenProfileDialog,
        handleCompleteProfile,
        isRedirectingToProfile
    } = useRequireAuth();

    const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
    const [selectedSkillInfo, setSelectedSkillInfo] = useState<SkillInfo | null>(null);
    const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);
    const [isScrolledPastCover, setIsScrolledPastCover] = useState(false);
    const [activeTab, setActiveTab] = useState('top');
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null);
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [isHireBottomSheetOpen, setIsHireBottomSheetOpen] = useState(false);
    // showLoginDialog removed in favor of hook state

    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Prioritize propId, fallback to params.id
    const freelancerId = propId || (params.id as string);

    // Auto-open hire sheet if returning from a completed auth/profile flow
    usePendingActionCheck(
        `hire_${freelancerId}`,
        () => {
            setIsHireBottomSheetOpen(true);
        },
        isAuthenticated,
        isProfileComplete
    );

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

    const isViewOnly = searchParams.get('viewOnly') === 'true';

    // Load freelancer data
    useEffect(() => {
        async function loadFreelancer() {
            setLoading(true);

            // Check cache first
            const cachedData = sessionStorage.getItem(`freelancer_profile_${freelancerId}`);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    setFreelancer(parsed);
                    setLoading(false);
                    // verified - we can return here, or fetch in background to update
                    // returning here is faster and meets "keep infos solid" requirement
                    // we can do a background SWR-like revalidation if needed, but for now simple cache is best
                } catch (e) {
                    console.error("Cache parse error", e);
                }
            }

            try {
                const res = await fetch(`/api/freelancers/${freelancerId}`);
                if (!res.ok) {
                    if (!cachedData) setFreelancer(null); // Only clear if no cache
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                const profile = data.profile || {};

                // Parse skills/coords safely
                let skills: string[] = [];
                try {
                    if (profile.skills) {
                        // API might return array or string
                        skills = Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills);
                        if (!Array.isArray(skills)) skills = [profile.skills];
                    }
                } catch (e) { skills = [profile.skills || '']; }

                // Coords
                let coords = [80.2707, 13.0827]; // Default
                // API doesn't seem to return coords in the flattened profile in route.ts, check route.ts line 44-69. 
                // route.ts doesn't return coords. Assuming default or add to API if needed.

                const mappedFreelancer: FreelancerDetail = {
                    id: String(profile.id),
                    name: String(profile.name || 'Anonymous'),
                    service: String(profile.title || 'Freelancer'),
                    experience: String(profile.experience || ''),
                    location: String(profile.location || ''),
                    distance: 0,
                    price: Number(profile.hourlyRate) || 0,
                    priceUnit: 'hr',
                    rating: Number(profile.rating) || 0,
                    reviews: Number(profile.reviews?.length) || 0,
                    reviewCount: Number(profile.reviewCount) || 0,
                    completedJobs: Number(profile.completedJobs) || 0,
                    responseTime: String(profile.responseTime || ''),
                    image: String(profile.avatar || ''),
                    expertise: skills,
                    description: String(profile.about || profile.bio || ''),
                    availability: profile.availability || [],
                    online: Boolean(profile.isOnline),

                    bio: profile.bio ? String(profile.bio) : undefined,
                    about: profile.about ? String(profile.about) : undefined,
                    cricketRole: profile.cricketRole,
                    battingStyle: profile.battingStyle,
                    bowlingStyle: profile.bowlingStyle,
                    languages: profile.languages,
                    completionRate: 0,
                    skills: skills,
                    coverImage: String(profile.coverImage || ''),

                    services: profile.services?.map((s: any) => ({
                        id: String(s.id),
                        title: String(s.title),
                        description: String(s.description),
                        price: String(s.price), // Force string as per interface expectation or UI usage
                        category: String(s.category?.name || 'Service'),
                        deliveryTime: String(s.deliveryTime)
                    })) || [],

                    experienceDetails: profile.experiences?.map((exp: any) => ({
                        id: String(exp.id),
                        role: String(exp.role),
                        company: String(exp.company),
                        location: String(exp.location),
                        startDate: String(exp.startDate),
                        endDate: String(exp.endDate),
                        isCurrent: Boolean(exp.isCurrent),
                        description: String(exp.description)
                    })) || [],

                    portfolio: profile.portfolios?.map((p: any) => ({
                        id: String(p.id),
                        title: String(p.title),
                        image: p.images ? String(JSON.parse(p.images)[0] || '') : '',
                        category: String(p.category)
                    })) || [],

                    reviewsData: profile.reviews?.map((r: any) => ({
                        id: String(r.id),
                        author: String(r.clientName || 'Anonymous'),
                        role: String(r.clientRole || 'Client'),
                        rating: Number(r.rating),
                        comment: String(r.comment),
                        date: String(r.createdAt)
                    })) || []
                };

                setFreelancer(mappedFreelancer);
                sessionStorage.setItem(`freelancer_profile_${freelancerId}`, JSON.stringify(mappedFreelancer));

            } catch (error) {
                console.error("Failed to load freelancer", error);
                setFreelancer(null);
            } finally {
                setLoading(false);
            }
        }

        if (freelancerId) {
            loadFreelancer();
        }
    }, [freelancerId]);

    // Handle scroll to specific section when returning from preview pages
    useLayoutEffect(() => {
        if (typeof window !== 'undefined' && freelancer) {
            const hash = window.location.hash;
            const shouldScrollToPortfolio = sessionStorage.getItem('scrollToPortfolio') === 'true' || hash === '#portfolio';
            const shouldScrollToServices = sessionStorage.getItem('scrollToServices') === 'true' || hash === '#services';
            const shouldScrollToReviews = sessionStorage.getItem('scrollToReviews') === 'true' || hash === '#reviews';

            // Clear the sessionStorage flags
            sessionStorage.removeItem('scrollToPortfolio');
            sessionStorage.removeItem('scrollToServices');
            sessionStorage.removeItem('scrollToReviews');

            // Use requestAnimationFrame for better timing
            const handleScroll = () => {
                if (shouldScrollToPortfolio) {
                    const portfolioElement = document.getElementById('portfolio');
                    if (portfolioElement) {
                        portfolioElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        setActiveTab('portfolio');
                    }
                } else if (shouldScrollToServices) {
                    const servicesElement = document.getElementById('services');
                    if (servicesElement) {
                        servicesElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        setActiveTab('services');
                    }
                } else if (shouldScrollToReviews) {
                    const reviewsElement = document.getElementById('reviews');
                    if (reviewsElement) {
                        reviewsElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        setActiveTab('reviews');
                    }
                }
            };

            // Use requestAnimationFrame instead of setTimeout for better DOM timing
            requestAnimationFrame(handleScroll);
        }
    }, [freelancer]);

    const handleBack = () => {
        if (isPublicView) {
            // For public links, maybe go to home or browse freelancers
            router.push('/');
            return;
        }

        if (isViewOnly) {
            router.back();
            return;
        }

        const source = searchParams.get('source');
        if (source === 'list') {
            // Came from list view, go back to hirefeed with list view expanded
            router.push('/client/nearby/hirefeed?view=list');
        } else {
            // Came from map view or default, go back to hirefeed (map view)
            router.push('/client/nearby/hirefeed');
        }
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

            // Pass freelancer ID to show this freelancer's services
            router.push(`/freelancer/profile/preview/services?freelancerId=${freelancerId}${isViewOnly ? '&viewOnly=true' : ''}#fromPreview`);
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

            // Pass freelancer ID to show this freelancer's reviews
            router.push(`/freelancer/profile/preview/reviews?freelancerId=${freelancerId}${isViewOnly ? '&viewOnly=true' : ''}`);
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
            // Scroll the scrollable content container instead of window
            const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
            if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Fallback to window scroll
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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

    // Scroll listener for tab section reaching top
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                // Check if the skills section has scrolled past the top
                // The tabs should be stuck when the profile content (including skills) is scrolled past
                const profileSection = document.querySelector('[data-section="top"]');
                if (profileSection) {
                    const profileRect = profileSection.getBoundingClientRect();
                    // Show header when profile section has scrolled past viewport top
                    // Add a buffer to account for the profile section height
                    const shouldShowHeader = profileRect.bottom <= 60; // 60px for tab height
                    setIsScrolledPastCover(shouldShowHeader);
                }
            }
        };

        // Add scroll listener with a small delay to ensure ref is available
        const timeoutId = setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.addEventListener('scroll', handleScroll, { passive: true });
                // Also call once to set initial state
                handleScroll();
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div>
            {loading && (
                <div className="flex items-center justify-center h-screen bg-[#0F0F0F]">
                    <CricketLoader size={60} />
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
                    <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
                        {/* Profile Header - Using ProfileHeader component style */}
                        <section id="top" data-section="top" className="scroll-mt-20">
                            <div className="w-full bg-[#0f0f0f]">
                                {/* Cover Photo */}
                                <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">

                                    <div className="absolute inset-0 w-full h-full bg-[#111111]">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <User className="w-16 h-16 text-white/10" />
                                        </div>
                                        {freelancer.coverImage && (
                                            <img
                                                src={freelancer.coverImage}
                                                alt="Profile Cover"
                                                className="absolute inset-0 w-full h-full object-cover z-10"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Back and Share Buttons - Original Position */}
                                    <div className="absolute top-4 left-4 right-4 z-10">
                                        <div className="flex items-center justify-between">
                                            <IconButton
                                                icon={ArrowLeft}
                                                onClick={handleBack}
                                                aria-label="Back"
                                            />
                                            <IconButton
                                                icon={Share2}
                                                onClick={handleShare}
                                                aria-label="Share profile"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Content */}
                                <div className="max-w-6xl mx-auto px-4 relative z-20">
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
                                                <div className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-bold border-2 shadow-lg whitespace-nowrap transform rotate-[-2deg] ${freelancer.online
                                                    ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/50 border-dashed'
                                                    : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/50 border-dashed'
                                                    }`}>
                                                    <span className="tracking-widest font-black">{freelancer.online ? 'GAME ON' : 'OFFLINE'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Online Badge - Desktop: top right corner */}
                                        <div className="hidden md:block absolute top-8 right-3">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border-2 shadow-xl whitespace-nowrap transform rotate-[1deg] ${freelancer.online
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
                                        <p className="text-purple-400 mt-0.5">{freelancer.cricketRole || 'All Rounder'}</p>

                                        <div className="mt-2 flex flex-col items-center gap-0.5 text-sm text-white/70">
                                            <div className="flex items-center gap-2">
                                                <span>{freelancer.location}{freelancer.distance ? <><span className="text-white/40 mx-1 text-xs">|</span>{freelancer.distance < 1 ? `${(freelancer.distance * 1000).toFixed(0)}m` : `${freelancer.distance.toFixed(1)}km`} away</> : ''}</span>
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
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {(freelancer.skills || freelancer.expertise)?.map((skill: any, i) => {
                                            const skillName = typeof skill === 'object' && skill !== null ? (skill.name || skill.title || 'Unknown') : skill;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSkillClick(skillName)}
                                                    className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 rounded-full px-2 py-0.5 text-xs transition-colors cursor-pointer"
                                                >
                                                    {skillName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sticky Tab Navigation with Back/Share Header */}
                        <div className={`sticky top-0 z-[100] ${isScrolledPastCover ? 'bg-[#0f0f0f]/95 backdrop-blur-sm' : 'bg-transparent'} mt-1`}>
                            {/* Back/Share Header - Only render when scrolled past cover */}
                            {isScrolledPastCover && (
                                <div className="border-b border-white/5">
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <IconButton
                                            icon={ArrowLeft}
                                            onClick={handleBack}
                                            aria-label="Back"
                                        />
                                        <div className="flex-1 flex justify-center">
                                            <div className="flex flex-col items-center text-center">
                                                <span className="text-white font-medium text-sm truncate">{freelancer.name}</span>
                                                <span className="text-white/60 text-xs truncate">{freelancer.cricketRole || 'All Rounder'}</span>
                                            </div>
                                        </div>
                                        <IconButton
                                            icon={Share2}
                                            onClick={handleShare}
                                            aria-label="Share profile"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tab Navigation - Always visible */}
                            <div className="relative w-full overflow-hidden border-b border-white/5">
                                <div className="flex items-center px-4 max-w-4xl mx-auto">
                                    {/* Tabs Container */}
                                    <div
                                        className="flex overflow-x-auto hide-scrollbar flex-1 tabs-container"
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
                                </div>
                                {/* Gradient fade effect on the right side */}
                                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
                            </div>
                        </div>

                        <div className="w-full max-w-4xl mx-auto">
                            {/* Main Content */}
                            <div className="px-6 pb-32">
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
                                        </div>

                                        {/* Skills Section - Moved above response time */}
                                        <div className="mb-6">
                                            <h3 className="font-medium text-white mb-2">Skills</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {freelancer.skills?.map((skill: any, i) => {
                                                    const skillName = typeof skill === 'object' && skill !== null ? (skill.name || skill.title || 'Unknown') : skill;
                                                    return (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleSkillClick(skillName)}
                                                            className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 rounded-full px-1.5 py-0.5 text-xs transition-colors cursor-pointer"
                                                        >
                                                            {skillName}
                                                        </button>
                                                    );
                                                }) || freelancer.expertise?.map((skill: any, i) => {
                                                    const skillName = typeof skill === 'object' && skill !== null ? (skill.name || skill.title || 'Unknown') : skill;
                                                    return (
                                                        <span
                                                            key={i}
                                                            className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium border border-purple-500/20"
                                                        >
                                                            {skillName}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 mb-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-purple-400 flex-shrink-0" />
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
                                                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${day.available
                                                                    ? 'bg-green-500/10 text-green-400'
                                                                    : 'bg-white/5 text-white/40'
                                                                    }`}
                                                            >
                                                                {day.day?.substring(0, 1) || '?'}
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
                                                                {/* Category badge */}
                                                                {service.category && (
                                                                    <div className="absolute top-3 left-3 z-10">
                                                                        <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs">
                                                                            {service.category}
                                                                        </Badge>
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
                                                                    setSelectedPortfolioItem(item);
                                                                    setIsPortfolioModalOpen(true);
                                                                }}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        setSelectedPortfolioItem(item);
                                                                        setIsPortfolioModalOpen(true);
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
                                                                    <div className="flex justify-between items-end mb-8">
                                                                        <div className="pr-2 flex-1">
                                                                            <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute bottom-3 left-3 bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs rounded-full border">
                                                                        {item.category}
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

                                                        // Use router.push instead of window.location.href for better navigation
                                                        router.push(`/freelancer/profile/preview/portfolio?freelancerId=${freelancerId}${isViewOnly ? '&viewOnly=true' : ''}#fromPreview`);
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
                                                                    <Award className="h-3.5 w-3.5" />
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

                    {/* Hire Bottom Sheet */}
                    {
                        freelancer && (
                            <HireBottomSheet
                                isOpen={isHireBottomSheetOpen}
                                onClose={() => setIsHireBottomSheetOpen(false)}
                                freelancerId={freelancer.id}
                                freelancerName={freelancer.name}
                                freelancerImage={freelancer.image}
                                freelancerRating={freelancer.rating}
                                freelancerReviewCount={freelancer.reviewCount}
                                services={freelancer.services || []}
                            />
                        )
                    }

                    {/* Sticky Hire Me Button */}
                    {!isViewOnly && (
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-white/10">
                            <button
                                onClick={() => {
                                    if (isAuthenticated && isProfileComplete) {
                                        setIsHireBottomSheetOpen(true);
                                    } else {
                                        requireAuth(`hire_${freelancerId}`, {
                                            redirectTo: pathname || window.location.pathname
                                        });
                                    }
                                }}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <UserPlus className="w-4 h-4" />
                                Hire {freelancer?.name || 'Freelancer'}
                            </button>
                        </div>
                    )}

                    {/* Auth Dialogs */}
                    <ProfileCompletionDialog
                        open={openProfileDialog}
                        onOpenChange={setOpenProfileDialog}
                        onCompleteProfile={handleCompleteProfile}
                        actionLoading={isRedirectingToProfile}
                    />

                    <LoginDialog
                        open={openLoginDialog}
                        onOpenChange={setOpenLoginDialog}
                        redirectTo={pathname || undefined}
                    />
                </div >
            )
            }
        </div >
    );
}

// Default export for backward compatibility if needed, though we will use Named export
export default FreelancerProfile;
