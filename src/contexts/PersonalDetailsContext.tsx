'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

export interface PersonalDetails {
  name: string;
  title: string;
  location: string;
  about: string;
  avatarUrl: string;
  coverImageUrl: string;
  online: boolean;
}

interface PersonalDetailsContextType {
  personalDetails: PersonalDetails;
  updatePersonalDetails: (updates: Partial<PersonalDetails>) => void;
}

const initialPersonalDetails: PersonalDetails = {
  name: "Sathish Sonu",
  title: "Cricketer & AI Engineer",
  location: "Chennai, India",
  about: "Professional Cricketer & AI Engineer with a passion for technology and sports. I bring the same dedication and strategic thinking from the cricket field to developing intelligent AI solutions.",
  avatarUrl: '/images/profile-sonu.jpg',
  coverImageUrl: '/images/cover-pic.JPG',
  online: true,
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('personalDetails');
      if (saved) {
        setPersonalDetails(JSON.parse(saved));
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
