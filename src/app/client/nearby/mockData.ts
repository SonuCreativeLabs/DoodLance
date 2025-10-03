// import { Freelancer } from './types'; // Commented out - unused

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
  avatar?: string;
  distance: number;
  price: number;
  budget?: number;
  priceUnit: string;
  coords: [number, number]; // [longitude, latitude]
  expertise: string[];
  experience: string;
  description?: string;
}

export const professionals: Professional[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "Fast Bowler",
    rating: 4.9,
    reviews: 245,
    completedJobs: 320,
    location: "Chepauk Stadium Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 1.2,
    price: 2500,
    priceUnit: "session",
    coords: [80.2095, 13.0850],
    expertise: ["Pace Bowling", "Yorkers", "Bouncers", "Death Overs", "Line & Length"],
    experience: "8 years"
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Batting Coach",
    rating: 5.0,
    reviews: 312,
    completedJobs: 450,
    location: "T Nagar Cricket Ground",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 2.5,
    price: 3000,
    priceUnit: "session",
    coords: [80.2279, 13.0418],
    expertise: ["Footwork Drills", "Shot Selection", "Mental Training", "Technique Analysis", "Pressure Situations"],
    experience: "10 years"
  },
  {
    id: 3,
    name: "Arjun Singh",
    service: "Wicket Keeper",
    rating: 4.8,
    reviews: 198,
    completedJobs: 280,
    location: "M.A. Chidambaram Stadium",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 3.1,
    price: 2000,
    priceUnit: "match",
    coords: [80.2785, 13.0633],
    expertise: ["Glove Work", "Stumping", "Standing Up to Pace/Spin", "Catching Drills", "Wicket-keeping Technique"],
    experience: "7 years"
  },
  {
    id: 4,
    name: "Kavita Reddy",
    service: "Spin Bowler",
    rating: 4.9,
    reviews: 189,
    completedJobs: 210,
    location: "Jawaharlal Nehru Stadium",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 1.8,
    price: 2800,
    priceUnit: "session",
    coords: [80.2687, 13.0368],
    expertise: ["Off Spin", "Doosra", "Carrom Ball", "Flight & Drift", "Googly Variations"],
    experience: "9 years"
  },
  {
    id: 5,
    name: "Vikram Patel",
    service: "Cricket Analyst",
    rating: 4.8,
    reviews: 267,
    completedJobs: 380,
    location: "DY Patil Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 2.7,
    price: 3500,
    priceUnit: "analysis",
    coords: [80.2574, 13.0012],
    expertise: ["Performance Analysis", "Video Breakdown", "Statistical Modeling", "Strategy Development", "Player Assessment"],
    experience: "6 years"
  },
  {
    id: 6,
    name: "Ananya Krishnan",
    service: "Sports Physiotherapist",
    rating: 4.7,
    reviews: 156,
    completedJobs: 220,
    location: "Nehru Stadium",
    responseTime: "Usually responds in 3 hours",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 4.2,
    price: 1500,
    priceUnit: "session",
    coords: [80.2532, 13.0336],
    expertise: ["Injury Prevention", "Rehabilitation", "Sports Massage", "Strength Training", "Recovery Protocols"],
    experience: "5 years"
  },
  {
    id: 7,
    name: "Rohit Verma",
    service: "Cricket Commentator",
    rating: 4.8,
    reviews: 198,
    completedJobs: 280,
    location: "Eden Gardens Area",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 3.5,
    price: 4000,
    priceUnit: "event",
    coords: [80.2242, 13.0569],
    expertise: ["Live Commentary", "Match Analysis", "Player Insights", "Technical Knowledge", "Event Hosting"],
    experience: "12 years"
  },
  {
    id: 8,
    name: "Sneha Gupta",
    service: "Cricket Content Creator",
    rating: 4.9,
    reviews: 234,
    completedJobs: 350,
    location: "Brabourne Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 2.9,
    price: 2500,
    priceUnit: "project",
    coords: [80.2707, 13.0524],
    expertise: ["Social Media Content", "Video Editing", "Highlight Reels", "Player Profiles", "Match Coverage"],
    experience: "4 years"
  },
  {
    id: 9,
    name: "Amitabh Singh",
    service: "Umpire",
    rating: 4.9,
    reviews: 178,
    completedJobs: 200,
    location: "Wankhede Stadium Area",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 5.1,
    price: 1800,
    priceUnit: "match",
    coords: [80.2244, 13.0512],
    expertise: ["Laws of Cricket", "Decision Making", "Match Officiating", "Player Conduct", "Equipment Standards"],
    experience: "15 years"
  },
  {
    id: 10,
    name: "Meera Iyer",
    service: "Groundsman",
    rating: 4.8,
    reviews: 145,
    completedJobs: 180,
    location: "Chinnaswamy Stadium",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 3.8,
    price: 1200,
    priceUnit: "day",
    coords: [80.2707, 12.9941],
    expertise: ["Pitch Preparation", "Outfield Maintenance", "Equipment Setup", "Ground Standards", "Weather Management"],
    experience: "11 years"
  },
  {
    id: 11,
    name: "Suresh Menon",
    service: "Cricket Photographer",
    rating: 4.7,
    reviews: 167,
    completedJobs: 190,
    location: "Feroz Shah Kotla",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 4.5,
    price: 2200,
    priceUnit: "event",
    coords: [80.2183, 12.9815],
    expertise: ["Action Photography", "Portrait Shoots", "Event Coverage", "Post-Processing", "Sports Photography"],
    experience: "8 years"
  },
  {
    id: 12,
    name: "Deepika Nair",
    service: "Scorer",
    rating: 4.9,
    reviews: 210,
    completedJobs: 245,
    location: "Green Park Stadium",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1544717305-278a4b3ae3fa?w=200&h=200&fit=crop&crop=face&auto=format&q=80",
    distance: 3.2,
    price: 800,
    priceUnit: "match",
    coords: [80.2244, 13.0387],
    expertise: ["Scorekeeping", "Match Statistics", "Digital Scoring", "Rules Compliance", "Data Management"],
    experience: "6 years"
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