'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Professional {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  location: string;
  responseTime: string;
  image: string;
  avatar?: string;
  distance: number;
  price: number;
  budget?: number;
  priceUnit: string;
  coords: [number, number]; // [longitude, latitude]
  expertise: string[];
  experience: string;
  description?: string;
}

interface NearbyProfessionalsContextType {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  refreshProfessionals: () => void;
}

const NearbyProfessionalsContext = createContext<NearbyProfessionalsContextType | undefined>(undefined);

// Create a default value for SSR
const defaultValue: NearbyProfessionalsContextType = {
  professionals: [],
  loading: false,
  error: null,
  refreshProfessionals: () => {}
};

// Initial mock data - this would typically come from an API
const initialProfessionals: Professional[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "Fast Bowler",
    rating: 4.9,
    reviews: 245,
    completedJobs: 320,
    location: "Chepauk Stadium Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    distance: 1.2,
    price: 800,
    priceUnit: "session",
    coords: [80.2095, 13.0850],
    expertise: ["Pace Bowling", "Yorkers", "Bouncers", "Death Overs", "Line & Length"],
    experience: "8 years"
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Batting Coach",
    rating: 5.0,
    reviews: 312,
    completedJobs: 450,
    location: "T Nagar Cricket Ground",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    distance: 2.1,
    price: 1200,
    priceUnit: "session",
    coords: [80.2341, 13.0418],
    expertise: ["Batting Technique", "Shot Selection", "Mental Training", "Fitness"],
    experience: "10 years"
  },
  {
    id: 3,
    name: "Arun Patel",
    service: "Sidearm Specialist",
    rating: 4.8,
    reviews: 189,
    completedJobs: 267,
    location: "Mylapore Cricket Club",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    distance: 3.4,
    price: 500,
    priceUnit: "session",
    coords: [80.2661, 13.0325],
    expertise: ["Sidearm Bowling", "Control", "Variety", "Training"],
    experience: "6 years"
  },
  {
    id: 4,
    name: "Kavita Singh",
    service: "Sports Conditioning",
    rating: 4.9,
    reviews: 156,
    completedJobs: 203,
    location: "Adyar Sports Complex",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    distance: 4.2,
    price: 900,
    priceUnit: "session",
    coords: [80.2565, 13.0064],
    expertise: ["Strength Training", "Agility", "Endurance", "Injury Prevention"],
    experience: "7 years"
  },
  {
    id: 5,
    name: "Suresh Reddy",
    service: "Cricket Analyst",
    rating: 4.7,
    reviews: 98,
    completedJobs: 145,
    location: "Velachery Sports Academy",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    distance: 5.8,
    price: 1500,
    priceUnit: "analysis",
    coords: [80.2206, 12.9758],
    expertise: ["Match Analysis", "Player Stats", "Strategy", "Video Analysis"],
    experience: "5 years"
  },
  // Additional Playing Services professionals
  {
    id: 6,
    name: "Vikram Joshi",
    service: "Net Bowler",
    rating: 4.8,
    reviews: 203,
    completedJobs: 289,
    location: "Anna Nagar Sports Complex",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    distance: 3.1,
    price: 600,
    priceUnit: "session",
    coords: [80.2210, 13.0840],
    expertise: ["Net Bowling", "Accuracy", "Pace", "Control", "Practice Sessions"],
    experience: "7 years"
  },
  {
    id: 7,
    name: "Rohit Verma",
    service: "Match Player",
    rating: 4.9,
    reviews: 178,
    completedJobs: 245,
    location: "Porur Cricket Ground",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    distance: 6.2,
    price: 1800,
    priceUnit: "match",
    coords: [80.1580, 13.0350],
    expertise: ["All-rounder", "Opening Batsman", "Medium Pace", "Fielding"],
    experience: "9 years"
  },
  {
    id: 8,
    name: "Sneha Kapoor",
    service: "Net Batsman",
    rating: 4.7,
    reviews: 167,
    completedJobs: 234,
    location: "Chromepet Sports Academy",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    distance: 8.5,
    price: 550,
    priceUnit: "session",
    coords: [80.1460, 12.9550],
    expertise: ["Batting Practice", "Shot Making", "Footwork", "Timing"],
    experience: "6 years"
  },
  // Additional Coaching & Training professionals
  {
    id: 9,
    name: "Amit Sharma",
    service: "Coach",
    rating: 4.8,
    reviews: 267,
    completedJobs: 356,
    location: "Vadapalani Cricket Academy",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    distance: 4.8,
    price: 550,
    priceUnit: "session",
    coords: [80.2120, 13.0500],
    expertise: ["Team Coaching", "Strategy", "Motivation", "Youth Development"],
    experience: "12 years"
  },
  {
    id: 10,
    name: "Deepak Nair",
    service: "Fitness Trainer",
    rating: 4.9,
    reviews: 198,
    completedJobs: 278,
    location: "Adyar Sports Complex",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    distance: 4.2,
    price: 750,
    priceUnit: "session",
    coords: [80.2565, 13.0064],
    expertise: ["Strength Training", "Cardio", "Flexibility", "Nutrition"],
    experience: "8 years"
  },
  // Additional Support Staff professionals
  {
    id: 11,
    name: "Dr. Meera Iyer",
    service: "Physio",
    rating: 4.8,
    reviews: 145,
    completedJobs: 189,
    location: "T Nagar Sports Clinic",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    distance: 2.1,
    price: 1600,
    priceUnit: "consultation",
    coords: [80.2341, 13.0418],
    expertise: ["Sports Injuries", "Rehabilitation", "Massage", "Recovery"],
    experience: "10 years"
  },
  {
    id: 12,
    name: "Ravi Kumar",
    service: "Scorer",
    rating: 4.6,
    reviews: 89,
    completedJobs: 124,
    location: "Chepauk Stadium Area",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    distance: 1.2,
    price: 400,
    priceUnit: "match",
    coords: [80.2095, 13.0850],
    expertise: ["Scorekeeping", "Statistics", "Match Records", "Live Scoring"],
    experience: "15 years"
  },
  {
    id: 13,
    name: "Anil Menon",
    service: "Umpire",
    rating: 4.7,
    reviews: 134,
    completedJobs: 178,
    location: "Mylapore Cricket Club",
    responseTime: "Usually responds in 45 mins",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    distance: 3.4,
    price: 650,
    priceUnit: "match",
    coords: [80.2661, 13.0325],
    expertise: ["Match Officiating", "Rules Knowledge", "Decision Making", "Tournament Experience"],
    experience: "20 years"
  },
  // Additional Media & Content professionals
  {
    id: 14,
    name: "Kiran Rao",
    service: "Cricket Photo/Videography",
    rating: 4.8,
    reviews: 156,
    completedJobs: 203,
    location: "Velachery Sports Academy",
    responseTime: "Usually responds in 1 hour",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    distance: 5.8,
    price: 1900,
    priceUnit: "event",
    coords: [80.2206, 12.9758],
    expertise: ["Event Photography", "Video Recording", "Editing", "Highlight Reels"],
    experience: "6 years"
  },
  {
    id: 15,
    name: "Nisha Patel",
    service: "Cricket Content Creator",
    rating: 4.9,
    reviews: 223,
    completedJobs: 312,
    location: "Anna Nagar Sports Complex",
    responseTime: "Usually responds in 30 mins",
    image: "https://randomuser.me/api/portraits/women/15.jpg",
    distance: 3.1,
    price: 1300,
    priceUnit: "content",
    coords: [80.2210, 13.0840],
    expertise: ["Social Media", "Content Strategy", "Video Editing", "Cricket Commentary"],
    experience: "5 years"
  },
  {
    id: 16,
    name: "Raj Singh",
    service: "Commentator",
    rating: 4.7,
    reviews: 189,
    completedJobs: 245,
    location: "Porur Cricket Ground",
    responseTime: "Usually responds in 2 hours",
    image: "https://randomuser.me/api/portraits/men/16.jpg",
    distance: 6.2,
    price: 2000,
    priceUnit: "match",
    coords: [80.1580, 13.0350],
    expertise: ["Live Commentary", "Analysis", "Broadcasting", "Cricket Knowledge"],
    experience: "14 years"
  }
];

export function NearbyProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfessionals = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setProfessionals(initialProfessionals);
    } catch (err) {
      setError('Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshProfessionals();
  }, []);

  const value = {
    professionals,
    loading,
    error,
    refreshProfessionals
  };

  return (
    <NearbyProfessionalsContext.Provider value={value}>
      {children}
    </NearbyProfessionalsContext.Provider>
  );
}

export function useNearbyProfessionals() {
  const context = useContext(NearbyProfessionalsContext);
  if (context === undefined) {
    // Return default value for SSR or when context is not available
    return defaultValue;
  }
  return context;
}
