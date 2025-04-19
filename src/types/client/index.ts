export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  freelancerId?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  bio?: string;
  rating: number;
  totalJobs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerRating: number;
  proposal: string;
  rate: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
} 