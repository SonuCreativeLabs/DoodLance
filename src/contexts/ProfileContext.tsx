'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getInitialRatingStats } from '@/data/reviewsData';

// Default skills that match SkillsSection
const defaultSkills = [
  "RH Batsman",
  "Sidearm Specialist", 
  "Off Spin",
  "Batting Coach",
  "Analyst",
  "Mystery Spin"
];

// Types
export interface FreelancerProfile {
  name: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  online: boolean;
  avatarUrl: string;
  coverImageUrl: string;
}

interface ProfileContextType {
  profileData: FreelancerProfile;
  updateProfile: (updates: Partial<FreelancerProfile>) => void;
  updatePersonalDetails: (name: string, title: string, location: string) => void;
  updateRating: (rating: number, reviewCount: number) => void;
  updateSkills: (skills: string[]) => void;
}

// Initial profile data with calculated rating and default skills
const initialProfileData: FreelancerProfile = (() => {
  const { averageRating, totalReviews } = getInitialRatingStats();
  return {
    name: "Sathish Sonu",
    title: "Cricketer & AI Engineer",
    location: "Chennai, India",
    rating: averageRating,
    reviewCount: totalReviews,
    skills: defaultSkills, // Initialize with default skills so they show immediately
    online: true,
    avatarUrl: '/images/profile-sonu.jpg', // Default avatar
    coverImageUrl: '/images/cover-pic.JPG', // Default cover
  };
})();

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Provider component
export function ProfileProvider({ children }: { children: ReactNode }) {
  // Initialize with initialProfileData
  const [profileData, setProfileData] = useState<FreelancerProfile>(initialProfileData);

  // Update profile data
  const updateProfile = useCallback((updates: Partial<FreelancerProfile>) => {
    setProfileData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Specific update functions for different sections
  const updatePersonalDetails = useCallback((name: string, title: string, location: string) => {
    updateProfile({ name, title, location });
  }, [updateProfile]);

  const updateRating = useCallback((rating: number, reviewCount: number) => {
    updateProfile({ rating, reviewCount });
  }, [updateProfile]);

  const updateSkills = useCallback((skills: string[]) => {
    updateProfile({ skills });
  }, [updateProfile]);

  // Load from localStorage on mount (for persistence across sessions) - but exclude skills
  useEffect(() => {
    const savedProfile = localStorage.getItem('freelancerProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Don't load skills from localStorage - let SkillsSection control them
        const { skills, ...profileWithoutSkills } = parsed;
        setProfileData(prev => ({
          ...prev,
          ...profileWithoutSkills
        }));
      } catch (error) {
        console.error('Failed to parse saved profile data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever profileData changes
  useEffect(() => {
    localStorage.setItem('freelancerProfile', JSON.stringify(profileData));
  }, [profileData]);

  const value: ProfileContextType = {
    profileData,
    updateProfile,
    updatePersonalDetails,
    updateRating,
    updateSkills,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// Hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
