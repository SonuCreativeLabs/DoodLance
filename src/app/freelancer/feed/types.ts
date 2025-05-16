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

export interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  description: string;
  budget: string;
  duration: string;
  location: string;
  type: string;
  skills: string[];
  image: string;
  postedAt: string;
  proposals: number;
  coords?: [number, number];
}
