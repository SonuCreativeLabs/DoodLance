import { Category } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'All', icon: '' },
  { id: 10, name: 'Playing Services', icon: '' },
  { id: 11, name: 'Coaching & Training', icon: '' },
  { id: 12, name: 'Support Staff', icon: '' },
  { id: 13, name: 'Media & Content', icon: '' },
];

export const areas = [
  "Velachery", "Anna Nagar", "T Nagar", "Adyar", 
  "Mylapore", "Porur", "Vadapalani", "Chromepet"
];

export const serviceTypes = [
  "Bowler", "Batsman", "Sidearm Specialist", "Coach",
  "Trainer", "Analyst", "Physio", "Scorer", "Umpire",
  "Cricket Photo/Videography", "Cricket Content Creator", "Commentator",
  "Match Player", "Other"
];

export const availabilityOptions = [
  "Available Now", "Available Today", 
  "Available This Week", "Available Next Week"
];

export const timeOptions = [
  'Any', 'Morning', 'Afternoon', 'Evening', 'Night'
]; 