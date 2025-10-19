// Status Types
export type JobStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'upcoming';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'interview' | 'hired' | 'completed' | 'cancelled' | 'expired' | 'archived';
export type TransactionStatus = 'pending' | 'failed' | 'completed';

export type StatusType = JobStatus | ApplicationStatus | TransactionStatus;

// Job Categories
export type JobCategory = 
  | 'PHOTO' 
  | 'VIDEO' 
  | 'DESIGN' 
  | 'MUSIC' 
  | 'DANCE' 
  | 'EVENT' 
  | 'OTHER';

export const JOB_CATEGORIES = [
  'PHOTO',
  'VIDEO',
  'DESIGN',
  'MUSIC',
  'DANCE',
  'EVENT',
  'OTHER'
] as const;

export interface ClientInfo {
  name: string;
  rating?: number;
  jobsCompleted?: number;
  memberSince?: string;
  phoneNumber?: string;
  image?: string;
  moneySpent?: number;
  location?: string;
  joinedDate?: string;
  freelancersWorked?: number;
  freelancerAvatars?: string[];
}

export interface CancellationDetails {
  cancelledBy: 'client' | 'freelancer';
  cancelledAt: string;
  notes?: string;
}

export interface Rating {
  stars: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  date: string;
}

export interface FreelancerRating {
  stars: 1 | 2 | 3 | 4 | 5;
  review: string;
  feedbackChips: string[];
  date: string;
}

export interface Job {
  id: string;
  title: string;
  category: JobCategory;
  date: string;
  time: string;
  jobDate?: string; // Scheduled date for the job
  jobTime?: string;  // Scheduled time for the job
  status: JobStatus | 'upcoming' | 'completed' | 'cancelled';
  payment: number | string;
  location: string;
  description?: string;
  skills?: string[];
  duration?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  client?: ClientInfo;
  cancellationDetails?: CancellationDetails;
  rating?: Rating;
  clientRating?: Rating;
  freelancerRating?: FreelancerRating;
  review?: string; // Direct review property for backward compatibility
  feedbackChips?: string[]; // Direct feedback chips property for backward compatibility
  earnings?: {
    amount: number;
    platformFee: number;
    total: number;
  };
  completedAt?: string;
}

export interface Proposal {
  coverLetter: string;
  proposedRate: number;
  estimatedDays: number;
  skills: string[];
  attachments: string[];
}

export interface Application {
  "#": string;
  jobTitle: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'interview' | 'hired' | 'completed' | 'cancelled' | 'expired' | 'archived';
  clientName: string;
  budget: { min: number; max: number };
  progress: number;
  clientImage?: string;
  location: string;
  postedDate: string;
  description: string;
  clientId: string;
  rating?: number;
  projectsCompleted?: number;
  duration?: string;
  proposal: {
    coverLetter: string;
    proposedRate: number;
    estimatedDays: number;
    skills: string[];
    attachments: string[];
  };
  clientSince?: string;
  clientRating?: number;
  hiredFreelancers?: number;
  moneySpent?: number;
  freelancersWorked?: number;
  freelancerAvatars?: string[];
}

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  jobTitle: string;
  client: string;
  type?: 'credit' | 'debit';
  paymentMethod?: string;
}

export interface EarningsData {
  totalEarnings: number;
  pendingPayouts: number;
  completedJobs: number;
  averageRating: number;
  recentTransactions: Transaction[];
  earningsByMonth: { month: string; earnings: number }[];
}
