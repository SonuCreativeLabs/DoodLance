import { Star, Clock, MapPin, Calendar } from 'lucide-react'

export interface Booking {
  id: number
  service: string
  provider: string
  image: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  location: string
  price: string
  rating: number
  completedJobs: number
  description: string
  category: string
}

export interface Application {
  id: number
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
  id: number
  title: string
  freelancer: {
    name: string
    image: string
    rating: number
  }
  completedDate: string
  status: string
  yourRating: number
}

export const bookings: Booking[] = [
  {
    id: 1,
    service: "AC Service & Repair",
    provider: "Rajesh Kumar",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().getHours() < 11 ? "11:00 AM" : "5:00 PM", // Future time today
    status: "confirmed",
    location: "Anna Nagar East, Chennai",
    price: "₹1,200",
    rating: 4.8,
    completedJobs: 342,
    description: "Split AC deep cleaning and general maintenance",
    category: "appliance-repair"
  },
  {
    id: 2,
    service: "Carnatic Vocal Classes",
    provider: "Priya Lakshmi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    time: "5:00 PM",
    status: "pending",
    location: "Mylapore, Chennai",
    price: "₹800/hr",
    rating: 4.9,
    completedJobs: 234,
    description: "Advanced Carnatic vocal training - Varnam and Kriti",
    category: "music"
  },
  {
    id: 3,
    service: "Home Deep Cleaning",
    provider: "Lakshmi Devi",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    time: "9:00 AM",
    status: "completed",
    location: "T Nagar, Chennai",
    price: "₹2,500",
    rating: 4.7,
    completedJobs: 189,
    description: "Complete home deep cleaning with sanitization",
    category: "cleaning"
  },
  {
    id: 4,
    service: "Cricket Coaching",
    provider: "Arun Kumar",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun",
    date: new Date().toISOString().split('T')[0], // Today
    time: new Date().getHours() < 16 ? "4:30 PM" : "8:30 PM", // Future time today
    status: "confirmed",
    location: "Chepauk Stadium, Chennai",
    price: "₹1,000/session",
    rating: 4.6,
    completedJobs: 145,
    description: "Personal cricket coaching - Batting technique",
    category: "sports"
  },
  {
    id: 5,
    service: "Bharatanatyam Class",
    provider: "Meena Kumari",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meena",
    date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    time: "5:30 PM",
    status: "confirmed",
    location: "Alwarpet, Chennai",
    price: "₹1,500/month",
    rating: 5.0,
    completedJobs: 312,
    description: "Classical dance training - Adavus and Mudras",
    category: "dance"
  }
]

export const applications: Application[] = [
  {
    id: 1,
    jobTitle: "Home Cleaning Service",
    freelancer: {
      name: "Selvi Murugan",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selvi",
      rating: 4.7,
      completedJobs: 156,
      responseTime: "Usually responds in 30 mins",
      location: "2.5 km away - Adyar",
    },
    proposal: "I have 8 years of experience in professional home cleaning. I specialize in traditional cleaning methods and use eco-friendly products.",
    price: "₹1,800",
    availability: "Available this weekend",
    status: "new"
  },
  {
    id: 2,
    jobTitle: "Plumbing Service",
    freelancer: {
      name: "Ravi Kumar",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
      rating: 4.5,
      completedJobs: 98,
      responseTime: "Usually responds in 1 hour",
      location: "3.8 km away - T Nagar",
    },
    proposal: "Expert in fixing leaks, pipe installations, and bathroom fittings. Available for emergency services.",
    price: "₹1,200",
    availability: "Available tomorrow",
    status: "accepted"
  },
  {
    id: 3,
    jobTitle: "Electrician Service",
    freelancer: {
      name: "Mohammed Ali",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
      rating: 4.2,
      completedJobs: 75,
      responseTime: "Usually responds in 45 mins",
      location: "1.5 km away - Mylapore",
    },
    proposal: "Certified electrician with experience in residential and commercial work. Safety is my top priority.",
    price: "₹1,500",
    availability: "Available today",
    status: "rejected"
  }
]

export const historyJobs: HistoryJob[] = [
  {
    id: 1,
    title: "Plumbing Work",
    freelancer: {
      name: "Murugan Vel",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Murugan",
      rating: 4.9,
    },
    completedDate: "2024-03-10",
    status: "Completed",
    yourRating: 5,
  }
] 