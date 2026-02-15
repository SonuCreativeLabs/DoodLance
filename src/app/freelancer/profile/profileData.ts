// Shared profile data for freelancer
export interface ExtendedFreelancerData {
  name: string;
  title: string;
  about: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  deliveryTime: string;
  completionRate: number;
  online: boolean;
  location: string;
  skills: string[];
  services: Service[];
  clientReviews: ClientReview[];
  availability: AvailabilityEntry[];
  completedJobs: number;
  activeJobs: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  deliveryTime: string;
  type?: 'online' | 'in-person';
  features?: string[];
}

export interface ClientReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AvailabilityEntry {
  day: string;
  available: boolean;
}

export const freelancerData: ExtendedFreelancerData = {
  name: "",
  title: "",
  about: "",
  rating: 0,
  reviewCount: 0,
  responseTime: "",
  deliveryTime: "",
  completionRate: 0,
  online: false,
  location: "",
  skills: [],
  services: [],
  clientReviews: [],
  availability: [],
  completedJobs: 0,
  activeJobs: 0
};
