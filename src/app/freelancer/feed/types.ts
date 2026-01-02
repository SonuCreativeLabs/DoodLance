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
  distance: number;
  price: number;
  priceUnit: string;
  coords: [number, number];
  availability: string[];
  avatar: string;
  skills: string[];
}

export type WorkMode = 'remote' | 'onsite' | 'all';

export type JobType = 'freelance' | 'part-time' | 'full-time' | 'contract';
export type JobDuration = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'one-time';
export type ExperienceLevel = 'Entry Level' | 'Intermediate' | 'Expert';

// Utility function to get work mode display labels
export const getWorkModeLabel = (workMode: string): string => {
  switch (workMode) {
    case 'all':
      return 'All';
    case 'onsite':
      return 'On field';
    case 'remote':
      return 'Online';
    case 'hybrid':
      return 'Hybrid';
    default:
      return workMode;
  }
};

// Utility function to get job duration display labels
export const getJobDurationLabel = (job: Partial<Job> & { clientRating?: any }): string => {
  const { category, title, duration } = job;

  // Check for specific title hints first (overrides category logic)
  const titleLower = title?.toLowerCase() || '';
  if (titleLower.includes('90-minute') || titleLower.includes('90 minute')) {
    return '90 minutes';
  }
  if (titleLower.includes('2-hour') || titleLower.includes('2 hour')) {
    return '2 hours';
  }
  if (titleLower.includes('1-hour') || titleLower.includes('1 hour')) {
    return '1 hour';
  }

  // If duration is already a formatted string (not an enum), return it directly
  if (typeof duration === 'string' && !['hourly', 'daily', 'weekly', 'monthly', 'one-time'].includes(duration)) {
    return duration;
  }

  // If job has a specific duration field, use that to determine the label
  if (duration) {
    const categoryLower = category?.toLowerCase() || '';
    const durationValue = typeof duration === 'string' ? duration : duration;

    // Duration labels based on category and duration type
    switch (durationValue) {
      case 'hourly':
        if (categoryLower.includes('coach') || categoryLower.includes('coaching')) {
          return '1 hour'; // Default for coaching
        } else if (categoryLower.includes('bowling') || categoryLower.includes('net bowler') || categoryLower.includes('sidearm')) {
          return '1.5 hours'; // Bowling sessions
        } else if (categoryLower.includes('batting')) {
          return '1 hour'; // Batting sessions
        } else if (categoryLower.includes('analyst') || categoryLower.includes('analysis')) {
          return '2 hours'; // Analysis sessions
        } else if (categoryLower.includes('photo') || categoryLower.includes('videography')) {
          return '3 hours'; // Event photography
        } else if (categoryLower.includes('content creator')) {
          return '3 hours'; // Content creation
        } else if (categoryLower.includes('physio')) {
          return '1 hour'; // Physio sessions
        } else if (categoryLower.includes('conditioning') || categoryLower.includes('fitness')) {
          return '1.5 hours'; // Conditioning sessions
        }
        return '1 hour'; // Default hourly

      case 'daily':
        if (categoryLower.includes('scorer')) {
          return 'per match';
        }
        return 'per day';

      case 'weekly':
        return 'per week';

      case 'monthly':
        return 'per month';

      case 'one-time':
        if (categoryLower.includes('scorer') || categoryLower.includes('umpire')) {
          return 'per match';
        } else if (categoryLower.includes('photo') || categoryLower.includes('video')) {
          return 'per event';
        }
        return 'one-time';

      default:
        return 'per session'; // Fallback
    }
  }

  // Fallback if no duration field (shouldn't happen with updated jobs)
  return '1 hour';
};

export interface ClientInfo {
  name: string;
  image?: string;
  memberSince?: string;
  freelancerAvatars?: string[];
  freelancersWorked?: number;
  moneySpent?: number;
  rating?: number;
  jobsCompleted?: number;
  location?: string;
  phoneNumber?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  budget: number;
  priceUnit: string;
  location: string;
  coords: [number, number];
  skills: string[];
  workMode: WorkMode;
  type: JobType;
  postedAt: string;
  scheduledAt?: string; // When the job is actually happening
  company: string;
  companyLogo: string;
  clientName: string;
  clientImage?: string;

  clientJobs: number;
  proposals: number;
  duration?: JobDuration;
  experience: ExperienceLevel;
  client?: ClientInfo;
  // Added for JobDetailsModal compatibility
  status?: 'upcoming' | 'pending' | 'started' | 'completed' | 'cancelled';
  payment?: number;
  freelancerRating?: {
    stars: number;
    review: string;
    feedbackChips: string[];
    date: string;
  };
  clientRating?: {
    stars: number;
    feedback: string;
    feedbackChips: string[];
  };
  startedAt?: string;
  completedAt?: string;
  otp?: string;
  cancellationDetails?: {
    cancelledBy: 'client' | 'freelancer';
    cancelledAt: string;
    notes?: string;
  };
}
