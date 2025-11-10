// Shared profile data for freelancer
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  skills?: string[];
}

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
  portfolio: PortfolioItem[];
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
  name: "Sathish Sonu",
  title: "Cricket All-Rounder",
  about: "I'm a dedicated cricket professional with expertise in batting, bowling, coaching, and match analysis. As a right-handed batsman and off-spin bowler, I bring championship-level experience to every training session and analytical project.",
  rating: 4.9,
  reviewCount: 42,
  responseTime: "1h",
  deliveryTime: "2 days",
  completionRate: 100,
  online: true,
  location: "Chennai, India",
  skills: ["RH Batsman", "Sidearm Specialist", "Off Spin", "Batting coach", "Analyst", "Mystery Spin"],
  services: [
    {
      id: "1",
      title: "Batting Coaching",
      description: "Personalized batting technique training focusing on footwork, shot selection, and match situations.",
      price: "₹2,500",
      deliveryTime: "1 session"
    },
    {
      id: "2",
      title: "Spin Bowling Workshop",
      description: "Off-spin and mystery spin techniques including doosra, carrom ball, and flight variations.",
      price: "₹3,000",
      deliveryTime: "2 hours"
    }
  ],
  portfolio: [
    {
      id: '1',
      title: '3x Division Cricket Champion',
      category: 'Cricket Achievement',
      image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Won the Division Level Cricket Tournament three consecutive years (2020, 2021, 2022) as a top-order batsman and off-spin bowler. Demonstrated exceptional leadership and performance under pressure.',
      skills: ['Cricket', 'Leadership', 'Teamwork']
    },
    {
      id: '2',
      title: 'State Level College Champion',
      category: 'Cricket Achievement',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Led college team to victory in the State Level Inter-College Cricket Tournament. Scored 3 consecutive half-centuries in the knockout stages and took crucial wickets in the final match.',
      skills: ['Cricket', 'Strategy', 'Batting', 'Bowling']
    },
    {
      id: '3',
      title: 'Sports Quota Scholar',
      category: 'Academic Achievement',
      image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Awarded sports scholarship for outstanding cricket performance at the state level. Balanced academic responsibilities with rigorous training schedules while maintaining excellent performance in both areas.',
      skills: ['Cricket', 'Time Management', 'Academics']
    },
    {
      id: '4',
      title: 'Cricket Performance Analytics',
      category: 'Analyst',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Developed comprehensive cricket performance analytics tracking player statistics, match data, and performance metrics. Created detailed reports for coaches and players to improve game strategies.',
      skills: ['Cricket Analytics', 'Performance Metrics', 'Data Analysis', 'Strategy']
    },
    {
      id: '5',
      title: 'Live Cricket Scoring System',
      category: 'Cricket Content Creator',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Built a real-time cricket scoring platform that tracks live match statistics, player performance, and generates comprehensive match reports. Used by local cricket clubs for tournament management.',
      skills: ['Cricket Scoring', 'Live Analytics', 'Match Management', 'Data Visualization']
    }
  ],
  clientReviews: [
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      comment: "Amazing work! Exceeded my expectations.",
      date: "2023-05-15"
    },
    {
      id: "2",
      author: "Mike Chen",
      rating: 5,
      comment: "Great communication and delivered on time.",
      date: "2023-04-22"
    }
  ],
  availability: [
    { day: "Monday", available: true },
    { day: "Tuesday", available: true },
    { day: "Wednesday", available: true },
    { day: "Thursday", available: true },
    { day: "Friday", available: true },
    { day: "Saturday", available: false },
    { day: "Sunday", available: false }
  ],
  completedJobs: 124,
  activeJobs: 5
};
