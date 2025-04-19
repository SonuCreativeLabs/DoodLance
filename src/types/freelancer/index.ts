export interface FreelancerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  rate: number;
  rating: number;
  totalJobs: number;
  portfolio: PortfolioItem[];
  availability: 'available' | 'busy' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  skills: string[];
  clientName?: string;
  completedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  clientRating: number;
  title: string;
  description: string;
  budget: number;
  proposal: string;
  rate: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface WorkHistory {
  id: string;
  jobId: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  rate: number;
  status: 'in-progress' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
}

export interface Earnings {
  id: string;
  jobId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
} 