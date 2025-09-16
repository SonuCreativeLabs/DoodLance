import { Freelancer } from './types';

interface Professional {
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
  coords: [number, number]; // [longitude, latitude]
}

export const professionals: Professional[] = [
  {
    id: 1,
    name: "Amit Patel",
    service: "Bowler",
    rating: 4.9,
    reviews: 245,
    completedJobs: 320,
    location: "Chepauk",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.2,
    price: 1500,
    priceUnit: "session",
    coords: [80.2095, 13.0850] // Anna Nagar coordinates
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Batsman",
    rating: 5.0,
    reviews: 312,
    completedJobs: 450,
    location: "T Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.5,
    price: 2000,
    priceUnit: "session",
    coords: [80.2279, 13.0418] // T Nagar coordinates
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    service: "Coach",
    rating: 5.0,
    reviews: 428,
    completedJobs: 680,
    location: "Chepauk",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.1,
    price: 2500,
    priceUnit: "session",
    coords: [80.2785, 13.0633] // Chepauk coordinates
  },
  {
    id: 4,
    name: "Anjali Reddy",
    service: "Sidearm Specialist",
    rating: 4.9,
    reviews: 189,
    completedJobs: 210,
    location: "Mylapore",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.8,
    price: 1200,
    priceUnit: "hour",
    coords: [80.2687, 13.0368] // Mylapore coordinates
  },
  {
    id: 5,
    name: "Suresh Gupta",
    service: "Cricket Coach",
    rating: 4.8,
    reviews: 267,
    completedJobs: 380,
    location: "Adyar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.7,
    price: 1800,
    priceUnit: "session",
    coords: [80.2574, 13.0012] // Adyar coordinates
  },
  {
    id: 6,
    name: "Meena Iyer",
    service: "Sports Conditioning Trainer",
    rating: 4.7,
    reviews: 156,
    completedJobs: 220,
    location: "Alwarpet",
    responseTime: "Usually responds in 3 hours",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 4.2,
    price: 1000,
    priceUnit: "session",
    coords: [80.2532, 13.0336] // Alwarpet coordinates
  },
  {
    id: 7,
    name: "Vikram Singh",
    service: "Analyst",
    rating: 4.8,
    reviews: 198,
    completedJobs: 280,
    location: "Nungambakkam",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.5,
    price: 1500,
    priceUnit: "session",
    coords: [80.2442, 13.0569] // Nungambakkam coordinates
  },
  {
    id: 8,
    name: "Dr. Neha Joshi",
    service: "Physio",
    rating: 4.9,
    reviews: 234,
    completedJobs: 350,
    location: "Royapettah",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.9,
    price: 800,
    priceUnit: "session",
    coords: [80.2707, 13.0524] // Royapettah coordinates
  },
  {
    id: 9,
    name: "Sunil Desai",
    service: "Commentator",
    rating: 4.9,
    reviews: 178,
    completedJobs: 200,
    location: "Kodambakkam",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 5.1,
    price: 1200,
    priceUnit: "hour",
    coords: [80.2244, 13.0512] // Kodambakkam coordinates
  },
  {
    id: 10,
    name: "Ramesh Nair",
    service: "Umpire",
    rating: 4.8,
    reviews: 145,
    completedJobs: 180,
    location: "Besant Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.8,
    price: 600,
    priceUnit: "match",
    coords: [80.2707, 12.9941] // Besant Nagar coordinates
  },
  {
    id: 11,
    name: "Kavita Menon",
    service: "Cricket Content Creator",
    rating: 4.7,
    reviews: 167,
    completedJobs: 190,
    location: "Velachery",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 4.5,
    price: 800,
    priceUnit: "project",
    coords: [80.2183, 12.9815] // Velachery coordinates
  },
  {
    id: 12,
    name: "Deepak Verma",
    service: "Scorer",
    rating: 4.9,
    reviews: 210,
    completedJobs: 245,
    location: "West Mambalam",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.2,
    price: 400,
    priceUnit: "match",
    coords: [80.2244, 13.0387] // West Mambalam coordinates
  }
];

// Add coordinates for map markers
export const professionalCoordinates = professionals.map(pro => ({
  id: pro.id,
  name: pro.name,
  service: pro.service,
  coords: [
    // Chennai area coordinates
    80.2707 + (Math.random() - 0.5) * 0.1, // Longitude
    13.0827 + (Math.random() - 0.5) * 0.1  // Latitude
  ] as [number, number]
})); 