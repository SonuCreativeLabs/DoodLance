'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Application {
  "#": string;
  jobTitle: string;
  freelancer: {
    name: string;
    image: string;
    rating: number;
    completedJobs: number;
    responseTime: string;
    location: string;
  };
  proposal: string;
  price: string;
  availability: string;
  status: 'new' | 'accepted' | 'rejected';
}

interface ApplicationsContextType {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refreshApplications: () => void;
  acceptApplication: (id: string) => Promise<void>;
  rejectApplication: (id: string) => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
const initialApplications: Application[] = [
  {
    "#": "#TNADYR001",
    jobTitle: "Spin Bowling Coach",
    freelancer: {
      name: "Ravichandran Ashwin",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ashwin",
      rating: 4.7,
      completedJobs: 156,
      responseTime: "Usually responds in 30 mins",
      location: "2.5 km away - Adyar",
    },
    proposal: "I have 8 years of experience in professional spin bowling coaching. I specialize in off-spin and carrom ball techniques.",
    price: "₹1,800/session",
    availability: "Available this weekend",
    status: "new"
  },
  {
    "#": "#TNTNAG001",
    jobTitle: "Batting Coach",
    freelancer: {
      name: "Rohit Sharma",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
      rating: 4.5,
      completedJobs: 98,
      responseTime: "Usually responds in 1 hour",
      location: "3.8 km away - T Nagar",
    },
    proposal: "Expert in batting technique and shot selection. Specialized in opening batting and limited overs cricket.",
    price: "₹1,200/session",
    availability: "Available tomorrow",
    status: "accepted"
  },
  {
    "#": "#TNMYLA001",
    jobTitle: "Cricket Analyst",
    freelancer: {
      name: "Sunil Gavaskar",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil",
      rating: 4.2,
      completedJobs: 75,
      responseTime: "Usually responds in 45 mins",
      location: "1.5 km away - Mylapore",
    },
    proposal: "Certified cricket analyst with experience in match analysis and performance improvement strategies.",
    price: "₹1,500/session",
    availability: "Available today",
    status: "rejected"
  }
];

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to load from localStorage first
      const saved = localStorage.getItem('clientApplications');
      if (saved) {
        setApplications(JSON.parse(saved));
      } else {
        setApplications(initialApplications);
        localStorage.setItem('clientApplications', JSON.stringify(initialApplications));
      }
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (id: string): Promise<void> => {
    try {
      const updatedApplications = applications.map(app =>
        app["#"] === id ? { ...app, status: 'accepted' as const } : app
      );
      setApplications(updatedApplications);
      localStorage.setItem('clientApplications', JSON.stringify(updatedApplications));
    } catch (err) {
      setError('Failed to accept application');
      throw err;
    }
  };

  const rejectApplication = async (id: string): Promise<void> => {
    try {
      const updatedApplications = applications.map(app =>
        app["#"] === id ? { ...app, status: 'rejected' as const } : app
      );
      setApplications(updatedApplications);
      localStorage.setItem('clientApplications', JSON.stringify(updatedApplications));
    } catch (err) {
      setError('Failed to reject application');
      throw err;
    }
  };

  useEffect(() => {
    // Initial load
    refreshApplications();
  }, []);

  const value = {
    applications,
    loading,
    error,
    refreshApplications,
    acceptApplication,
    rejectApplication
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
}
