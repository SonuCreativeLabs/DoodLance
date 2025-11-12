'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface PersonalDetails {
  name: string;
  title: string;
  location: string;
  about: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  online: boolean;
  readyToWork: boolean;
  dateOfBirth?: string;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
  toggleReadyToWork: () => void;
}

const initialPersonalDetails: PersonalDetails = {
  name: "Sathishraj",
  title: "All rounder",
  location: "Chennai, India",
  about: "Professional Cricketer & AI Engineer with a passion for technology and sports. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.",
  bio: "Professional Cricketer & AI Engineer with a passion for technology and sports.",
  avatarUrl: '/images/profile-sonu.jpg',
  coverImageUrl: '/images/cover-pic.JPG',
  online: true,
  readyToWork: true,
  dateOfBirth: "2000-01-14",
};

const PersonalDetailsContext = createContext<PersonalDetailsContextType | undefined>(undefined);

export function PersonalDetailsProvider({ children }: { children: ReactNode }) {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(initialPersonalDetails);
  const hasHydrated = useRef(false);

  const updatePersonalDetails = useCallback((updates: Partial<PersonalDetails>) => {
    setPersonalDetails(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const toggleReadyToWork = useCallback(() => {
    setPersonalDetails(prev => {
      const newStatus = !prev.readyToWork;
      return {
        ...prev,
        readyToWork: newStatus,
        online: newStatus, // Sync online status with ready to work
      };
    });
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('personalDetails');
      if (saved) {
        setPersonalDetails(JSON.parse(saved));
      }
      
      // Also sync with personalInfo data from personal details page
      const personalInfo = localStorage.getItem('personalInfo');
      if (personalInfo) {
        const parsedPersonalInfo = JSON.parse(personalInfo);
        setPersonalDetails(prev => ({
          ...prev,
          name: parsedPersonalInfo.fullName || prev.name,
          title: parsedPersonalInfo.jobTitle || prev.title,
          bio: parsedPersonalInfo.bio || prev.bio,
          dateOfBirth: parsedPersonalInfo.dateOfBirth || prev.dateOfBirth,
        }));
      }
    } catch (error) {
      console.error('Failed to parse personal details:', error);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  // Save to localStorage whenever it changes (skip first paint)
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
  }, [personalDetails]);

  const value: PersonalDetailsContextType = {
    personalDetails,
    updatePersonalDetails,
    toggleReadyToWork,
  };

  return (
    <PersonalDetailsContext.Provider value={value}>
      {children}
    </PersonalDetailsContext.Provider>
  );
}

export function usePersonalDetails() {
  const context = useContext(PersonalDetailsContext);
  if (context === undefined) {
    throw new Error('usePersonalDetails must be used within a PersonalDetailsProvider');
  }
  return context;
}
