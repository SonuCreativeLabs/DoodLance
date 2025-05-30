// Status Types
export type JobStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type TransactionStatus = 'pending' | 'failed' | 'completed';

export type StatusType = JobStatus | ApplicationStatus | TransactionStatus;

export interface Job {
  id: string;
  title: string;
  category?: string;
  date: string;
  time: string;
  status: JobStatus;
  payment: number;
  location: string;
  description?: string;
  skills?: string[];
  duration?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Proposal {
  coverLetter: string;
  proposedRate: number;
  estimatedDays: number;
  skills: string[];
  attachments: string[];
}

export interface Application {
  id: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationStatus;
  clientName: string;
  budget: { min: number; max: number };
  progress: number;
  clientImage?: string;
  location: string;
  postedDate: string;
  description: string;
  clientId: string;
  proposal: Proposal;
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
