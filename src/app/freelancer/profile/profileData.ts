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
  services: any[];
  portfolio: PortfolioItem[];
  clientReviews: any[];
  availability: any[];
  completedJobs: number;
  activeJobs: number;
}

export const freelancerData: ExtendedFreelancerData = {
  name: "Sathish Sonu",
  title: "All Rounder",
  about: "I'm a passionate AI engineer and full-stack developer with expertise in building intelligent applications. I specialize in AI agents, prompt engineering, and modern web development.",
  rating: 4.9,
  reviewCount: 42,
  responseTime: "1h",
  deliveryTime: "2 days",
  completionRate: 100,
  online: true,
  location: "Chennai, India",
  skills: ["RH Batsman", "Sidearm Specialist", "Off Spin", "Coach", "Analyst", "Mystery Spin"],
  services: [
    {
      id: "1",
      title: "UI/UX Design",
      description: "Custom UI/UX design for your web or mobile application.",
      price: "$500",
      deliveryTime: "7 days"
    },
    {
      id: "2",
      title: "Frontend Development",
      description: "Frontend development with React and TypeScript.",
      price: "$800",
      deliveryTime: "14 days"
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
      title: 'AI-Powered Cricket Analytics',
      category: 'AI/ML Development',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Developed a machine learning model to analyze cricket match data and predict outcomes with 85% accuracy. The system processes player statistics, pitch conditions, and historical match data to provide actionable insights for coaches and players.',
      skills: ['Machine Learning', 'Data Analysis', 'Python', 'Cricket']
    },
    {
      id: '5',
      title: 'Vibe Code Framework',
      category: 'Open Source AI',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'An open-source framework for building AI agents with personality and contextual awareness. The framework enables developers to create more human-like AI interactions with built-in emotional intelligence and contextual understanding.',
      skills: ['Open Source', 'AI', 'Framework', 'TypeScript']
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
