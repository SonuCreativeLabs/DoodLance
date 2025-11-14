export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  type?: 'online' | 'in-person';
  deliveryTime: string;
  features?: string[];
  category?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  role?: string;
  rating: number;
  comment: string;
  date: string;
  isVerified?: boolean;
}

export interface Availability {
  day: string;
  available: boolean;
}

export interface ProfileData {
  name: string;
  title: string;
  about: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  deliveryTime: string;
  completionRate: number;
  online: boolean;
  location: string;
  skills: string[];
  experience: Experience[];
  services: Service[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  availability: Availability[];
  workingHours?: string;
  completedJobs?: number;
  activeJobs?: number;
  languages?: string;
  cricketRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

export interface ProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
}

// Helper function to format date
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to get availability text
export const getAvailabilityText = (availability: Availability[]) => {
  const availableDays = availability
    .filter(day => day.available)
    .map(day => day.day.substring(0, 3));
  
  if (availableDays.length === 7) return 'Available every day';
  if (availableDays.length === 5 && 
      !availableDays.includes('Sat') && 
      !availableDays.includes('Sun')) {
    return 'Available weekdays';
  }
  return `Available: ${availableDays.join(', ')}`;
};
