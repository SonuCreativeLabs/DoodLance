"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Star,
  Briefcase,
  Award,
  Check,
  ChevronDown,
  Share2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/contexts/ApplicationsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePostedJobs } from "@/contexts/PostedJobsContext";
import { RescheduleModal } from "@/components/client/bookings/RescheduleModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { IdVerifiedBadge } from "@/components/freelancer/profile/IdVerifiedBadge";
import { SkillInfoDialog } from "@/components/common/SkillInfoDialog";
import { getSkillInfo, type SkillInfo } from "@/utils/skillUtils";
import { IconButton } from "@/components/ui/icon-button";
import { PortfolioItemModal } from "@/components/common/PortfolioItemModal";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();
  const { applications, acceptApplication, rejectApplication, reconsiderApplication } = useApplications();
  const { postedJobs, closeJob } = usePostedJobs();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReconsiderDialog, setShowReconsiderDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState<SkillInfo | null>(null);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);
  const [isScrolledPastCover, setIsScrolledPastCover] = useState(false);
  const [activeTab, setActiveTab] = useState('top');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<any>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'top', label: 'Profile' },
    { id: 'application', label: 'Application' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Experience' },
    { id: 'reviews', label: 'Reviews' }
  ];

  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const rawId = useMemo(() => {
    if (!params || typeof params.id === "undefined") return "";
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    return decodeURIComponent(value);
  }, [params]);

  const application = useMemo(
    () => applications.find((entry) => entry["#"] === rawId),
    [rawId, applications]
  );

  // Fetch freelancer full profile data
  const [freelancer, setFreelancer] = useState<any>(null);

  useEffect(() => {
    if (!application?.freelancer?.id) return;

    fetch(`/api/freelancers/${application.freelancer.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const profile = data.freelancerProfile || {};
          const skills = profile.skills ? (profile.skills.startsWith('[') ? JSON.parse(profile.skills) : [profile.skills]) : [];
          const availability = profile.availability ? JSON.parse(profile.availability) : [];

          setFreelancer({
            id: data.id,
            name: data.name,
            image: data.profileImage || application.freelancer.image,
            service: data.services?.[0]?.title || profile.title || 'Freelancer',
            location: profile.location || data.location || 'Remote',
            rating: data.averageRating || 0,
            reviewCount: profile.reviews?.length || 0,
            reviews: profile.reviews?.length || 0,
            online: profile.isOnline || false,
            coverImage: '',

            cricketRole: '',
            battingStyle: '',
            bowlingStyle: '',
            bio: profile.bio,
            about: profile.about,
            responseTime: profile.responseTime || '1 hour',
            completionRate: profile.completionRate || 95,

            skills: skills,
            availability: availability,

            services: data.services?.map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              price: `₹${s.price}`,
              deliveryTime: s.deliveryTime,
              category: s.category?.name,
              features: s.tags ? s.tags.split(',') : []
            })) || [],

            portfolio: profile.portfolios?.map((p: any) => ({
              id: p.id,
              title: p.title,
              image: p.imageUrl || (p.images ? JSON.parse(p.images)[0] : '') || '/placeholder.jpg',
              category: p.category
            })) || [],

            experienceDetails: profile.experiences?.map((e: any) => ({
              id: e.id,
              role: e.title, // Map title to role
              company: e.company, // Assuming API/Schema has company? Check schema if needed. Fallback to description?
              location: e.location || '',
              startDate: e.startDate ? new Date(e.startDate).getFullYear().toString() : '',
              endDate: e.endDate ? new Date(e.endDate).getFullYear().toString() : 'Present',
              isCurrent: e.isCurrent,
              description: e.description
            })) || []
          });
        }
      })
      .catch(err => console.error("Failed to fetch freelancer profile", err));
  }, [application]);

  // Debug logging
  useEffect(() => {
    console.log('📊 APPLICATION DETAIL PAGE DEBUG:');
    console.log('  - Raw ID:', rawId);
    console.log('  - Application found:', !!application);
    console.log('  -Application status:', application?.status);
    console.log('  - Freelancer found:', !!freelancer);
    console.log('  - Is Processing:', isProcessing);
    console.log('  - Show Accept Dialog:', showAcceptDialog);
    console.log('  - Show Decline Dialog:', showDeclineDialog);
  }, [rawId, application, freelancer, isProcessing, showAcceptDialog, showDeclineDialog]);

  const previewBooking: any = useMemo(() => {
    if (!application) return null;
    return {
      "#": application["#"],
      provider: application.freelancer.name,
      service: application.jobTitle,
      date: "2024-01-01", // Placeholder until scheduled
      time: "10:00 AM",   // Placeholder until scheduled
      location: application.freelancer.location,
      status: 'upcoming'
    };
  }, [application]);

  const handleBack = () => {
    // Use router.replace() for faster client-side navigation
    if (application?.jobId) {
      router.replace(`/client/jobs/${application.jobId}`);
    } else {
      router.back();
    }
  };

  const handleAccept = () => {
    console.log('🟢 ACCEPT BUTTON CLICKED - Opening dialog');
    console.log('Current isProcessing:', isProcessing);
    console.log('Current application:', application);
    setShowAcceptDialog(true);
    console.log('Dialog state set to true');
  };

  const handleAcceptConfirm = async () => {
    setIsProcessing(true);
    try {
      if (application) {
        await acceptApplication(application["#"]);

        const job = postedJobs.find(j => j["#"] === application.jobId);
        if (job && job.acceptedCount + 1 >= job.peopleNeeded) {
          await closeJob(job["#"]);
        }

        setShowAcceptDialog(false);

        // Navigate back with router.replace for faster navigation
        if (application.jobId) {
          router.replace(`/client/jobs/${application.jobId}`);
        }
      }
    } catch (error) {
      console.error("Failed to accept application:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    console.log('🔴 REJECT/DECLINE BUTTON CLICKED - Opening dialog');
    console.log('Current isProcessing:', isProcessing);
    setShowDeclineDialog(true);
  };

  const handleRejectConfirm = async () => {
    setIsProcessing(true);
    try {
      if (application) {
        await rejectApplication(application["#"]);
        if (application.status === 'new') setShowDeclineDialog(false);
        setShowDeclineDialog(false);

        // Navigate back with router.replace for faster navigation
        if (application.jobId) {
          router.replace(`/client/jobs/${application.jobId}`);
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReconsider = async () => {
    setIsProcessing(true);
    try {
      if (application) {
        await reconsiderApplication(application["#"]);
        setShowReconsiderDialog(false);

        // Navigate back with router.replace for faster navigation
        if (application.jobId) {
          router.replace(`/client/jobs/${application.jobId}`);
        }
      }
    } catch (error) {
      console.error("Failed to reconsider application:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRescheduleConfirm = async (id: string, newDate: string, newTime: string) => {
    console.log("Rescheduling application", id, newDate, newTime);
  };

  const handleSkillClick = (skillName: string) => {
    const skillInfo = getSkillInfo(skillName);
    setSelectedSkillInfo(skillInfo);
    setIsSkillDialogOpen(true);
  };

  const handleShare = async () => {
    if (!application) return;

    const shareData = {
      title: `${application.freelancer.name}'s Application`,
      text: `Check out ${application.freelancer.name}'s application`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.clipboard && shareData.url) {
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  const handleTabClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tabId);

    if (tabId === 'top') {
      const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const profileSection = document.querySelector('[data-section="top"]');
        if (profileSection) {
          const profileRect = profileSection.getBoundingClientRect();
          const shouldShowHeader = profileRect.bottom <= 60;
          setIsScrolledPastCover(shouldShowHeader);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.addEventListener('scroll', handleScroll, { passive: true });
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

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="text-lg">Application not found.</div>
        <Button
          className="mt-4 bg-purple-600 hover:bg-purple-700"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#111111] to-[#050505] text-white/70">
        <div className="text-lg">Freelancer profile not found.</div>
        <Button
          className="mt-4 bg-purple-600 hover:bg-purple-700"
          onClick={handleBack}
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Debug logging for render
  console.log('🎨 RENDERING UI WITH DATA:');
  console.log('  - Freelancer name (display):', freelancer.name);
  console.log('  - Freelancer image (display):', freelancer.image);
  console.log('  - Freelancer service:', freelancer.service);
  console.log('  - Application freelancer name:', application.freelancer.name);
  console.log('  - Application freelancer image:', application.freelancer.image);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F0F0F] flex flex-col h-screen w-screen overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        {/* Profile Header */}
        <section id="top" data-section="top" className="scroll-mt-20">
          <div className="w-full bg-[#0f0f0f]">
            {/* Cover Photo */}
            <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={freelancer.coverImage || "/images/cover-pic.JPG"}
                  alt="Profile Cover"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDEyMDAgMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNkI0NkMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Dcmlja2V0IENvdmVyPC90ZXh0Pjwvc3ZnPg=='
                  }}
                />
              </div>

              {/* Back and Share Buttons */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
                  <IconButton
                    icon={ArrowLeft}
                    onClick={handleBack}
                    aria-label="Back"
                  />
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={MessageSquare}
                      onClick={() => router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)}
                      aria-label="Message"
                    />
                    <IconButton
                      icon={Phone}
                      onClick={() => { }}
                      aria-label="Call"
                    />
                    <IconButton
                      icon={Share2}
                      onClick={handleShare}
                      aria-label="Share"
                    />
                  </div>
                </div>
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
                      <AvatarFallback>{freelancer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  {/* ID Verified Badge - Mobile */}
                  <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 -left-28 ml-0">
                    <IdVerifiedBadge isVerified={true} />
                  </div>
                  {/* Online Badge - Mobile */}
                  <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 left-full ml-10">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-bold border-2 shadow-lg whitespace-nowrap transform rotate-[-2deg] ${freelancer.online
                      ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/50 border-dashed'
                      : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/50 border-dashed'
                      }`}>
                      <span className="tracking-widest font-black">{freelancer.online ? 'GAME ON' : 'OFFLINE'}</span>
                    </div>
                  </div>
                </div>

                {/* Online Badge - Desktop */}
                <div className="hidden md:block absolute top-8 right-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border-2 shadow-xl whitespace-nowrap transform rotate-[1deg] ${freelancer.online
                    ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/60 border-dashed'
                    : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/60 border-dashed'
                    }`}>
                    <span className="tracking-widest font-black">{freelancer.online ? 'GAME ON' : 'OFFLINE'}</span>
                  </div>
                </div>

                {/* ID Verified Badge - Desktop */}
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
                    <span>{freelancer.reviewCount || freelancer.reviews || 24} reviews</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {(freelancer.skills || freelancer.expertise)?.map((skill: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSkillClick(skill)}
                    className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 rounded-full px-3 py-1 text-xs transition-colors cursor-pointer"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Tab Navigation */}
        <div className={`sticky top-0 z-[100] ${isScrolledPastCover ? 'bg-[#0f0f0f]/95 backdrop-blur-sm' : 'bg-transparent'} mt-1`}>
          {/* Header when scrolled */}
          {isScrolledPastCover && (
            <div className="border-b border-white/5">
              <div className="flex items-center justify-between px-4 py-2">
                <IconButton
                  icon={ArrowLeft}
                  onClick={handleBack}
                  aria-label="Back"
                />
                <div className="flex-1 flex justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-white font-medium text-sm truncate">{application.freelancer.name}</span>
                    <span className="text-white/60 text-xs truncate">{freelancer.cricketRole || 'All Rounder'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    icon={MessageSquare}
                    onClick={() => router.push(`/client/chat/${encodeURIComponent(application.freelancer.name)}`)}
                    aria-label="Message"
                  />
                  <IconButton
                    icon={Phone}
                    onClick={() => { }}
                    aria-label="Call"
                  />
                  <IconButton
                    icon={Share2}
                    onClick={handleShare}
                    aria-label="Share"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="relative w-full overflow-hidden border-b border-white/5">
            <div className="flex items-center px-4 max-w-4xl mx-auto">
              <div
                className="flex overflow-x-auto hide-scrollbar flex-1"
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
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="px-6 pb-32">
            <div className="space-y-8">
              {/* Application Summary Section */}
              <section id="application" data-section="application" className="scroll-mt-20 pt-4">
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_50%)]"></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-1">Application Details</h2>
                        <p className="text-white/60 text-sm">Submitted application for this position</p>
                      </div>
                      <Badge className={`${application.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        application.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        } backdrop-blur-sm`}>
                        {application.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <p className="text-white/50 text-xs mb-1">Job</p>
                        <p className="text-white font-semibold text-lg">{application.jobTitle}</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <p className="text-white/50 text-xs mb-2">Your Proposal</p>
                        <p className="text-white/90 text-sm leading-relaxed">{application.proposal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section id="about" data-section="about" className="pt-8 scroll-mt-20 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <p className="text-white mb-6 whitespace-pre-line">{freelancer.bio || freelancer.about}</p>

                {/* Cricket Information */}
                {(freelancer.cricketRole || freelancer.battingStyle || freelancer.bowlingStyle) && (
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
                )}

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
                      <span className="font-medium text-white">{freelancer.completionRate || 95}%</span>
                    </div>
                  </div>
                </div>

              </section>

              {/* Services Section */}
              {freelancer.services && freelancer.services.length > 0 && (
                <section id="services" data-section="services" className="pt-8 scroll-mt-20 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-white mb-1">My Services</h2>
                    <p className="text-white/60 text-sm">Professional services tailored to your needs</p>
                  </div>

                  <div className="relative">
                    <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                      <div className="flex gap-4 px-2">
                        {freelancer.services.map((service: any) => (
                          <div key={service.id} className="relative w-80 flex-shrink-0 p-5 pt-8 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors">
                            {service.category && (
                              <div className="absolute top-3 left-3 z-10">
                                <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs">
                                  {service.category}
                                </Badge>
                              </div>
                            )}
                            <h3 className="text-lg font-semibold text-white mt-2">{service.title}</h3>
                            <p className="text-white/70 mt-2 text-sm">{service.description}</p>
                            {service.features && (
                              <ul className="mt-3 space-y-2">
                                {service.features.map((feature: string, i: number) => (
                                  <li key={i} className="flex items-start text-sm text-white/80">
                                    <Check className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="text-xl font-bold text-white">{service.price}</div>
                                <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full">{service.deliveryTime}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Portfolio Section */}
              {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                <section id="portfolio" data-section="portfolio" className="pt-8 scroll-mt-20 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-white mb-1">My Portfolio</h2>
                    <p className="text-white/60 text-sm">Showcase of my best work and projects</p>
                  </div>

                  <div className="relative">
                    <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                      <div className="flex gap-4 px-2">
                        {freelancer.portfolio.map((item: any) => (
                          <div
                            key={item.id}
                            className="w-80 flex-shrink-0 group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedPortfolioItem(item);
                              setIsPortfolioModalOpen(true);
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {item.category && (
                              <div className="absolute top-3 left-3 z-10 bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs rounded-full border backdrop-blur-sm">
                                {item.category}
                              </div>
                            )}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="font-medium text-white line-clamp-1 text-sm">{item.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Experience Section */}
              {freelancer.experienceDetails && freelancer.experienceDetails.length > 0 && (
                <section id="experience" data-section="experience" className="pt-8 scroll-mt-20 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-1">Experience & Qualifications</h2>
                    <p className="text-white/60 text-sm">My professional journey and credentials</p>
                  </div>

                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10"></div>
                    <div className="space-y-4">
                      {freelancer.experienceDetails.map((exp: any) => (
                        <div key={exp.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center z-10">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 pb-4">
                            <h3 className="font-medium text-white">{exp.role}</h3>
                            <p className="text-white/70">{exp.company}</p>
                            <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{exp.location}</span>
                              <span className="mx-1">•</span>
                              <Award className="h-3.5 w-3.5" />
                              <span>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
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
                <section id="reviews" data-section="reviews" className="pt-8 scroll-mt-20 relative">
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
                            className={`h-5 w-5 ${i < Math.floor(application.freelancer.rating) ? 'fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <div className="text-white">
                        <span className="font-medium">{application.freelancer.rating.toFixed(1)}</span>
                        <span className="text-white/60"> ({freelancer.reviewCount || 24} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex -mx-2 overflow-x-auto scrollbar-hide pb-2">
                      <div className="flex gap-4 px-2">
                        {freelancer.reviewsData.map((review: any) => (
                          <div key={review.id} className="w-80 flex-shrink-0 p-5 rounded-3xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                  <div className="w-5 h-5 rounded-full bg-white/20"></div>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-medium text-white text-sm truncate">{review.author}</h4>
                                  {review.role && (
                                    <div className="text-xs text-white/60 truncate">{review.role}</div>
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
                            <p className="text-sm text-white/80">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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

      {/* Sticky Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-white/10 z-[100]">
        <div className="flex gap-3 max-w-4xl mx-auto">
          {application.status === "new" && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-white/20 bg-white/5 text-white hover:bg-red-500/20 hover:text-red-100"
                onClick={handleReject}
                disabled={isProcessing}
              >
                Decline
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white"
                onClick={handleAccept}
                disabled={isProcessing}
              >
                Accept Application
              </Button>
            </>
          )}
          {application.status === "accepted" && (
            <>
              <Button
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
              >
                Reject
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowReschedule(true)}
                disabled={isProcessing}
              >
                Reschedule
              </Button>
            </>
          )}
          {application.status === "rejected" && (
            <Button
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10"
              variant="outline"
              onClick={() => setShowReconsiderDialog(true)}
              disabled={isProcessing}
            >
              Reconsider Application
            </Button>
          )}
        </div>
      </div>

      {/* All Dialogs */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-white">Accept Application</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to hire this freelancer? This will mark the application as accepted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowAcceptDialog(false)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptConfirm}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Confirm Acceptance'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-white">Decline Application</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to decline this application? It will be moved to Rejected status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDeclineDialog(false)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isProcessing ? 'Processing...' : 'Decline Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReconsiderDialog} onOpenChange={setShowReconsiderDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-white">Reconsider Application</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to reconsider this application? It will be moved back to New status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowReconsiderDialog(false)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReconsider}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isProcessing ? 'Processing...' : 'Reconsider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Application</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to reject this previously accepted application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowRejectDialog(false)}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isProcessing ? 'Processing...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RescheduleModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        booking={previewBooking}
        onReschedule={handleRescheduleConfirm}
      />
    </div>
  );
}
