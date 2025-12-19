export interface Freelancer {
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
  expertise: string[];
  experience: string;
  description?: string;
  cricketRole?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
} 