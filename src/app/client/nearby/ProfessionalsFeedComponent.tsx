import React, { useState } from 'react';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';

// Mock data for freelancers
const nearbyFreelancers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    service: "AC Repair & Service",
    rating: 4.8,
    reviews: 156,
    completedJobs: 230,
    location: "Anna Nagar",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.2,
    price: 500,
    priceUnit: "visit"
  },
  {
    id: 2,
    name: "Priya Lakshmi",
    service: "Home Cleaning",
    rating: 4.9,
    reviews: 203,
    completedJobs: 180,
    location: "T Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.5,
    price: 1200,
    priceUnit: "day"
  },
  {
    id: 3,
    name: "Arun Prakash",
    service: "Cricket Coach",
    rating: 4.9,
    reviews: 128,
    completedJobs: 150,
    location: "Chepauk",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.1,
    price: 1000,
    priceUnit: "session"
  },
  {
    id: 4,
    name: "Divya Shankar",
    service: "Carnatic Music Teacher",
    rating: 4.9,
    reviews: 178,
    completedJobs: 200,
    location: "Mylapore",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.8,
    price: 800,
    priceUnit: "hour"
  },
  {
    id: 5,
    name: "Karthik Raja",
    service: "Car Driving Instructor",
    rating: 4.6,
    reviews: 142,
    completedJobs: 165,
    location: "Adyar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.7,
    price: 600,
    priceUnit: "hour"
  },
  {
    id: 6,
    name: "Meena Kumari",
    service: "Bharatanatyam Teacher",
    rating: 4.8,
    reviews: 189,
    completedJobs: 210,
    location: "Alwarpet",
    responseTime: "Usually responds in 3 hours",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 4.2,
    price: 1500,
    priceUnit: "month"
  },
  {
    id: 7,
    name: "Senthil Kumar",
    service: "Fitness Trainer",
    rating: 4.7,
    reviews: 165,
    completedJobs: 190,
    location: "Nungambakkam",
    responseTime: "Usually responds in 30 mins",
    image: "https://images.unsplash.com/photo-1534368420009-621bfab424a8?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.5,
    price: 700,
    priceUnit: "session"
  },
  {
    id: 8,
    name: "Fathima Begum",
    service: "Mehendi Artist",
    rating: 4.9,
    reviews: 220,
    completedJobs: 250,
    location: "Royapettah",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.9,
    price: 2000,
    priceUnit: "event"
  },
  {
    id: 9,
    name: "Ramesh Babu",
    service: "Guitar Teacher",
    rating: 4.7,
    reviews: 145,
    completedJobs: 170,
    location: "Kodambakkam",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 5.1,
    price: 600,
    priceUnit: "hour"
  },
  {
    id: 10,
    name: "Lakshmi Narayanan",
    service: "Yoga Instructor",
    rating: 4.8,
    reviews: 198,
    completedJobs: 220,
    location: "Besant Nagar",
    responseTime: "Usually responds in 1 hour",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.8,
    price: 500,
    priceUnit: "session"
  },
  {
    id: 11,
    name: "Vijay Kumar",
    service: "Swimming Coach",
    rating: 4.9,
    reviews: 167,
    completedJobs: 190,
    location: "Velachery",
    responseTime: "Usually responds in 45 mins",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 4.5,
    price: 800,
    priceUnit: "session"
  },
  {
    id: 12,
    name: "Anitha Rajan",
    service: "Tailoring & Alterations",
    rating: 4.8,
    reviews: 210,
    completedJobs: 245,
    location: "West Mambalam",
    responseTime: "Usually responds in 2 hours",
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.2,
    price: 400,
    priceUnit: "piece"
  }
];

export default function ProfessionalsFeed() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {nearbyFreelancers.map(freelancer => (
        <div
          key={freelancer.id}
          className="bg-[#111111] shadow-lg hover:shadow-xl rounded-xl p-4 border border-white/10 hover:border-purple-300/30 transition-all duration-200 relative"
        >
          {/* Heart icon */}
          <button
            className={`absolute top-3 right-3 z-20 p-1 transition-colors ${favoriteIds.includes(freelancer.id) ? 'text-red-500' : 'text-white/60 hover:text-red-400'}`}
            style={{ background: 'transparent', border: 'none' }}
            onClick={() => handleToggleFavorite(freelancer.id)}
            aria-label="Add to favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteIds.includes(freelancer.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
            </svg>
          </button>
          <div className="flex items-start gap-4">
            <div className="relative flex flex-col items-center w-20">
              <div className="relative mt-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <img
                  src={freelancer.image}
                  alt={freelancer.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-200/50 relative z-10"
                />
              </div>
              {/* Rating */}
              <div className="flex flex-col items-center mt-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-white">{freelancer.rating}</span>
                </div>
                <span className="text-xs text-white/70 mt-1">({freelancer.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white leading-tight mb-1">{freelancer.name}</h3>
              </div>
              <div className="flex items-center text-sm text-white/80 mt-1 font-medium">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{freelancer.service}</span>
              </div>
              <div className="flex items-center text-sm text-white/60 mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{freelancer.location}</span>
              </div>
              <div className="flex items-center text-sm text-white/60 mt-1">
                <Clock className="w-4 h-4 mr-2" />
                <span>{freelancer.responseTime}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-1.5 px-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 text-sm font-bold">
                  Book Now
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 text-purple-100 py-1.5 px-3 rounded-lg transition-all duration-300 border border-white/10 text-sm font-bold">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 