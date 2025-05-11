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
