'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface HistoryJob {
  "#": string;
  title: string;
  freelancer: {
    name: string;
    image: string;
    rating: number;
  };
  completedDate: string;
  status: string;
  yourRating: number;
  earnedMoney: string;
}

interface HistoryJobsContextType {
  historyJobs: HistoryJob[];
  loading: boolean;
  error: string | null;
  refreshHistoryJobs: () => void;
}

const HistoryJobsContext = createContext<HistoryJobsContextType | undefined>(undefined);

// Initial mock data - this would typically come from an API
const initialHistoryJobs: HistoryJob[] = [
  {
    "#": "#TNCHE101",
    title: "Fast Bowling Training",
    freelancer: {
      name: "Jasprit Bumrah",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bumrah",
      rating: 4.9,
    },
    completedDate: "2024-03-10",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹12,500"
  },
  {
    "#": "#TNCHE102",
    title: "Batting Practice Session",
    freelancer: {
      name: "KL Rahul",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=KL",
      rating: 4.7,
    },
    completedDate: "2024-03-08",
    status: "Cancelled",
    yourRating: 4,
    earnedMoney: "₹10,000"
  },
  {
    "#": "#TNCHE103",
    title: "Wicket Keeping Training",
    freelancer: {
      name: "MS Dhoni",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dhoni",
      rating: 4.8,
    },
    completedDate: "2024-03-08",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹15,000"
  },
  {
    "#": "#TNCHE104",
    title: "Cricket Match Analysis",
    freelancer: {
      name: "Anil Kumble",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kumble",
      rating: 4.8,
    },
    completedDate: "2024-03-05",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹16,500"
  }
];

export function HistoryJobsProvider({ children }: { children: ReactNode }) {
  const [historyJobs, setHistoryJobs] = useState<HistoryJob[]>(initialHistoryJobs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHistoryJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll just reset to initial data
      setHistoryJobs(initialHistoryJobs);
    } catch (err) {
      setError('Failed to load history jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshHistoryJobs();
  }, []);

  const value = {
    historyJobs,
    loading,
    error,
    refreshHistoryJobs
  };

  return (
    <HistoryJobsContext.Provider value={value}>
      {children}
    </HistoryJobsContext.Provider>
  );
}

export function useHistoryJobs() {
  const context = useContext(HistoryJobsContext);
  if (context === undefined) {
    throw new Error('useHistoryJobs must be used within a HistoryJobsProvider');
  }
  return context;
}
