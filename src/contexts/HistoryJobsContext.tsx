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

// Initial state
const initialHistoryJobs: HistoryJob[] = [];

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
