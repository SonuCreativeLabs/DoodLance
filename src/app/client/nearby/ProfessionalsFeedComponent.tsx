import React, { useState } from 'react';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';

// Mock data for freelancers (copy from page.tsx)
const nearbyFreelancers = [
  {
    id: 1,
    name: "John Smith",
    service: "Plumbing Services",
    rating: 4.8,
    reviews: 156,
    completedJobs: 156,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "2.5 km away",
    responseTime: "Usually responds in 30 mins"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 203,
    completedJobs: 203,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "1.8 km away",
    responseTime: "Usually responds in 15 mins"
  },
  {
    id: 3,
    name: "Mike Wilson",
    service: "Electrical Work",
    rating: 4.7,
    reviews: 128,
    completedJobs: 128,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "3.2 km away",
    responseTime: "Usually responds in 45 mins"
  },
  {
    id: 4,
    name: "Emma Davis",
    service: "Pet Sitting",
    rating: 4.9,
    reviews: 89,
    completedJobs: 89,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    location: "1.5 km away",
    responseTime: "Usually responds in 20 mins"
  },
  {
    id: 5,
    name: "David Brown",
    service: "Gardening",
    rating: 4.6,
    reviews: 112,
    completedJobs: 112,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    location: "2.8 km away",
    responseTime: "Usually responds in 1 hour"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    service: "Tutoring",
    rating: 4.9,
    reviews: 167,
    completedJobs: 167,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    location: "3.5 km away",
    responseTime: "Usually responds in 25 mins"
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