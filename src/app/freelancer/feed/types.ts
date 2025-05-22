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
  workMode: 'remote' | 'onsite' | 'hybrid';
  type: 'full-time' | 'part-time' | 'contract';
  postedAt: string;
  clientRating: string;
  clientJobs: number;
  proposals: number;
  duration: string;
}
