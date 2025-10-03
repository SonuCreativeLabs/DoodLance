export interface Booking {
  "#": string
  service: string
  provider: string
  image: string
  date: string
  time: string
  status: 'confirmed' | 'ongoing' | 'completed' | 'cancelled'
  location: string
  price: string
  rating: number
  completedJobs: number
  description: string
  category: string
}

export interface Application {
  "#": string
  jobTitle: string
  freelancer: {
    name: string
    image: string
    rating: number
    completedJobs: number
    responseTime: string
    location: string
  }
  proposal: string
  price: string
  availability: string
  status: 'new' | 'accepted' | 'rejected'
}

export interface HistoryJob {
  "#": string
  title: string
  freelancer: {
    name: string
    image: string
    rating: number
  }
  completedDate: string
  status: string
  yourRating: number
  earnedMoney: string
}

export const bookings: Booking[] = [
  {
    "#": "#TNCHE001",
    service: "Batting Coaching",
    provider: "Rahul Sharma",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().getHours() < 11 ? "11:00 AM" : "5:00 PM", // Future time today
    status: "ongoing",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,200/session",
    rating: 4.8,
    completedJobs: 342,
    description: "Advanced batting technique and shot selection coaching",
    category: "cricket"
  },
  {
    "#": "#TNCHE002",
    service: "Bowling Training",
    provider: "Irfan Pathan",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Irfan",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "5:00 PM",
    status: "confirmed",
    location: "MA Chidambaram Stadium, Chennai",
    price: "₹800/hr",
    rating: 4.9,
    completedJobs: 234,
    description: "Fast bowling technique and pace bowling mastery",
    category: "cricket"
  },
  {
    "#": "#TNCHE003",
    service: "Fielding Practice",
    provider: "Virat Kohli",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Virat",
    date: new Date().toISOString().split('T')[0], // Today
    time: new Date().getHours() < 16 ? "4:30 PM" : "8:30 PM", // Future time today
    status: "ongoing",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,000/session",
    rating: 4.6,
    completedJobs: 145,
    description: "Advanced fielding drills and catching techniques",
    category: "cricket"
  },
  {
    "#": "#TNALWA001",
    service: "Cricket Fitness Training",
    provider: "Sachin Tendulkar",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sachin",
    date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: "5:30 PM",
    status: "confirmed",
    location: "Alwarpet Cricket Academy, Chennai",
    price: "₹1,500/month",
    rating: 5.0,
    completedJobs: 312,
    description: "Cricket-specific fitness and endurance training",
    category: "cricket"
  }
]

export const applications: Application[] = [
  {
    "#": "#TNADYR001",
    jobTitle: "Spin Bowling Coach",
    freelancer: {
      name: "Ravichandran Ashwin",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ashwin",
      rating: 4.7,
      completedJobs: 156,
      responseTime: "Usually responds in 30 mins",
      location: "2.5 km away - Adyar",
    },
    proposal: "I have 8 years of experience in professional spin bowling coaching. I specialize in off-spin and carrom ball techniques.",
    price: "₹1,800/session",
    availability: "Available this weekend",
    status: "new"
  },
  {
    "#": "#TNTNAG001",
    jobTitle: "Batting Coach",
    freelancer: {
      name: "Rohit Sharma",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit",
      rating: 4.5,
      completedJobs: 98,
      responseTime: "Usually responds in 1 hour",
      location: "3.8 km away - T Nagar",
    },
    proposal: "Expert in batting technique and shot selection. Specialized in opening batting and limited overs cricket.",
    price: "₹1,200/session",
    availability: "Available tomorrow",
    status: "accepted"
  },
  {
    "#": "#TNMYLA001",
    jobTitle: "Cricket Analyst",
    freelancer: {
      name: "Sunil Gavaskar",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunil",
      rating: 4.2,
      completedJobs: 75,
      responseTime: "Usually responds in 45 mins",
      location: "1.5 km away - Mylapore",
    },
    proposal: "Certified cricket analyst with experience in match analysis and performance improvement strategies.",
    price: "₹1,500/session",
    availability: "Available today",
    status: "rejected"
  }
]

export const historyJobs: HistoryJob[] = [
  {
    "#": "#TNCHE101",
    title: "Fast Bowling Training",
    freelancer: {
      name: "Jasprit Bumrah",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bumrah",
      rating: 4.9,
    },
    completedDate: "2024-03-10",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹12,500"
  },
  {
    "#": "#TNCHE102",
    title: "Batting Practice Session",
    freelancer: {
      name: "KL Rahul",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=KL",
      rating: 4.7,
    },
    completedDate: "2024-03-08",
    status: "Cancelled",
    yourRating: 4,
    earnedMoney: "₹10,000"
  },
  {
    "#": "#TNCHE103",
    title: "Wicket Keeping Training",
    freelancer: {
      name: "MS Dhoni",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dhoni",
      rating: 4.8,
    },
    completedDate: "2024-03-08",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹15,000"
  },
  {
    "#": "#TNCHE104",
    title: "Cricket Match Analysis",
    freelancer: {
      name: "Anil Kumble",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kumble",
      rating: 4.8,
    },
    completedDate: "2024-03-05",
    status: "Completed",
    yourRating: 5,
    earnedMoney: "₹16,500"
  }
] 