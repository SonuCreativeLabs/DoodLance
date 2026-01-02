'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import ProfilePreview from './ProfilePreview';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Camera, Upload, Loader2, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';
import { useSkills } from '@/contexts/SkillsContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useExperience } from '@/contexts/ExperienceContext';
import { useServices } from '@/contexts/ServicesContext';
import { useAvailability } from '@/contexts/AvailabilityContext';
import { SkillInfoDialog } from '@/components/common/SkillInfoDialog';
import { getSkillInfo, type SkillInfo } from '@/utils/skillUtils';
import { calculateAge } from '@/utils/personalUtils';
import { IdVerifiedBadge } from './IdVerifiedBadge';
import { useRoleSwitch } from '@/contexts/RoleSwitchContext';

// CoverImage component defined outside the ProfileHeader component
const CoverImage = ({ src, alt = 'Profile Cover' }: { src?: string | null, alt?: string }) => (
  <div className="relative w-full h-full bg-[#111111]">
    <div className="absolute inset-0 flex items-center justify-center">
      <User className="w-16 h-16 text-white/10" />
    </div>
    {src && (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover z-10"
        onError={(e) => {
          console.error('Failed to load cover image');
          e.currentTarget.style.display = 'none';
        }}
      />
    )}
  </div>
);

interface ProfileHeaderProps {
  isPreview?: boolean;
  avatarUrl?: string;
  coverImageUrl?: string;
}

export function ProfileHeader({
  isPreview = false,
  avatarUrl,
  coverImageUrl
}: ProfileHeaderProps) {
  const { personalDetails } = usePersonalDetails();
  const { skills } = useSkills();
  const { reviewsData } = useReviews();
  const { portfolio } = usePortfolio();
  const { experiences } = useExperience();
  const { services } = useServices();
  const { days: availabilityDays, getWorkingHoursText } = useAvailability();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState<SkillInfo | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { switchRole } = useRoleSwitch();
  const { updatePersonalDetails } = usePersonalDetails();

  // Calculate age from personal details
  const age = (() => {
    try {
      if (personalDetails.dateOfBirth && typeof personalDetails.dateOfBirth === 'string') {
        const calculatedAge = calculateAge(personalDetails.dateOfBirth);
        return isNaN(calculatedAge) ? null : calculatedAge;
      }
      return null;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  })();

  // Check for #preview or section hash in URL on component mount and after navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash) {
        // Check if it's a section hash (e.g., #services, #portfolio, #reviews)
        const section = hash.replace('#', '');
        const validSections = ['services', 'portfolio', 'reviews'];

        if (validSections.includes(section)) {
          // Open the preview modal
          setIsPreviewOpen(true);

          // Scroll to the section after a small delay to allow the modal to open
          setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
              element.scrollIntoView();
            }
          }, 0);

          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else if (hash === '#preview') {
          // For backward compatibility
          setIsPreviewOpen(true);
          // Remove the hash without adding to history
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };

    // Check on initial load
    handleHashChange();

    // Also check when the hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle preview modal close
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    // If we're in a modal state, update the URL to remove the hash
    if (window.location.hash === '#preview') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleSkillClick = (skill: any) => {
    // If the skill object has detailed info (from JSON), use it
    if (skill.description || skill.experience || skill.level) {
      setSelectedSkillInfo({
        name: skill.name,
        description: skill.description,
        experience: skill.experience,
        level: skill.level || 'Intermediate'
      });
    } else {
      // Fallback to lookup for legacy/simple skills
      const skillInfo = getSkillInfo(skill.name);
      setSelectedSkillInfo(skillInfo);
    }
    setIsSkillDialogOpen(true);
  };

  // Handle Cover Image Upload
  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCoverImage(result);
      // Persist to context and DB
      updatePersonalDetails({ coverImageUrl: result });
      setIsUploading(false);
      toast.success('Cover photo updated successfully');
    };
    reader.readAsDataURL(file);
  };

  // Handle Profile Image Upload
  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsProfileUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfileImage(result);
      // Persist to context and DB
      updatePersonalDetails({ avatarUrl: result });
      setIsProfileUploading(false);
      toast.success('Profile picture updated successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleEditCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleEditProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    profileInputRef.current?.click();
  };

  return (
    <div className="relative w-full bg-[#0f0f0f] profile-header">
      {/* Cover Photo */}
      <div className="group relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-purple-700">
        {/* Switch to Client Button - Top-right of cover */}
        {!isPreview && (
          <div className="absolute top-4 right-4 z-20">
            <Button
              variant="default"
              size="sm"
              onClick={() => switchRole('client')}
              className="group relative h-8 px-3 text-xs rounded-full overflow-hidden bg-gradient-to-r from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] text-white flex items-center gap-1.5 font-medium transition-all duration-300 border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.02]"
            >
              <RefreshCw className="h-3.5 w-3.5 text-purple-400 transition-transform duration-300 group-hover:rotate-180" />
              <span>Switch to Client</span>
            </Button>
          </div>
        )}
        <div className="absolute inset-0 w-full h-full">
          <CoverImage src={coverImage || coverImageUrl || personalDetails.coverImageUrl} alt={`${personalDetails.name || 'User'}'s cover`} />
        </div>

        {/* Edit Cover Button - Only show in edit mode */}
        {!isPreview && (
          <div className="absolute bottom-4 right-4 z-30">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditCoverClick}
                disabled={isUploading}
                className="h-10 w-10 rounded-full bg-white hover:bg-white/90 p-0 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-[#1E1E1E]" />
                ) : (
                  <Camera className="h-5 w-5 text-[#1E1E1E]" />
                )}
              </Button>
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverImageChange}
                onClick={(e) => { (e.target as HTMLInputElement).value = '' }}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-20">
        <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between -mt-16 mb-4 relative">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#1E1E1E] overflow-hidden bg-[#111111]">
              <Avatar className="w-full h-full">
                <AvatarImage src={profileImage || avatarUrl || personalDetails.avatarUrl} alt={personalDetails.name} />
                <AvatarFallback className="bg-[#1a1a1a] flex items-center justify-center">
                  <User className="w-16 h-16 text-white/20" />
                </AvatarFallback>
              </Avatar>
              {!isPreview && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white hover:bg-white/90"
                    onClick={handleEditProfileClick}
                    disabled={isProfileUploading}
                  >
                    {isProfileUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#1E1E1E]" />
                    ) : (
                      <Camera className="h-5 w-5 text-[#1E1E1E]" />
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={profileInputRef}
                    onChange={handleProfileImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>
            {/* ID Verified Badge - Mobile: left side of profile picture */}
            <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 -left-28 ml-0">
              <IdVerifiedBadge isVerified={personalDetails.isVerified ?? false} />
            </div>
            {/* Online/Offline Badge - Mobile: right side of profile picture */}
            <div className="md:hidden absolute top-[calc(50%+32px)] -translate-y-1/2 left-full ml-10">
              <div className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] font-bold border-2 shadow-lg whitespace-nowrap transform rotate-[-2deg] ${personalDetails.online
                ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/50 border-dashed'
                : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/50 border-dashed'
                }`}>
                <span className="tracking-widest font-black">{personalDetails.online ? 'GAME ON' : 'OFFLINE'}</span>
              </div>
            </div>
          </div>

          {/* Online/Offline Badge - Desktop: top right corner */}
          <div className="hidden md:block absolute top-8 right-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold border-2 shadow-xl whitespace-nowrap transform rotate-[1deg] ${personalDetails.online
              ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white shadow-green-500/60 border-dashed'
              : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white shadow-amber-500/60 border-dashed'
              }`}>
              <span className="tracking-widest font-black">{personalDetails.online ? 'GAME ON' : 'OFFLINE'}</span>
            </div>
          </div>

          {/* ID Verified Badge - Desktop: left corner of profile picture */}
          <div className="hidden md:block absolute top-8 -left-28 transform rotate-[1deg]">
            <IdVerifiedBadge isVerified={personalDetails.isVerified ?? false} isDesktop={true} />
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-white">{personalDetails.name}</h1>
            {age && (
              <span className="text-lg font-semibold text-white/70">{age}</span>
            )}
          </div>
          {personalDetails.username && (
            <p className="text-sm text-white/50 font-medium mt-0.5">@{personalDetails.username}</p>
          )}
          {personalDetails.displayId && (
            <p className="text-xs text-gray-500 mt-1">ID: {personalDetails.displayId}</p>
          )}
          <p className="text-purple-400 font-medium mt-1">{personalDetails.cricketRole || 'Role not set'}</p>

          <div className="mt-2 flex flex-col items-center gap-0.5 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span>{personalDetails.location || 'Location not set'}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(reviewsData?.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                />
              ))}
              <span className="ml-1 font-medium text-white">{(reviewsData?.averageRating || 0).toFixed(1)}</span>
              <span className="mx-1">·</span>
              <span>{reviewsData?.totalReviews || 0} reviews</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {Array.isArray(skills) && skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillClick(skill)}
              className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 rounded-full px-2 py-0.5 text-xs transition-colors cursor-pointer"
            >
              {skill.name}
            </button>
          ))}
        </div>

        {/* Preview Profile Button */}
        <div className="flex justify-center mt-3 mb-4">
          {!isPreview && (
            <Button
              variant="ghost"
              onClick={() => setIsPreviewOpen(true)}
              className="group relative overflow-hidden px-4 py-1.5 h-8 bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white text-xs font-normal rounded-full shadow hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#6B46C1]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview Profile
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#4C1D95] via-[#6B46C1] to-[#4C1D95] opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-full"></span>
              <span className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-200 rounded-full"></span>
            </Button>
          )}
        </div>
      </div>

      {/* Profile Preview Modal */}
      <ProfilePreview
        isOpen={isPreviewOpen}
        onClose={handlePreviewClose}
        profileData={{
          name: personalDetails.name,
          title: personalDetails.cricketRole || '',
          rating: reviewsData?.averageRating || 0,
          reviewCount: reviewsData?.totalReviews || 0,
          location: personalDetails.location,
          online: personalDetails.online,
          skills: Array.isArray(skills) ? skills.map((s: any) => s.name) : [],
          about: personalDetails.about,
          bio: personalDetails.bio,
          cricketRole: personalDetails.cricketRole,
          battingStyle: personalDetails.battingStyle || '',
          bowlingStyle: personalDetails.bowlingStyle || '',
          responseTime: personalDetails.responseTime || 'Not set',
          deliveryTime: personalDetails.deliveryTime || 'Not set',
          completionRate: personalDetails.completionRate || 0,
          completedJobs: personalDetails.completedJobs || 0,
          activeJobs: personalDetails.activeJobs || 0,
          workingHours: getWorkingHoursText(),
          experience: Array.isArray(experiences) ? experiences.map((exp: any) => ({
            id: exp.id,
            role: exp.role,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate?.split('-')[0] || '',
            endDate: exp.endDate ? exp.endDate.split('-')[0] : undefined,
            isCurrent: exp.isCurrent,
            description: exp.description
          })) : [],
          services: Array.isArray(services) ? services.map((svc: any) => ({
            id: svc.id,
            title: svc.title,
            description: svc.description,
            price: svc.price,
            type: svc.type || 'online',
            deliveryTime: svc.deliveryTime,
            features: svc.features || [],
            category: svc.category
          })) : [],
          portfolio: Array.isArray(portfolio) ? portfolio.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image,
            description: item.description,
            skills: item.skills
          })) : [],
          reviews: reviewsData?.reviews ? reviewsData.reviews.map((review: any) => ({
            id: review.id,
            author: review.author,
            role: review.role,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            isVerified: review.isVerified
          })) : [],
          availability: availabilityDays.map(day => ({
            day: day.name,
            available: day.available,
            timeSlots: day.timeSlots
          }))
        }}
      />

      {/* Skill Info Dialog */}
      <SkillInfoDialog
        isOpen={isSkillDialogOpen}
        onClose={() => setIsSkillDialogOpen(false)}
        skillInfo={selectedSkillInfo}
      />
    </div>
  );
}
