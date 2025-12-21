'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Application {
  "#": string;
  id?: string; // Add id alias 
  jobId: string; // Add jobId for filtering
  jobTitle: string;
  freelancer: {
    id?: string;
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
  status: 'new' | 'accepted' | 'rejected' | 'pending';
}

interface ApplicationsContextType {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refreshApplications: () => void;
  acceptApplication: (id: string) => Promise<void>;
  rejectApplication: (id: string) => Promise<void>;
  reconsiderApplication: (id: string) => Promise<void>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get user session to know which client ID (userId)
      const sessionRes = await fetch('/api/auth/session');
      let userId = 'user_123'; // fallback
      if (sessionRes.ok) {
        const session = await sessionRes.json();
        if (session.id) userId = session.id;
      }

      // Fetch applications where I am the client (myJobs=true)
      const response = await fetch(`/api/applications?myJobs=true&userId=${userId}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();

      // Map API response to Application interface
      let mappedApps: Application[] = data.map((app: any) => ({
        "#": app["#"],
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        freelancer: {
          id: app.freelancer?.id,
          name: app.freelancer?.name || 'Unknown',
          image: app.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.freelancer?.name || 'User'}`,
          rating: 4.8, // Mock
          completedJobs: 12, // Mock 
          responseTime: '2 hours', // Mock
          location: app.freelancer?.location || 'Remote',
        },
        proposal: app.proposal?.coverLetter || app.description || 'No proposal text',
        price: `₹${app.proposal?.proposedRate || 0}`,
        availability: 'Flexible', // Mock
        status: app.status === 'pending' ? 'new' : (app.status as any),
      }));

      // Fallback to mock data if empty (for UI testing)
      if (mappedApps.length === 0) {
        mappedApps = [
          {
            "#": "#TNADYR001",
            jobId: "mock_job_1",
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
            jobId: "mock_job_2",
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
            jobId: "mock_job_3",
            jobTitle: "Cricket Analyst",
            freelancer: {
              name: "Sunil Gavaskar",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil",
              rating: 4.2,
              completedJobs: 75,
              responseTime: "Usually responds in 45 mins",
              location: "1.5 km away - Mylapore",
            },
            proposal: "Certified cricket analyst",
            price: "₹1,500/session",
            availability: "Available today",
            status: "rejected"
          }
        ];
      }

      setApplications(mappedApps);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      // Fallback to empty if API fails (or keep existing if desirable, but better to clear/show error)
      setApplications([]);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (id: string): Promise<void> => {
    try {
      // Optimistic update
      setApplications(prev => prev.map(app =>
        app["#"] === id ? { ...app, status: 'accepted' as const } : app
      ));

      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'ACCEPTED' })
      });
      window.dispatchEvent(new CustomEvent('applicationUpdated'));
    } catch (err) {
      refreshApplications();
      throw err;
    }
  };

  const rejectApplication = async (id: string): Promise<void> => {
    try {
      // Optimistic update
      setApplications(prev => prev.map(app =>
        app["#"] === id ? { ...app, status: 'rejected' as const } : app
      ));

      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'REJECTED' })
      });
      window.dispatchEvent(new CustomEvent('applicationUpdated'));
    } catch (err) {
      refreshApplications();
      throw err;
    }
  };

  const reconsiderApplication = async (id: string): Promise<void> => {
    try {
      // Optimistic update
      setApplications(prev => prev.map(app =>
        app["#"] === id ? { ...app, status: 'new' as const } : app
      ));

      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PENDING' })
      });
      window.dispatchEvent(new CustomEvent('applicationUpdated'));
    } catch (err) {
      refreshApplications();
      throw err;
    }
  };

  const updateApplication = async (id: string, data: Partial<Application>): Promise<void> => {
    try {
      // Optimistic
      setApplications(prev => prev.map(app =>
        app["#"] === id ? { ...app, ...data } : app
      ));

      const payload: any = {};
      if (data.price) payload.proposedRate = parseFloat(data.price.replace(/[^0-9.]/g, ''));
      if (data.proposal) payload.coverLetter = data.proposal;

      await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      window.dispatchEvent(new CustomEvent('applicationUpdated'));
    } catch (err) {
      refreshApplications();
      throw err;
    }
  }

  useEffect(() => {
    refreshApplications();
  }, []);

  const value = {
    applications,
    loading,
    error,
    refreshApplications,
    acceptApplication,
    rejectApplication,
    reconsiderApplication,
    updateApplication
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
