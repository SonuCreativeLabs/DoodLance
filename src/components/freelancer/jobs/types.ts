// Status Types
export type JobStatus = 'pending' | 'completed' | 'cancelled' | 'upcoming' | 'started' | 'ongoing';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'interview' | 'hired' | 'completed' | 'cancelled' | 'expired' | 'archived';
export type TransactionStatus = 'pending' | 'failed' | 'completed';

export type StatusType = JobStatus | ApplicationStatus | TransactionStatus;

// Job Categories
export type JobCategory =
  | 'Match Player'
  | 'Net Bowler'
  | 'Net Batsman'
  | 'Sidearm'
  | 'Coach'
  | 'Sports Conditioning Trainer'
  | 'Fitness Trainer'
  | 'Analyst'
  | 'Physio'
  | 'Scorer'
  | 'Umpire'
  | 'Cricket Photo / Videography'
  | 'Cricket Content Creator'
  | 'Commentator'
  | 'OTHER';

export const JOB_CATEGORIES = [
  'Match Player',
  'Net Bowler',
  'Net Batsman',
  'Sidearm',
  'Coach',
  'Sports Conditioning Trainer',
  'Fitness Trainer',
  'Analyst',
  'Physio',
  'Scorer',
  'Umpire',
  'Cricket Photo / Videography',
  'Cricket Content Creator',
  'Commentator',
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
  experienceLevel?: string;
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
  otp?: string; // 4-digit verification code for starting job
  startedAt?: string; // Timestamp when job was started
  earnings?: {
    baseAmount: number;
    tips: number;
    addOnServices: number;
    platformCommission: number;
    gst: number; // GST amount
    totalEarnings: number;
    commissionRate?: number; // percentage
    gstRate?: number; // GST percentage
    breakdown?: {
      baseAmount: number;
      tips: number;
      addOnServices: {
        name: string;
        amount: number;
      }[];
      platformCommission: number;
      gst: number;
      totalEarnings: number;
    };
  };
  addOnServices?: {
    name: string;
    price: number;
    description?: string;
  }[];
  completedAt?: string;
  cancelledBy?: 'client' | 'freelancer';
  cancelledAt?: string;
  notes?: string;
  // Proposal history for timeline continuity
  proposalHistory?: {
    postedAt: string;
    appliedDate: string;
    clientSpottedDate?: string;
    acceptedDate?: string;
  };
  isProposal?: boolean; // Flag to identify jobs that originated from accepted proposals
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
  category: string;
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
  experienceLevel?: string;
  clientViewedAt?: string; // Timestamp when client viewed this application
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
