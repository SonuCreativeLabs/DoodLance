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

export type WorkMode = 'remote' | 'onsite' | 'hybrid';

export type JobType = 'freelance' | 'part-time' | 'full-time' | 'contract';
export type JobDuration = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type ExperienceLevel = 'Entry Level' | 'Intermediate' | 'Expert';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  budget: number;
  location: string;
  coords: [number, number];
  skills: string[];
  workMode: WorkMode;
  type: JobType;
  postedAt: string;
  clientName: string;
  clientImage: string;
  clientRating: string;
  clientJobs: number;
  proposals: number;
  duration: JobDuration;
  experience: ExperienceLevel;
}
